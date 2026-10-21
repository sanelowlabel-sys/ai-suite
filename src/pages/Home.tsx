import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Music2, 
  TrendingUp, 
  FileText, 
  Sliders,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import SEO from '../components/SEO';
import heroImage from '../assets/images/studio_creative_red_1792583962801.jpg';

export default function Home() {
  const featuredTools = [
    {
      id: 'music-mastering',
      name: 'AI Song Mastering',
      category: 'Music',
      icon: Sliders,
      desc: 'Commercial loudness, EQ balancing, and harmonic polish tuned for streaming platforms.'
    },
    {
      id: 'song-checker',
      name: 'Track Quality Audit',
      category: 'Music',
      icon: Music2,
      desc: 'Verify mix headroom, dynamic range, and potential spectral masking in seconds.'
    },
    {
      id: 'seo-analyzer',
      name: 'SEO & Growth Engine',
      category: 'SEO',
      icon: TrendingUp,
      desc: 'Rank higher on Google & YouTube with data-driven keyword density and title scoring.'
    },
    {
      id: 'smart-writer',
      name: 'Editorial Copywriter',
      category: 'Content',
      icon: FileText,
      desc: 'Craft persuasive liner notes, artist bios, press releases, and campaign announcements.'
    }
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-12">
      <SEO />

      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px] items-stretch">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-center relative z-10 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 text-red-400 rounded-full text-xs font-bold uppercase tracking-wider mb-6 w-fit">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              The Intelligent Studio Engine
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
              Precision AI for <br className="hidden sm:inline" />
              <span className="text-red-500">Modern Creators.</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg max-w-xl font-normal leading-relaxed mb-8">
              Supercharge your creative pipeline with 60+ specialized tools designed for studio-grade audio mastering, viral content distribution, and keyword ranking.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/tools?category=Music" 
                className="bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all transform active:scale-95"
              >
                <span>Launch Audio Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link 
                to="/tools" 
                className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-xl font-bold text-sm transition-all"
              >
                Explore 60+ Tools
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>10 Free Weekly Executions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Zero Latency Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500" />
                <span>Export-Ready Outputs</span>
              </div>
            </div>
          </div>

          {/* Right Imagery Column */}
          <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-slate-950">
            <img 
              src={heroImage} 
              alt="Creative Audio & Video Studio" 
              className="w-full h-full object-cover object-center brightness-95 contrast-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/80 via-transparent to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Metrics Bar */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-red-600 font-mono">60+</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Specialized AI Tools</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono">0.4s</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Average Latency</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-red-600 font-mono">100%</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Cloud Resilient</div>
          </div>
          <div className="pt-4 md:pt-0">
            <div className="text-3xl md:text-4xl font-black text-slate-900 font-mono">24/7</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">Automated Workflows</div>
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-black text-red-600 uppercase tracking-widest mb-1">Production Highlights</div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">Featured Creative Utilities</h2>
          </div>
          <Link 
            to="/tools" 
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 uppercase tracking-wider group"
          >
            <span>View Complete Directory</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="studio-card p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {tool.category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-red-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link 
                    to={`/tools/${tool.id}`}
                    className="text-xs font-bold text-red-600 flex items-center gap-1 hover:underline"
                  >
                    <span>Open Tool</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] font-bold text-slate-400">INSTANT</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Capabilities Triad */}
      <section className="bg-slate-50 border border-slate-200/80 rounded-3xl p-8 md:p-12">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-black text-red-600 uppercase tracking-widest mb-1 block">Engineered for Quality</span>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
            Built specifically to solve creative roadblocks.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Instant Execution</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Generate lyrics, meta tags, and mastering profiles in sub-second cycles without complicated setup or downloads.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Zero Audio Hallucinations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Algorithmic checks ground responses with real acoustic physics, frequency spectrum limits, and standard LUFS levels.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-2">Seamless Pro Upgrade</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Start with 10 free weekly uses. Upgrade anytime to unlimited execution with single-click secure checkout.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action banner */}
      <section className="bg-red-600 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl shadow-red-600/20">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl md:text-4xl font-black mb-4 leading-tight">
            Ready to streamline your workflow?
          </h2>
          <p className="text-red-100 text-sm md:text-base mb-8 leading-relaxed">
            Join thousands of producers, writers, and growth marketers using AI Suite to create, polish, and launch everyday content.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link 
              to="/tools" 
              className="bg-white text-red-600 hover:bg-red-50 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Start Creating Now
            </Link>
            <Link 
              to="/pricing" 
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all"
            >
              View Membership
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
