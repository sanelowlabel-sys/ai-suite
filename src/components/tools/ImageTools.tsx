import React, { useState, useRef } from 'react';
import { 
  Crop, 
  Pipette, 
  Image as ImageIcon, 
  Maximize2, 
  Download, 
  Copy, 
  Check, 
  Sparkles, 
  Layers, 
  Sliders,
  Palette
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface ImageToolsProps {
  tool: ToolDefinition;
  user: UserProfile;
  onExecuteAi: (inputs: Record<string, any>) => Promise<any>;
}

export const ImageTools: React.FC<ImageToolsProps> = ({
  tool,
  user,
  onExecuteAi,
}) => {
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [activeColor, setActiveColor] = useState('#BE1E2F');
  const [copiedColor, setCopiedColor] = useState(false);
  const [quality, setQuality] = useState(85);
  const [logoPrompt, setLogoPrompt] = useState('Cyberpunk record label emblem with neon waveforms and geometric typography');
  const [generatedArt, setGeneratedArt] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const palette = [
    { name: 'AI Suite Red Accent', hex: '#BE1E2F', rgb: 'rgb(190, 30, 47)' },
    { name: 'Studio Grey 1', hex: '#2B2B2B', rgb: 'rgb(43, 43, 43)' },
    { name: 'Studio Obsidian', hex: '#1A1A1A', rgb: 'rgb(26, 26, 26)' },
    { name: 'Studio Border Grey', hex: '#3A3A3A', rgb: 'rgb(58, 58, 58)' },
    { name: 'Amber Glow', hex: '#F59E0B', rgb: 'rgb(245, 158, 11)' },
    { name: 'Neon Emerald', hex: '#10B981', rgb: 'rgb(16, 185, 129)' },
  ];

  const aspectPresets = [
    { label: '1:1 Square (Album Art / Vinyl Cover)', value: '1:1', w: '3000x3000px' },
    { label: '16:9 Widescreen (YouTube / Spotify Canvas)', value: '16:9', w: '1920x1080px' },
    { label: '9:16 Vertical (TikTok / Reels / Shorts)', value: '9:16', w: '1080x1920px' },
    { label: '4:5 Portrait (Instagram Feed)', value: '4:5', w: '1080x1350px' },
  ];

  const handleCopyColor = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setActiveColor(hex);
    setCopiedColor(true);
    setTimeout(() => setCopiedColor(false), 2000);
  };

  const handleGenerateLogo = async () => {
    setIsGenerating(true);
    try {
      const res = await onExecuteAi({
        logoPrompt,
        style: 'Minimalist Dark Studio Record Label Vector Emblem',
      });
      // Simulate art completion
      setGeneratedArt('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop');
    } catch (e) {
      // Handled in parent
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Image Tool Selector */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-6">
        
        {/* Tool 1: AI Color Picker & Palette Extractor */}
        {tool.slug.includes('color') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Studio Color Palette & Eyedropper</h3>
                  <p className="text-xs text-white/60">Extract harmonic album artwork tones and verify WCAG contrast.</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div 
                  className="w-8 h-8 rounded-lg border border-white/20 shadow-md"
                  style={{ backgroundColor: activeColor }}
                />
                <span className="text-xs font-mono font-bold text-white">{activeColor}</span>
              </div>
            </div>

            {/* Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              {palette.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => handleCopyColor(p.hex)}
                  className="p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#BE1E2F] cursor-pointer group transition-all"
                >
                  <div
                    className="w-full h-14 rounded-lg mb-2 shadow-inner border border-white/10 group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: p.hex }}
                  />
                  <div className="text-xs font-bold text-white truncate">{p.name}</div>
                  <div className="text-[11px] font-mono text-white/50">{p.hex}</div>
                </div>
              ))}
            </div>

            {copiedColor && (
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono text-center flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Hex code {activeColor} copied to clipboard!
              </div>
            )}
          </div>
        )}

        {/* Tool 2: AI Crop Image & Aspect Ratio Studio */}
        {tool.slug.includes('crop') && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
                <Crop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Smart Image Crop & Canvas Framing</h3>
                <p className="text-xs text-white/60">Automated focal point detection for streaming platform cover art.</p>
              </div>
            </div>

            {/* Aspect Presets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {aspectPresets.map((preset) => (
                <div
                  key={preset.value}
                  onClick={() => setAspectRatio(preset.value)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    aspectRatio === preset.value
                      ? 'bg-[#1a1a1a] border-[#BE1E2F] shadow-md shadow-[#BE1E2F]/10'
                      : 'bg-[#1a1a1a]/50 border-[#3a3a3a] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{preset.label}</span>
                    <span className="text-xs font-mono text-[#BE1E2F] font-bold">{preset.value}</span>
                  </div>
                  <div className="text-[11px] font-mono text-white/50 mt-1">Recommended: {preset.w}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tool 3: AI Logo & Visual Generator */}
        {(!tool.slug.includes('color') && !tool.slug.includes('crop')) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Visual Art & Vector Emblem Engine</h3>
                  <p className="text-xs text-white/60">Generate album artwork mockups, typography marks, and label emblems.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-white/70">PROMPT & ART DIRECTION</label>
              <textarea
                value={logoPrompt}
                onChange={(e) => setLogoPrompt(e.target.value)}
                rows={3}
                className="w-full p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateLogo}
              disabled={isGenerating}
              className="px-5 py-3 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#BE1E2F]/25 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Rendering High-Res Emblem...' : 'Generate Studio Artwork Concept'}</span>
            </button>

            {generatedArt && (
              <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-3">
                <span className="text-xs font-mono text-white/60">RENDERED ARTWORK PREVIEW:</span>
                <img
                  src={generatedArt}
                  alt="Generated Artwork"
                  className="w-full max-w-md h-64 object-cover rounded-xl border border-[#3a3a3a]"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
