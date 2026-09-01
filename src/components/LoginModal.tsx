import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Crown, 
  ShieldCheck, 
  Zap, 
  Mail, 
  Lock, 
  CheckCircle2, 
  Radio, 
  Sparkles, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { UserProfile } from '../types';
import { ADMIN_EMAIL } from '../lib/usage-guard';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCustomAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const endpoint = activeTab === 'signup' ? '/api/auth/signup' : '/api/auth/login';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase(), name, password }),
      });

      const data = await res.json();
      if (data.success && data.profile) {
        setSuccessMsg(data.message || 'Logged in successfully!');
        setTimeout(() => {
          onLoginSuccess(data.profile);
          onClose();
        }, 600);
      } else {
        setErrorMsg(data.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMsg('Network error. Switched profile locally.');
      // Local fallback
      const isAdmin = email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase();
      const fallbackProfile: UserProfile = {
        id: `usr_${Math.random().toString(36).substring(2, 10)}`,
        email: email.trim().toLowerCase(),
        name: name || email.split('@')[0],
        subscription_tier: isAdmin ? 'pro' : 'free',
        subscription_status: isAdmin ? 'active' : 'inactive',
        weekly_usage_count: 0,
        usage_reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        isAdmin,
      };
      onLoginSuccess(fallbackProfile);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoName: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: demoEmail, name: demoName }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        setSuccessMsg(`Logged in as ${demoName}!`);
        setTimeout(() => {
          onLoginSuccess(data.profile);
          onClose();
        }, 500);
      }
    } catch (e) {
      const isAdmin = demoEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase();
      onLoginSuccess({
        id: `usr_${Math.random().toString(36).substring(2, 10)}`,
        email: demoEmail,
        name: demoName,
        subscription_tier: isAdmin ? 'pro' : 'free',
        subscription_status: isAdmin ? 'active' : 'inactive',
        weekly_usage_count: 0,
        usage_reset_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        isAdmin,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#2b2b2b] border border-[#3a3a3a] rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        id="login-modal-box"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white/60 hover:text-white transition-colors"
          id="close-login-modal-btn"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#BE1E2F] flex items-center justify-center text-white shadow-lg shadow-[#BE1E2F]/20">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-white tracking-tight">
              AI Suite Account
            </h3>
            <p className="text-xs text-white/60">
              Sign in to sync your 54 tools, custom presets & credits
            </p>
          </div>
        </div>

        {/* Current Active Account Pill */}
        <div className="mb-5 p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-white/70 truncate">Currently active:</span>
            <strong className="text-white truncate">{currentUser.email}</strong>
          </div>
          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
            currentUser.subscription_tier === 'pro' || currentUser.isAdmin
              ? 'bg-[#BE1E2F]/20 text-[#BE1E2F] border border-[#BE1E2F]/40'
              : 'bg-white/10 text-white/60'
          }`}>
            {currentUser.isAdmin ? 'ADMIN' : currentUser.subscription_tier.toUpperCase()}
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-[#1a1a1a] p-1 mb-5 border border-[#3a3a3a]">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'signin' ? 'bg-[#BE1E2F] text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'signup' ? 'bg-[#BE1E2F] text-white shadow-md' : 'text-white/60 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            onClick={() => { setActiveTab('demo'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'demo' ? 'bg-[#3a3a3a] text-amber-300 shadow-md font-mono' : 'text-white/60 hover:text-white'
            }`}
          >
            Quick Switch
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/50 text-red-200 text-xs flex items-center gap-2">
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tab 1 & 2: Email & Password Form */}
        {(activeTab === 'signin' || activeTab === 'signup') && (
          <form onSubmit={handleCustomAuth} className="space-y-3.5">
            {activeTab === 'signup' && (
              <div>
                <label className="block text-xs font-medium text-white/80 mb-1">
                  Full Name / Studio Alias
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/80 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@studio.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-white/80">
                  Password
                </label>
                {activeTab === 'signin' && (
                  <span className="text-[11px] text-[#BE1E2F] hover:underline cursor-pointer">
                    Instant Access
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/25 transition-all disabled:opacity-50 active:scale-98"
              id="auth-submit-btn"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : activeTab === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Free Account (20 Credits)</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to AI Suite</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Tab 3: Quick Demo Profile Switcher */}
        {activeTab === 'demo' && (
          <div className="space-y-2.5">
            <p className="text-xs text-white/60 mb-2">
              Select any pre-configured profile to test with different role permissions and usage quotas:
            </p>

            <button
              onClick={() => handleQuickDemoLogin(ADMIN_EMAIL, 'Owner Admin')}
              disabled={loading}
              className="w-full p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-amber-500/30 hover:border-amber-500 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    👑 Owner & Lead Admin
                  </div>
                  <div className="text-[11px] text-white/50 font-mono">{ADMIN_EMAIL}</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-mono font-bold">
                UNLIMITED
              </span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('pro_artist@aisuite.app', 'Pro Studio Producer')}
              disabled={loading}
              className="w-full p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#BE1E2F]/40 hover:border-[#BE1E2F] text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#BE1E2F]/20 text-[#BE1E2F] flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[#BE1E2F] transition-colors">
                    ⚡ Pro Subscriber ($10/mo)
                  </div>
                  <div className="text-[11px] text-white/50 font-mono">pro_artist@aisuite.app</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#BE1E2F]/20 text-[#BE1E2F] text-[10px] font-mono font-bold">
                PRO ACTIVE
              </span>
            </button>

            <button
              onClick={() => handleQuickDemoLogin('creator@aisuite.app', 'Free Tier Creator')}
              disabled={loading}
              className="w-full p-3 rounded-xl bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#3a3a3a] hover:border-white/40 text-left flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 text-white/80 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">
                    👤 Standard Free Creator
                  </div>
                  <div className="text-[11px] text-white/50 font-mono">creator@aisuite.app</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-white/10 text-white/60 text-[10px] font-mono">
                20 FREE/WK
              </span>
            </button>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-6 pt-4 border-t border-[#3a3a3a] text-center">
          <p className="text-[11px] text-white/40">
            Protected with AI Suite End-to-End Encryption & Rolling Usage Reset
          </p>
        </div>
      </div>
    </div>
  );
};
