import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Flame, 
  HelpCircle, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ChevronRight, 
  Layers, 
  Clock, 
  Cpu,
  CheckCircle2,
  Lock,
  ExternalLink
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../types';
import { getToolBySlug, getRelatedTools, generateToolJsonLd } from '../data/tools';
import { VoiceGeneratorTool } from './tools/VoiceGeneratorTool';
import { FileConverterTool } from './tools/FileConverterTool';
import { SmartLinksTool } from './tools/SmartLinksTool';
import { RoyaltyCalculatorTool } from './tools/RoyaltyCalculatorTool';
import { MusicMasteringTool } from './tools/MusicMasteringTool';
import { StemSeparationTool } from './tools/StemSeparationTool';
import { SpeedTestTool } from './tools/SpeedTestTool';
import { WhatsMyIpTool } from './tools/WhatsMyIpTool';
import { ImageTools } from './tools/ImageTools';
import { GenericAiTool } from './tools/GenericAiTool';

interface ToolPageRouterProps {
  slug: string;
  user: UserProfile;
  onNavigateHome: () => void;
  onSelectTool: (slug: string) => void;
  onOpenPaywall: () => void;
  onUpdateUserProfile: (profile: UserProfile) => void;
}

export const ToolPageRouter: React.FC<ToolPageRouterProps> = ({
  slug,
  user,
  onNavigateHome,
  onSelectTool,
  onOpenPaywall,
  onUpdateUserProfile,
}) => {
  const tool = getToolBySlug(slug);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Injects JSON-LD Structured Data for Programmatic SEO
  useEffect(() => {
    if (!tool) return;
    const jsonLd = generateToolJsonLd(tool);
    
    // Update or create script tag
    let scriptTag = document.getElementById('tool-jsonld-schema');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'tool-jsonld-schema';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(jsonLd);

    // Update document title for SEO
    document.title = `${tool.name} | AI Suite`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [tool]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="font-display text-2xl font-bold text-white">Tool Not Found</h2>
        <p className="text-sm text-white/60">The requested studio tool does not exist in the 54-tool registry.</p>
        <button
          onClick={onNavigateHome}
          className="px-4 py-2 rounded-xl bg-[#BE1E2F] text-white text-xs font-bold"
        >
          Return to Studio Dashboard
        </button>
      </div>
    );
  }

  const relatedTools = getRelatedTools(tool.category, tool.slug, 3);

  const handleExecuteAi = async (inputs: Record<string, any>) => {
    const response = await fetch('/api/tools/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        slug: tool.slug,
        toolName: tool.name,
        inputs,
      }),
    });

    const data = await response.json();
    if (data.profile) {
      onUpdateUserProfile(data.profile);
    }
    return data;
  };

  const handleShareTool = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render the appropriate component
  const renderToolComponent = () => {
    if (tool.slug === 'ai-voice-generator' || tool.slug === 'voice-generator') {
      return <VoiceGeneratorTool tool={tool} user={user} onExecuteAi={handleExecuteAi} />;
    }
    if (tool.slug === 'ai-file-converter') {
      return <FileConverterTool tool={tool} user={user} />;
    }
    if (tool.slug === 'ai-link-shortener') {
      return <SmartLinksTool tool={tool} user={user} />;
    }
    if (tool.slug === 'royalty-calculator') {
      return <RoyaltyCalculatorTool tool={tool} user={user} />;
    }
    if (tool.slug.includes('mastering') || tool.slug.includes('master-studio')) {
      return <MusicMasteringTool tool={tool} user={user} />;
    }
    if (tool.slug.includes('stem-separation')) {
      return <StemSeparationTool tool={tool} user={user} />;
    }
    if (tool.slug.includes('speed-test')) {
      return <SpeedTestTool tool={tool} user={user} />;
    }
    if (tool.slug.includes('whats-my-ip')) {
      return <WhatsMyIpTool tool={tool} user={user} />;
    }
    if (tool.slug.includes('color') || tool.slug.includes('crop') || tool.slug.includes('logo')) {
      return <ImageTools tool={tool} user={user} onExecuteAi={handleExecuteAi} />;
    }
    return (
      <GenericAiTool 
        tool={tool} 
        user={user} 
        onExecuteAi={handleExecuteAi} 
        onOpenPaywall={onOpenPaywall} 
      />
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-150">
      
      {/* Breadcrumbs Bar */}
      <nav className="flex items-center justify-between gap-4 text-xs font-mono text-white/50 border-b border-[#3a3a3a] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={onNavigateHome}
            className="hover:text-white flex items-center gap-1 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Studio Suite
          </button>
          <span>/</span>
          <span className="text-white/60 shrink-0">{tool.category}</span>
          <span>/</span>
          <span className="text-[#BE1E2F] font-bold shrink-0 truncate max-w-[200px]">{tool.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareTool}
            className="px-2.5 py-1 rounded bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white/70 hover:text-white transition-colors"
            title="Share Tool Link"
          >
            {copiedLink ? 'Copied!' : <Share2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className="px-2.5 py-1 rounded bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white/70 hover:text-white transition-colors"
            title="Favorite"
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-[#BE1E2F]" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
        </div>
      </nav>

      {/* Tool Hero Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#BE1E2F]/20 text-[#BE1E2F] border border-[#BE1E2F]/40 text-[10px] font-mono font-bold uppercase tracking-wider">
              {tool.category}
            </span>
            {tool.isPopular && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono flex items-center gap-1">
                <Flame className="w-3 h-3 fill-amber-300" /> POPULAR
              </span>
            )}
            <span className="text-white/40 text-xs font-mono">ID: {tool.slug}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            {tool.name}
          </h1>
          <p className="text-sm text-white/70 mt-1.5 max-w-2xl leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Quick Execution Badge */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a] shrink-0 text-xs font-mono">
          <Cpu className="w-4 h-4 text-[#BE1E2F]" />
          <div>
            <div className="text-white/50 text-[10px]">INFERENCE LATENCY</div>
            <div className="font-bold text-white">~120ms Edge Routing</div>
          </div>
        </div>
      </div>

      {/* Tool Interactive Console */}
      <section id="tool-workspace" className="space-y-4">
        {renderToolComponent()}
      </section>

      {/* Programmatic SEO FAQ Accordion */}
      {tool.seoMetadata?.faq && tool.seoMetadata.faq.length > 0 && (
        <section className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <HelpCircle className="w-4 h-4 text-[#BE1E2F]" />
            <h3>Frequently Asked Questions & Studio Specifications</h3>
          </div>

          <div className="space-y-2">
            {tool.seoMetadata.faq.map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full p-3.5 text-left text-xs font-bold text-white flex items-center justify-between hover:bg-[#222222] transition-colors"
                >
                  <span>{item.question}</span>
                  <ChevronRight
                    className={`w-4 h-4 text-white/40 transition-transform ${
                      openFaqIndex === idx ? 'transform rotate-90 text-[#BE1E2F]' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-3.5 pt-0 text-xs text-white/70 leading-relaxed border-t border-[#3a3a3a]/40 bg-[#141414]">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Studio Tools Grid */}
      {relatedTools.length > 0 && (
        <section className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#BE1E2F]" />
              Related {tool.category} Tools
            </h3>
            <button
              onClick={onNavigateHome}
              className="text-xs text-[#BE1E2F] hover:underline font-mono"
            >
              View all 54 tools →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <div
                key={relTool.slug}
                onClick={() => onSelectTool(relTool.slug)}
                className="p-4 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F] cursor-pointer group transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-white/40">{relTool.category}</span>
                  <span className="text-xs text-[#BE1E2F] group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h4 className="font-bold text-xs text-white group-hover:text-[#BE1E2F] transition-colors">
                  {relTool.name}
                </h4>
                <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">
                  {relTool.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
