import React, { useState } from 'react';
import { 
  Zap, 
  Crown, 
  Search, 
  Sparkles, 
  User, 
  History, 
  Link2, 
  ShieldCheck, 
  SlidersHorizontal,
  ChevronDown,
  Clock,
  Flame,
  Radio,
  LogIn,
  Layers
} from 'lucide-react';
import { UserProfile, ToolCategory } from '../types';
import { getTimeUntilReset } from '../lib/usage-guard';

interface NavbarProps {
  user: UserProfile;
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onOpenPaywall: () => void;
  onOpenSearch: () => void;
  onOpenHistory: () => void;
  onOpenSmartLinks: () => void;
  onOpenAdmin: () => void;
  onOpenLogin: () => void;
  onNavigateHome: () => void;
  onSwitchUserEmail: (email: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeCategory,
  onSelectCategory,
  onOpenPaywall,
  onOpenSearch,
  onOpenHistory,
  onOpenSmartLinks,
  onOpenAdmin,
  onOpenLogin,
  onNavigateHome,
  onSwitchUserEmail,
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const categories: ToolCategory[] = [
    'Audio & Music',
    'Marketing & Writing',
    'Image & Visual',
    'PDF & Documents',
    'Media Converters',
    'SEO & Analytics',
    'Video AI'
  ];

  const isPro = user.subscription_tier === 'pro' || user.isAdmin;
  const remaining = isPro ? 'UNLIMITED' : Math.max(0, 20 - user.weekly_usage_count);
  const percentUsed = isPro ? 100 : Math.min(100, (user.weekly_usage_count / 20) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-[#3a3a3a] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <button 
            onClick={onNavigateHome}
            className="flex items-center gap-3 text-left group focus:outline-none"
            id="nav-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BE1E2F] to-[#7a0f1c] flex items-center justify-center shadow-lg shadow-[#BE1E2F]/20 border border-[#BE1E2F]/40 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display text-xl font-bold tracking-tight text-white group-hover:text-[#BE1E2F] transition-colors">
                  AI SUITE
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#BE1E2F]/20 text-[#BE1E2F] border border-[#BE1E2F]/40 font-mono font-bold">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-white/50 font-mono hidden sm:block">54 AI Creative & Web Engines</p>
            </div>
          </button>

          {/* Quick Categories Bar (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1">
            <button
              onClick={() => onSelectCategory('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeCategory === 'All'
                  ? 'bg-[#BE1E2F] text-white shadow-md shadow-[#BE1E2F]/30 font-bold'
                  : 'text-white/70 hover:text-white hover:bg-[#2b2b2b]'
              }`}
            >
              All Tools (54)
            </button>
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? 'bg-[#2b2b2b] text-[#BE1E2F] border border-[#BE1E2F]/40 font-bold'
                    : 'text-white/70 hover:text-white hover:bg-[#2b2b2b]'
                }`}
              >
                {cat}
              </button>
            ))}

            {/* More Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-white/70 hover:text-white hover:bg-[#2b2b2b] flex items-center gap-1"
              >
                More <ChevronDown className="w-3 h-3" />
              </button>
              {categoryDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-48 bg-[#2b2b2b] border border-[#3a3a3a] rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setCategoryDropdownOpen(false)}
                >
                  {categories.slice(4).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setCategoryDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-white/80 hover:text-white hover:bg-[#3a3a3a] transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Center/Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F]/50 text-white/70 hover:text-white text-xs transition-all"
            id="nav-search-btn"
            title="Search 54 AI Tools"
          >
            <Search className="w-3.5 h-3.5 text-[#BE1E2F]" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-[#1a1a1a] text-[10px] font-mono text-white/40 border border-[#3a3a3a]">
              ⌘K
            </kbd>
          </button>

          {/* Smart Links Dashboard Button */}
          <button
            onClick={onOpenSmartLinks}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F]/50 text-white/80 hover:text-white text-xs transition-colors"
            id="nav-smart-links-btn"
          >
            <Link2 className="w-3.5 h-3.5 text-white/70" />
            <span>Smart Links</span>
          </button>

          {/* Execution History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F]/50 text-white/80 hover:text-white text-xs transition-colors"
            id="nav-history-btn"
            title="Execution Logs"
          >
            <History className="w-3.5 h-3.5 text-white/70" />
            <span className="hidden lg:inline">Logs</span>
          </button>

          {/* Credits Counter / Tier Indicator */}
          {isPro ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 via-[#BE1E2F]/20 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-medium shadow-sm">
              <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PRO UNLIMITED</span>
            </div>
          ) : (
            <div 
              onClick={onOpenPaywall}
              className="cursor-pointer group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F] transition-all"
              title="Click to view upgrade options"
            >
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs font-mono">
                  <span className="text-white font-bold">{remaining}</span>
                  <span className="text-white/40">/ 20</span>
                  <span className="text-white/60 text-[10px]">Free</span>
                </div>
                <div className="w-16 h-1 bg-[#1a1a1a] rounded-full overflow-hidden mt-0.5">
                  <div 
                    className={`h-full transition-all ${
                      user.weekly_usage_count >= 18 ? 'bg-[#BE1E2F]' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${100 - percentUsed}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* $10 Unlimited Upgrade Action Button */}
          {!isPro && (
            <button
              onClick={onOpenPaywall}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-semibold shadow-lg shadow-[#BE1E2F]/25 hover:shadow-[#BE1E2F]/40 border border-[#BE1E2F] transition-all active:scale-95"
              id="nav-upgrade-btn"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>$10 Upgrade</span>
            </button>
          )}

          {/* Sign In / Account Button */}
          <button
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F] text-white text-xs font-medium transition-colors"
            id="nav-login-direct-btn"
          >
            <LogIn className="w-3.5 h-3.5 text-[#BE1E2F]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* User Account Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-8 h-8 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F] flex items-center justify-center text-white/80 hover:text-white transition-colors"
              id="nav-user-dropdown-btn"
              title="User Account"
            >
              <User className="w-4 h-4" />
            </button>

            {userDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-[#2b2b2b] border border-[#3a3a3a] rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-xs"
                onMouseLeave={() => setUserDropdownOpen(false)}
              >
                <div className="border-b border-[#3a3a3a] pb-3 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{user.email}</span>
                    {user.isAdmin ? (
                      <span className="px-1.5 py-0.5 rounded bg-[#BE1E2F]/20 text-[#BE1E2F] text-[10px] font-mono border border-[#BE1E2F]/30">
                        ADMIN
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-white/10 text-white/60 text-[10px] font-mono">
                        {user.subscription_tier.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/50 mt-1">
                    {isPro ? 'Unlimited Studio Access' : `${remaining} executions left this cycle`}
                  </p>
                  {!isPro && (
                    <p className="text-[10px] text-white/40 mt-0.5 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {getTimeUntilReset(user.usage_reset_date)}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-[#BE1E2F]/10 hover:bg-[#BE1E2F]/20 text-white border border-[#BE1E2F]/30 flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2 font-medium">
                      <LogIn className="w-3.5 h-3.5 text-[#BE1E2F]" />
                      Sign In / Switch Profile
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onOpenPaywall();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg bg-[#1a1a1a] hover:bg-[#3a3a3a] text-white flex items-center justify-between transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-[#BE1E2F]" />
                      Manage Subscription ($10/mo)
                    </span>
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  </button>

                  <button
                    onClick={() => {
                      onOpenAdmin();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-[#3a3a3a] text-white/80 hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Admin Control & Telemetry
                  </button>

                  {/* Switch user email demo control */}
                  <div className="pt-2 border-t border-[#3a3a3a]">
                    <span className="text-[10px] text-white/40 uppercase font-mono block mb-1.5">
                      Quick Profile Presets:
                    </span>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => {
                          onSwitchUserEmail('sanelowlabel@gmail.com');
                          setUserDropdownOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] rounded text-left truncate transition-colors ${
                          user.email === 'sanelowlabel@gmail.com'
                            ? 'bg-[#BE1E2F] text-white'
                            : 'bg-[#1a1a1a] text-white/70 hover:bg-[#3a3a3a]'
                        }`}
                      >
                        👑 Owner Admin
                      </button>
                      <button
                        onClick={() => {
                          onSwitchUserEmail('creator@aisuite.app');
                          setUserDropdownOpen(false);
                        }}
                        className={`px-2 py-1 text-[11px] rounded text-left truncate transition-colors ${
                          user.email !== 'sanelowlabel@gmail.com'
                            ? 'bg-[#BE1E2F] text-white'
                            : 'bg-[#1a1a1a] text-white/70 hover:bg-[#3a3a3a]'
                        }`}
                      >
                        👤 Free User (20 Limit)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
