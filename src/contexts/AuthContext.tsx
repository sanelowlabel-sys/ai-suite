import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  updateDoc, 
  addDoc,
  collection,
  onSnapshot,
  increment, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

export interface UserProfile {
  userId: string;
  email: string | null;
  displayName?: string | null;
  subscriptionTier: 'free' | 'pro' | 'premium';
  usageCount: number;
  lastUsageReset?: any;
  createdAt?: any;
}

export interface ToolExecutionRecord {
  id: string;
  userId: string;
  toolId: string;
  toolName: string;
  category: string;
  input: string;
  result: string;
  createdAt: any;
}

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'signup';
  openAuthModal: (tab?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signIn: () => void; // Shortcut for modal or quick sign in
  logout: () => Promise<void>;
  incrementUsage: () => Promise<boolean>;
  saveExecution: (data: {
    toolId: string;
    toolName: string;
    category: string;
    input: string;
    result: string;
  }) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'signup'>('login');

  const openAuthModal = (tab: 'login' | 'signup' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const signIn = () => {
    openAuthModal('login');
  };

  // Real-time Auth State & Real-time Firestore Profile Sync
  useEffect(() => {
    let unsubscribeProfileSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (unsubscribeProfileSnapshot) {
        unsubscribeProfileSnapshot();
        unsubscribeProfileSnapshot = null;
      }

      if (firebaseUser) {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Listen in REAL-TIME using onSnapshot
        unsubscribeProfileSnapshot = onSnapshot(
          userDocRef,
          async (snapshot) => {
            if (!snapshot.exists()) {
              // Initialize profile document
              const newProfile: UserProfile = {
                userId: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Creator',
                subscriptionTier: 'free',
                usageCount: 0,
                lastUsageReset: serverTimestamp(),
                createdAt: serverTimestamp(),
              };

              try {
                await setDoc(userDocRef, newProfile);
              } catch (err) {
                handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
              }
            } else {
              setProfile(snapshot.data() as UserProfile);
            }
            setLoading(false);
          },
          (error) => {
            handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
          }
        );
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfileSnapshot) {
        unsubscribeProfileSnapshot();
      }
    };
  }, []);

  // Real-time Google Sign In
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
    } catch (error: any) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };

  // Real-time Email & Password Sign In
  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      closeAuthModal();
    } catch (error: any) {
      console.error("Email sign in failed:", error);
      throw error;
    }
  };

  // Real-time Email & Password Sign Up
  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (name && cred.user) {
        await updateProfile(cred.user, { displayName: name });
      }
      closeAuthModal();
    } catch (error: any) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Real-time usage increment
  const incrementUsage = async (): Promise<boolean> => {
    if (!user || !profile) return false;

    // Check tier limits
    if (profile.subscriptionTier === 'free' && profile.usageCount >= 10) {
      return false;
    }

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        usageCount: increment(1)
      });
      // Profile state will automatically update via onSnapshot!
      return true;
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      return false;
    }
  };

  // Real-time Tool Execution Save
  const saveExecution = async (data: {
    toolId: string;
    toolName: string;
    category: string;
    input: string;
    result: string;
  }): Promise<string | null> => {
    if (!user) return null;

    try {
      const executionsColRef = collection(db, 'users', user.uid, 'executions');
      const docRef = await addDoc(executionsColRef, {
        userId: user.uid,
        toolId: data.toolId,
        toolName: data.toolName,
        category: data.category,
        input: data.input.slice(0, 14000),
        result: data.result.slice(0, 60000),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${user.uid}/executions`);
      return null;
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signIn,
    logout,
    incrementUsage,
    saveExecution,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
