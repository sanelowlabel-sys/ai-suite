import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Music, 
  TrendingUp, 
  Video, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Search,
  Bell,
  LayoutGrid,
  UserCircle,
  Menu,
  X,
  LogOut,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navigation() {
  const { user, profile, signIn, logout, openAuthModal } = useAuth();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);

  const navItems = [
    { name: 'All Tools', path: '/tools', icon: LayoutGrid },
    { name: 'Music & Audio', path: '/tools?category=Music', icon: Music },
    { name: 'SEO & Growth', path: '/tools?category=SEO', icon: TrendingUp },
    { name: 'Content Studio', path: '/tools?category=Content', icon: Video },
    { name: 'Insights & Usage', path: '/dashboard', icon: BarChart3 },
  ];

  const SidebarContent = () => (
    <>
      <div className="mb-8 px-6 py-4 border-b border-slate-100">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm shadow-red-500/30 shrink-0">
            AI
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              AI <span className="text-red-600">SUITE</span>
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Creator OS</span>
          </div>
        </Link>
      </div>

      <div className="px-6 mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Navigation</span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isItemActive = 
            (item.path === '/tools' && location.pathname === '/tools' && !location.search) ||
            (location.pathname + location.search === item.path) ||
            (item.name.includes('Insights') && location.pathname === '/dashboard');

          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm ${
                isItemActive 
                ? 'bg-red-50 text-red-600 font-bold shadow-sm shadow-red-500/5' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium'
              }`}
              onClick={() => setIsMobileOpen(false)}
            >
              <Icon className={`w-4 h-4 ${isItemActive ? 'text-red-600 stroke-[2.5]' : 'text-slate-400'}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-100 pt-4 px-3 space-y-1">
        <Link 
          to="/pricing" 
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition-colors rounded-xl text-xs font-semibold"
          onClick={() => setIsMobileOpen(false)}
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span>Membership & Pricing</span>
        </Link>
        <Link 
          to="/dashboard" 
          className="flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50/50 transition-colors rounded-xl text-xs font-semibold"
          onClick={() => setIsMobileOpen(false)}
        >
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Support & Status</span>
        </Link>

        {user ? (
          <div className="mt-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center overflow-hidden border border-red-200 shrink-0 text-xs">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" className="w-full h-full object-cover" />
              ) : (
                <span>{user.displayName?.[0] || user.email?.[0] || 'U'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate text-slate-900">{user.displayName || 'Creator'}</p>
              <span className="inline-block text-[10px] font-black uppercase tracking-wider text-red-600">
                {profile?.subscriptionTier || 'Free'} Plan
              </span>
            </div>
            <button 
              onClick={logout} 
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="pt-3 space-y-2">
            <button 
              onClick={() => openAuthModal('login')}
              className="w-full bg-red-600 text-white font-bold text-xs py-2.5 px-4 rounded-xl hover:bg-red-700 active:scale-95 transition-all shadow-sm shadow-red-600/20 uppercase tracking-wider"
            >
              Sign In
            </button>
            <button 
              onClick={() => openAuthModal('signup')}
              className="w-full bg-white border border-slate-200 text-slate-700 font-bold text-xs py-2 px-4 rounded-xl hover:bg-slate-50 hover:text-red-600 active:scale-95 transition-all uppercase tracking-wider"
            >
              Create Account
            </button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 h-screen fixed left-0 top-0 flex-col py-4 border-r border-slate-200 bg-white z-50">
        <SidebarContent />
      </aside>

      {/* Top Bar */}
      <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 flex justify-between items-center px-6 bg-white/95 backdrop-blur-md border-b border-slate-200 z-40">
        <div className="flex items-center gap-4 flex-1">
          <button 
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900" 
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400 text-slate-800" 
              placeholder="Search tools (e.g. Mastering, SEO, Writer)..." 
              type="text"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user && profile?.subscriptionTier === 'free' && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-200 rounded-full">
              <Zap className="w-3.5 h-3.5 text-red-600 fill-red-600" />
              <span className="text-[11px] font-bold text-red-700">
                {Math.max(0, 10 - (profile?.usageCount || 0))} Credits Left
              </span>
            </div>
          )}

          <Link 
            to="/pricing" 
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-colors shadow-sm"
          >
            Upgrade Pro
          </Link>

          <Link 
            to="/dashboard"
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Dashboard"
          >
            <Bell className="w-4 h-4" />
          </Link>

          {user ? (
            <Link 
              to="/dashboard"
              className="flex items-center gap-2 font-bold text-xs text-slate-700 hover:text-red-600 p-1.5 rounded-lg transition-colors ml-1"
            >
              <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-black text-[10px]">
                {user.displayName?.[0] || user.email?.[0] || 'U'}
              </div>
              <span className="hidden sm:inline">{user.displayName || 'Account'}</span>
            </Link>
          ) : (
            <button 
              className="flex items-center gap-1.5 font-bold text-xs text-red-600 hover:text-red-700 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors ml-1" 
              onClick={() => openAuthModal('login')}
            >
              <UserCircle className="w-4 h-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-white flex flex-col py-4 z-[70] lg:hidden border-r border-slate-200 shadow-2xl"
            >
              <button 
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
