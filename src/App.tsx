import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ToolGrid } from './components/ToolGrid';
import { ToolPageRouter } from './components/ToolPageRouter';
import { PaywallModal } from './components/PaywallModal';
import { SearchModal } from './components/SearchModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { LoginModal } from './components/LoginModal';
import { AdminPanel } from './components/AdminPanel';
import { SmartLinksTool } from './components/tools/SmartLinksTool';
import { UserProfile } from './types';
import { ADMIN_EMAIL, getInitialProfile } from './lib/usage-guard';
import { getToolBySlug } from './data/tools';
import { Radio, Heart, ShieldCheck, Zap, Disc, Sparkles } from 'lucide-react';

export function App() {
  const [user, setUser] = useState<UserProfile>(() => getInitialProfile(ADMIN_EMAIL));
  const [currentView, setCurrentView] = useState<'home' | 'tool' | 'admin' | 'smart-links'>('home');
  const [selectedToolSlug, setSelectedToolSlug] = useState<string>('ai-voice-generator');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Fetch initial profile from backend on boot
  useEffect(() => {
    fetch(`/api/user/profile?email=${encodeURIComponent(user.email)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setUser(data.profile);
        }
      })
      .catch((e) => console.error('Failed to sync profile', e));
  }, [user.email]);

  // Handle URL hash changes for deep linking (e.g., #/tools/ai-voice-generator)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash.startsWith('tools/')) {
        const slug = hash.replace('tools/', '');
        setSelectedToolSlug(slug);
        setCurrentView('tool');
      } else if (hash === 'smart-links') {
        setCurrentView('smart-links');
      } else if (hash === 'admin') {
        setCurrentView('admin');
      } else {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global CMD+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectTool = (slug: string) => {
    setSelectedToolSlug(slug);
    setCurrentView('tool');
    window.location.hash = `/tools/${slug}`;
  };

  const handleNavigateHome = () => {
    setCurrentView('home');
    window.location.hash = '/';
  };

  const handleSwitchUserEmail = async (newEmail: string) => {
    try {
      const res = await fetch(`/api/user/profile?email=${encodeURIComponent(newEmail)}`);
      const data = await res.json();
      if (data.success && data.profile) {
        setUser(data.profile);
      } else {
        setUser(getInitialProfile(newEmail));
      }
    } catch (e) {
      setUser(getInitialProfile(newEmail));
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white flex flex-col selection:bg-[#BE1E2F] selection:text-white">
      
      {/* Global Navbar */}
      <Navbar
        user={user}
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          if (currentView !== 'home') {
            setCurrentView('home');
            window.location.hash = '/';
          }
        }}
        onOpenPaywall={() => setIsPaywallOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSmartLinks={() => {
          setCurrentView('smart-links');
          window.location.hash = '/smart-links';
        }}
        onOpenAdmin={() => {
          setCurrentView('admin');
          window.location.hash = '/admin';
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
        onNavigateHome={handleNavigateHome}
        onSwitchUserEmail={handleSwitchUserEmail}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {currentView === 'home' && (
          <ToolGrid
            user={user}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectTool={handleSelectTool}
            onOpenPaywall={() => setIsPaywallOpen(true)}
          />
        )}

        {currentView === 'tool' && (
          <ToolPageRouter
            slug={selectedToolSlug}
            user={user}
            onNavigateHome={handleNavigateHome}
            onSelectTool={handleSelectTool}
            onOpenPaywall={() => setIsPaywallOpen(true)}
            onUpdateUserProfile={setUser}
          />
        )}

        {currentView === 'smart-links' && (
          <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
            <SmartLinksTool
              tool={getToolBySlug('ai-link-shortener')!}
              user={user}
            />
          </div>
        )}

        {currentView === 'admin' && (
          <AdminPanel
            user={user}
            onClose={handleNavigateHome}
            onUpdateUserProfile={setUser}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <PaywallModal
        isOpen={isPaywallOpen}
        onClose={() => setIsPaywallOpen(false)}
        user={user}
        onUpgradeSuccess={(updatedProfile) => {
          setUser(updatedProfile);
        }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={user}
        onLoginSuccess={(updatedProfile) => {
          setUser(updatedProfile);
        }}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTool={handleSelectTool}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectTool={handleSelectTool}
      />

      {/* Global Studio Footer */}
      <footer className="bg-[#141414] border-t border-[#3a3a3a] py-8 px-4 sm:px-8 mt-12 text-xs text-white/50 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-lg bg-[#BE1E2F] flex items-center justify-center text-white">
              <Radio className="w-3.5 h-3.5" />
            </div>
            <span className="font-display text-white font-bold tracking-tight">AI SUITE</span>
            <span>•</span>
            <span>54 Production AI Engines</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-white/60">
            <span>Owner: <strong className="text-white">sanelowlabel@gmail.com</strong></span>
            <span>•</span>
            <span>20 Free Weekly Credits</span>
            <span>•</span>
            <span className="text-[#BE1E2F] font-bold">$10/mo Unlimited Pro Tier</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Realtime AI Engine & Telemetry</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
export default App;
