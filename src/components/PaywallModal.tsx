import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Check, 
  Crown, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Lock, 
  Flame,
  ArrowRight,
  Headphones,
  FileCode,
  Layers,
  Infinity as InfinityIcon
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpgradeSuccess: (updatedProfile: UserProfile) => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpgradeSuccess,
}) => {
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'paystack'>('stripe');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isPro = user.subscription_tier === 'pro' || user.isAdmin;

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/upgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          paymentMethod: paymentGateway === 'stripe' ? 'Stripe Checkout' : 'Paystack Nigeria/Global',
        }),
      });

      const data = await response.json();
      if (data.success && data.profile) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#BE1E2F', '#ffffff', '#ffd700', '#2b2b2b'],
        });

        onUpgradeSuccess(data.profile);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setError(data.message || 'Upgrade failed');
      }
    } catch (err: any) {
      setError(err?.message || 'Network error during upgrade');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDowngrade = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/downgrade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      if (data.profile) {
        onUpgradeSuccess(data.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCredits = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await response.json();
      if (data.profile) {
        onUpgradeSuccess(data.profile);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const proFeatures = [
    { title: 'Unlimited Tool Executions', desc: 'Zero limits across all 54 audio, marketing, visual & SEO tools' },
    { title: 'AI Stem Separation & Audio Mastering', desc: 'Demix vocals, drums, bass and master to streaming LUFS targets' },
    { title: 'Neural Voice & Speech Synthesis', desc: 'Lifelike speech, vocal hooks & producer drop tag generation' },
    { title: 'Dynamic Smart Links & Live Analytics', desc: 'Multi-store release smart links with QR codes & telemetry' },
    { title: 'Universal File Converter Engine', desc: 'Unlimited conversions for MP3, WAV, MP4, MOV, PNG, PDF' },
    { title: 'Full Commercial Studio License', desc: '100% royalty-free commercial rights for all outputs & metadata' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        id="paywall-modal"
      >
        {/* Top Accent Header */}
        <div className="bg-gradient-to-r from-[#BE1E2F] via-[#7a0f1c] to-[#1a1a1a] p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            id="paywall-close-btn"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-sm">
              AI Suite Pro
            </span>
            <div className="flex items-center gap-1 text-amber-300 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 fill-amber-300" />
              <span>Unlimited Tier</span>
            </div>
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
            Unlock Full Studio Power
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-lg">
            Empower your record label, production pipeline, and marketing workflow with unrestricted access to all 54 AI tools.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Pricing Highlight Card */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a] gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-3xl sm:text-4xl font-bold text-white">$10</span>
                <span className="text-white/60 text-sm font-mono">/ month</span>
              </div>
              <p className="text-xs text-[#BE1E2F] font-semibold mt-0.5">
                Billed monthly • Cancel anytime with 1-click
              </p>
            </div>

            {/* Current status badge */}
            <div className="text-right">
              <div className="text-xs text-white/50 mb-1">Your Current Status:</div>
              {isPro ? (
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 fill-amber-300" />
                  ACTIVE PRO
                </span>
              ) : (
                <span className="px-3 py-1 rounded-lg bg-white/10 text-white/70 border border-[#3a3a3a] text-xs font-mono">
                  FREE TIER ({20 - user.weekly_usage_count} / 20 Credits)
                </span>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proFeatures.map((feat, idx) => (
              <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#2b2b2b]/50 border border-[#3a3a3a]/60">
                <div className="w-5 h-5 rounded-full bg-[#BE1E2F]/20 text-[#BE1E2F] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                  <p className="text-[11px] text-white/60 leading-tight mt-0.5">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Gateway Toggle */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-white/60 uppercase block">
              Select Payment Engine
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentGateway('stripe')}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                  paymentGateway === 'stripe'
                    ? 'bg-[#BE1E2F]/10 border-[#BE1E2F] text-white shadow-md shadow-[#BE1E2F]/10'
                    : 'bg-[#2b2b2b] border-[#3a3a3a] text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#BE1E2F]" />
                  <span>Stripe Global (Cards & Apple Pay)</span>
                </div>
                {paymentGateway === 'stripe' && <Check className="w-4 h-4 text-[#BE1E2F]" />}
              </button>

              <button
                type="button"
                onClick={() => setPaymentGateway('paystack')}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
                  paymentGateway === 'paystack'
                    ? 'bg-[#BE1E2F]/10 border-[#BE1E2F] text-white shadow-md shadow-[#BE1E2F]/10'
                    : 'bg-[#2b2b2b] border-[#3a3a3a] text-white/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span>Paystack (Cards, Transfer & Mobile)</span>
                </div>
                {paymentGateway === 'paystack' && <Check className="w-4 h-4 text-[#BE1E2F]" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Action CTA Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#BE1E2F] to-[#a11826] hover:from-[#a11826] hover:to-[#800f1c] text-white font-bold text-sm tracking-wide shadow-xl shadow-[#BE1E2F]/30 border border-[#BE1E2F] flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
              id="paywall-confirm-upgrade-btn"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPro ? (
                <>
                  <Crown className="w-4 h-4 text-amber-300" />
                  <span>Re-activate / Sync Pro Subscription ($10/mo)</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Upgrade to Unlimited Pro ($10/month)</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-4 text-[11px] text-white/40">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                256-bit Encrypted Checkout
              </span>
              <span>•</span>
              <span>Instant AI Activation</span>
              <span>•</span>
              <span>No Contracts</span>
            </div>

            {/* Sandbox Testing Quick Actions */}
            <div className="pt-3 border-t border-[#3a3a3a] flex items-center justify-between text-[11px] text-white/50">
              <span>Sandbox Testing Helpers:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetCredits}
                  className="px-2 py-1 rounded bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white/70 hover:text-white"
                >
                  Reset to 20 Credits
                </button>
                {isPro && (
                  <button
                    type="button"
                    onClick={handleDowngrade}
                    className="px-2 py-1 rounded bg-[#2b2b2b] hover:bg-[#3a3a3a] text-amber-400"
                  >
                    Switch to Free Tier
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
