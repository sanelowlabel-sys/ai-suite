import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

export default function Pricing() {
  const { profile, signIn } = useAuth();

  const plans = [
    {
      id: 'free',
      name: 'Starter',
      price: '$0',
      description: 'Ideal for testing out tools and exploring the audio & content algorithms.',
      features: [
        '10 tool executions / week',
        'Standard audio compression',
        'Community support',
        'Web interface access',
        'Standard processing queue'
      ],
      button: 'Current Plan',
      highlight: false,
      icon: <Zap className="w-5 h-5 text-slate-600" />
    },
    {
      id: 'pro',
      name: 'Pro Creator',
      price: '$19',
      description: 'For active musicians, producers, and marketers who require unlimited processing.',
      features: [
        'Unlimited tool executions',
        'High-resolution mastering (24-bit WAV)',
        'Full stem isolation suite',
        'Priority GPU generation queue',
        'Commercial release rights',
        'Direct email support'
      ],
      button: 'Upgrade to Pro',
      highlight: true,
      icon: <Sparkles className="w-5 h-5 text-red-600" />
    },
    {
      id: 'premium',
      name: 'Studio Label',
      price: '$49',
      description: 'Advanced batch pipelines, multi-seat accounts, and custom model checkpoints.',
      features: [
        'Everything in Pro',
        'Unlimited stem & mastering batches',
        '5 team member seats included',
        'API keys & Webhook access',
        'Dedicated account rep',
        'Custom fine-tuned voice models'
      ],
      button: 'Get Studio Label',
      highlight: false,
      icon: <ShieldCheck className="w-5 h-5 text-slate-800" />
    }
  ];

  const handlePayment = (planId: string) => {
    if (!profile) {
      signIn();
      return;
    }
    alert(`Redirecting to PayPal Checkout for the ${planId} plan...`);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <SEO title="Pricing & Membership" description="Simple, transparent plans for music producers and digital creators." />
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-xs font-black text-red-600 uppercase tracking-widest block mb-2">
          Transparent Membership
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
          Choose Your Power Tier
        </h1>
        <p className="text-slate-500 font-medium text-sm md:text-base mt-3 leading-relaxed">
          Scale effortlessly from individual hobby tracks to multi-catalog record label mastering with zero hidden fees.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-8 rounded-3xl flex flex-col justify-between relative transition-all duration-300 ${
              plan.highlight 
              ? 'studio-card-featured bg-white shadow-xl shadow-red-500/10' 
              : 'studio-card bg-white'
            }`}
          >
            {plan.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-red-600 text-white text-[11px] font-black uppercase tracking-wider rounded-full shadow-md shadow-red-600/30">
                Most Popular
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  plan.highlight ? 'bg-red-50 border border-red-200' : 'bg-slate-100 border border-slate-200'
                }`}>
                  {plan.icon}
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {plan.id === 'free' ? 'Forever Free' : 'Billed Monthly'}
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h2>
              <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-black text-slate-900 font-mono">{plan.price}</span>
                <span className="text-xs font-semibold text-slate-500">/ month</span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                {plan.description}
              </p>

              <div className="pt-6 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-4">
                  What's Included:
                </span>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-xs font-medium text-slate-700">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        plan.highlight ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <button
                onClick={() => handlePayment(plan.id)}
                disabled={profile?.subscriptionTier === plan.id}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  profile?.subscriptionTier === plan.id
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : plan.highlight 
                    ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/25 active:scale-95' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white active:scale-95'
                }`}
              >
                {profile?.subscriptionTier === plan.id ? 'Your Active Plan' : plan.button}
              </button>
              
              {plan.id !== 'free' && (
                <div className="mt-4 flex items-center justify-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Secured by PayPal Payments
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Enterprise Contact Box */}
      <div className="mt-16 p-8 md:p-10 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 block mb-1">
            Enterprise & Universities
          </span>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Need custom AI volume or API license?</h3>
          <p className="text-xs text-slate-500 font-medium max-w-xl">
            We provide custom models, dedicated GPU inference servers, and custom SOC-2 agreements for enterprise record labels and agencies.
          </p>
        </div>
        <button 
          onClick={() => alert("Our enterprise solutions team will reach out to you shortly.")}
          className="px-6 py-3 bg-white border border-slate-300 hover:border-red-500 text-slate-800 hover:text-red-600 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm shrink-0"
        >
          Contact Solutions Team
        </button>
      </div>
    </div>
  );
}
