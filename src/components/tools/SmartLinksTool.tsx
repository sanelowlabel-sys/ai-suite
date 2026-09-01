import React, { useState, useEffect } from 'react';
import { 
  Link2, 
  QrCode, 
  BarChart3, 
  Copy, 
  Check, 
  ExternalLink, 
  Plus, 
  Eye, 
  TrendingUp, 
  Smartphone, 
  Laptop, 
  Globe, 
  Sparkles,
  Download,
  Calendar
} from 'lucide-react';
import QRCode from 'qrcode';
import { ToolDefinition, UserProfile, SmartLink } from '../../types';

interface SmartLinksToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

export const SmartLinksTool: React.FC<SmartLinksToolProps> = ({ tool, user }) => {
  const [originalUrl, setOriginalUrl] = useState('https://open.spotify.com/album/4u7EnebtmKWzUH433cf5Qv');
  const [title, setTitle] = useState('AI Horizon - Midnight EP');
  const [customAlias, setCustomAlias] = useState('midnight-ep');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'builder' | 'analytics'>('analytics');
  const [isLoading, setIsLoading] = useState(false);

  // Link list state
  const [links, setLinks] = useState<SmartLink[]>([
    {
      id: 'sl_1',
      user_id: user.email,
      short_code: 'midnight-ep',
      original_url: 'https://open.spotify.com/album/4u7EnebtmKWzUH433cf5Qv',
      title: 'AI Horizon - Midnight EP (Out Now)',
      click_count: 542,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      analytics_data: [
        { timestamp: '2026-08-31T10:00:00Z', referrer: 'Instagram Bio', device: 'Mobile', country: 'United States', browser: 'Safari' },
        { timestamp: '2026-08-31T09:30:00Z', referrer: 'TikTok', device: 'Mobile', country: 'United Kingdom', browser: 'Chrome' },
        { timestamp: '2026-08-31T08:15:00Z', referrer: 'Spotify Profile', device: 'Mobile', country: 'Germany', browser: 'Safari' },
        { timestamp: '2026-08-30T22:00:00Z', referrer: 'YouTube Description', device: 'Desktop', country: 'United States', browser: 'Chrome' },
        { timestamp: '2026-08-30T19:20:00Z', referrer: 'Twitter/X', device: 'Mobile', country: 'France', browser: 'Safari' },
        { timestamp: '2026-08-30T14:10:00Z', referrer: 'Direct / QR Code', device: 'Mobile', country: 'Japan', browser: 'Chrome' },
      ],
    },
    {
      id: 'sl_2',
      user_id: user.email,
      short_code: 'sane-presave',
      original_url: 'https://distrokid.com/hyperfollow/sanelabel/future-frequencies',
      title: 'Future Frequencies LP Pre-Save',
      click_count: 289,
      created_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      analytics_data: [],
    }
  ]);

  const [selectedLink, setSelectedLink] = useState<SmartLink>(links[0]);

  // Generate QR Code on code change
  useEffect(() => {
    if (selectedLink) {
      const fullUrl = `${window.location.origin}/l/${selectedLink.short_code}`;
      QRCode.toDataURL(fullUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#BE1E2F',
          light: '#1a1a1a',
        },
      }).then((url) => {
        setQrCodeUrl(url);
      });
    }
  }, [selectedLink]);

  const handleCreateSmartLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/links/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          originalUrl,
          title,
          customAlias,
        }),
      });

      const data = await response.json();
      if (data.success && data.link) {
        setLinks((prev) => [data.link, ...prev]);
        setSelectedLink(data.link);
        setActiveTab('analytics');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/l/${selectedLink.short_code}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Aggregated analytics
  const totalClicks = links.reduce((acc, curr) => acc + curr.click_count, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Link2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Smart Links & Dynamic Music Analytics
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Live Telemetry
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Create branded multi-store music release landing hubs with QR codes and real-time click analytics.
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <button
              onClick={() => setActiveTab('builder')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'builder'
                  ? 'bg-[#BE1E2F] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              + Create Link
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#BE1E2F] text-white shadow-md'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Live Analytics ({totalClicks} Clicks)
            </button>
          </div>
        </div>

        {/* Tab 1: Link Builder */}
        {activeTab === 'builder' && (
          <form onSubmit={handleCreateSmartLink} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/70">DESTINATION URL (SPOTIFY, SOUNDCLOUD, APPLE)</label>
                <input
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://open.spotify.com/album/..."
                  className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/70">CAMPAIGN / RELEASE TITLE</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Nova Resonance - Solar Waves EP"
                  className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-white/70">CUSTOM SHORT SLUG ALIAS</label>
                <div className="flex items-center rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] px-3">
                  <span className="text-xs text-white/40 font-mono">sanelabel.studio/l/</span>
                  <input
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-release"
                    className="w-full p-3 bg-transparent text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="py-3 px-6 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isLoading ? 'Generating Smart Link...' : 'Generate Smart Link & QR Code'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Live Analytics & QR Codes */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 pt-2">
            
            {/* Top KPI Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
                <div className="text-[11px] text-white/50 font-mono">TOTAL CAMPAIGN CLICKS</div>
                <div className="font-display text-2xl font-bold text-white mt-1">{totalClicks}</div>
                <div className="text-[10px] text-emerald-400 font-mono mt-0.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> +24% this week
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
                <div className="text-[11px] text-white/50 font-mono">ACTIVE LINKS</div>
                <div className="font-display text-2xl font-bold text-white mt-1">{links.length}</div>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">100% Uptime</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
                <div className="text-[11px] text-white/50 font-mono">PRIMARY TRAFFIC</div>
                <div className="font-display text-2xl font-bold text-[#BE1E2F] mt-1">Mobile (86%)</div>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">iOS & Android Feed</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
                <div className="text-[11px] text-white/50 font-mono">TOP REFERRER</div>
                <div className="font-display text-2xl font-bold text-white mt-1">Instagram Bio</div>
                <div className="text-[10px] text-white/40 font-mono mt-0.5">Followed by TikTok</div>
              </div>
            </div>

            {/* Link Selector & Active Link Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Smart Links List */}
              <div className="space-y-2">
                <span className="text-xs font-mono text-white/60">YOUR SMART LINKS ({links.length})</span>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      onClick={() => setSelectedLink(link)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedLink.id === link.id
                          ? 'bg-[#1a1a1a] border-[#BE1E2F] shadow-md shadow-[#BE1E2F]/10'
                          : 'bg-[#1a1a1a]/50 border-[#3a3a3a] hover:border-white/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white truncate max-w-[180px]">
                          {link.title}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-[#BE1E2F]/20 text-[#BE1E2F] text-[10px] font-mono font-bold">
                          {link.click_count} clicks
                        </span>
                      </div>
                      <div className="text-[11px] text-white/40 font-mono mt-1 truncate">
                        /l/{link.short_code}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Center/Right: Detailed QR Code & Telemetry */}
              <div className="lg:col-span-2 p-5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3a3a3a] pb-3">
                  <div>
                    <h4 className="font-bold text-white text-sm">{selectedLink.title}</h4>
                    <span className="text-xs text-[#BE1E2F] font-mono">
                      {window.location.origin}/l/{selectedLink.short_code}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink ? 'Copied Link' : 'Copy Smart Link'}</span>
                    </button>

                    <a
                      href={`/l/${selectedLink.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white/80 hover:text-white transition-colors"
                      title="Test Short Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* QR Code + Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#2b2b2b] border border-[#3a3a3a]">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="Smart Link QR Code"
                        className="w-36 h-36 rounded-lg border border-[#3a3a3a]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-white/30 text-xs">
                        Generating QR...
                      </div>
                    )}
                    <a
                      href={qrCodeUrl}
                      download={`smartlink-${selectedLink.short_code}.png`}
                      className="text-[11px] text-[#BE1E2F] hover:underline flex items-center gap-1 mt-2 font-mono"
                    >
                      <Download className="w-3 h-3" /> Download High-Res QR
                    </a>
                  </div>

                  {/* Telemetry Breakdown */}
                  <div className="sm:col-span-2 space-y-3">
                    <div className="text-xs font-mono text-white/60">DEVICE & REFERRER DISTRIBUTION:</div>
                    
                    {/* Platform Progress bars */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-white/70 mb-0.5">
                          <span className="flex items-center gap-1.5"><Smartphone className="w-3 h-3 text-[#BE1E2F]" /> Mobile (iOS/Android)</span>
                          <span className="font-mono">82%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#2b2b2b] rounded-full overflow-hidden">
                          <div className="h-full bg-[#BE1E2F] w-[82%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-white/70 mb-0.5">
                          <span className="flex items-center gap-1.5"><Laptop className="w-3 h-3 text-amber-400" /> Desktop Web</span>
                          <span className="font-mono">18%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#2b2b2b] rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 w-[18%]" />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-white/70 mb-0.5">
                          <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-emerald-400" /> Top Country: United States & UK</span>
                          <span className="font-mono">65%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#2b2b2b] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400 w-[65%]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
