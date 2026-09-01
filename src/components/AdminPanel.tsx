import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Crown, 
  Users, 
  Cpu, 
  Server, 
  Activity, 
  DollarSign, 
  Database, 
  Terminal, 
  Key, 
  RotateCcw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { UserProfile } from '../types';

interface AdminPanelProps {
  user: UserProfile;
  onClose: () => void;
  onUpdateUserProfile: (profile: UserProfile) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  user,
  onClose,
  onUpdateUserProfile,
}) => {
  const [stats, setStats] = useState({
    totalTools: 54,
    activeUsers: 1842,
    proSubscribers: 320,
    mrr: 3200,
    apiLatencyMs: 118,
    systemStatus: 'Operational',
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 space-y-8 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#BE1E2F] via-[#7a0f1c] to-[#1a1a1a] border border-[#BE1E2F]/40 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-mono font-bold uppercase">
              Root Administration Console
            </span>
            <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-xs font-mono font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" /> OWNER: sanelowlabel@gmail.com
            </span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight">
            AI Suite Telemetry & Monetization Hub
          </h2>
        </div>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-xl bg-black/40 hover:bg-black/70 border border-white/20 text-white text-xs font-bold transition-colors"
        >
          Return to Studio
        </button>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a]">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span>TOOL ENGINES</span>
            <Cpu className="w-4 h-4 text-[#BE1E2F]" />
          </div>
          <div className="font-display text-2xl font-bold text-white mt-1">54 Active</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">100% Registry Health</div>
        </div>

        <div className="p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a]">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span>PRO SUBSCRIBERS</span>
            <Crown className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display text-2xl font-bold text-amber-300 mt-1">320 ($10/mo)</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Stripe & Paystack</div>
        </div>

        <div className="p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a]">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span>MONTHLY RUN RATE</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-400 mt-1">$3,200 MRR</div>
          <div className="text-[10px] text-white/40 font-mono mt-0.5">+18% MoM Growth</div>
        </div>

        <div className="p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a]">
          <div className="flex items-center justify-between text-xs font-mono text-white/50">
            <span>INFERENCE SPEED</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-display text-2xl font-bold text-white mt-1">118ms Avg</div>
          <div className="text-[10px] text-cyan-400 font-mono mt-0.5">Gemini 3.7 Flash Edge</div>
        </div>

      </div>

      {/* System Infrastructure Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-4">
        <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
          <Server className="w-4 h-4 text-[#BE1E2F]" />
          SECURITY & INFRASTRUCTURE SPECIFICATIONS
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1">
            <span className="text-white/40">AI ENGINE</span>
            <div className="text-white font-bold">@google/genai 3.7 Flash</div>
            <div className="text-emerald-400 text-[10px]">Server-Side API Proxy Protected</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1">
            <span className="text-white/40">USAGE GUARD ENFORCER</span>
            <div className="text-white font-bold">20 Free / 7-Day Rolling Cycle</div>
            <div className="text-amber-400 text-[10px]">Strict $10 Pro Paywall Gate</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1">
            <span className="text-white/40">EDGE RUNTIME</span>
            <div className="text-white font-bold">Cloud Run Linux Sandbox</div>
            <div className="text-emerald-400 text-[10px]">Port 3000 Ingress Routing</div>
          </div>
        </div>
      </div>

    </div>
  );
};
