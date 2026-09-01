import React, { useState } from 'react';
import { 
  Calculator, 
  DollarSign, 
  PieChart, 
  TrendingUp, 
  HelpCircle, 
  ShieldCheck, 
  Share2,
  Sparkles,
  Layers
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface RoyaltyCalculatorToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

export const RoyaltyCalculatorTool: React.FC<RoyaltyCalculatorToolProps> = ({ tool, user }) => {
  const [spotifyStreams, setSpotifyStreams] = useState(150000);
  const [appleStreams, setAppleStreams] = useState(60000);
  const [youtubeStreams, setYoutubeStreams] = useState(120000);
  const [tidalStreams, setTidalStreams] = useState(15000);
  const [amazonStreams, setAmazonStreams] = useState(35000);
  const [labelShare, setLabelShare] = useState(20);
  const [distributorCut, setDistributorCut] = useState(0);

  // Platform Per-Stream Rates (USD)
  const RATES = {
    spotify: 0.0038,
    apple: 0.0078,
    youtube: 0.0020,
    tidal: 0.0130,
    amazon: 0.0040,
  };

  const spotifyGross = spotifyStreams * RATES.spotify;
  const appleGross = appleStreams * RATES.apple;
  const youtubeGross = youtubeStreams * RATES.youtube;
  const tidalGross = tidalStreams * RATES.tidal;
  const amazonGross = amazonStreams * RATES.amazon;

  const totalGross = spotifyGross + appleGross + youtubeGross + tidalGross + amazonGross;
  const totalStreams = spotifyStreams + appleStreams + youtubeStreams + tidalStreams + amazonStreams;

  const distributorFeeAmount = totalGross * (distributorCut / 100);
  const afterDistributor = totalGross - distributorFeeAmount;

  const labelShareAmount = afterDistributor * (labelShare / 100);
  const netArtistPayout = afterDistributor - labelShareAmount;

  const effectivePerStream = totalStreams > 0 ? (totalGross / totalStreams).toFixed(4) : '0.0000';

  return (
    <div className="space-y-6">
      
      {/* Main Studio Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Multi-Platform Music Streaming Royalty Calculator
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  2026 Models
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Calculate gross DSP streaming payouts, distributor cuts, and net master/publishing splits.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-white/50 font-mono">ESTIMATED NET PAYOUT</span>
            <div className="font-display text-2xl sm:text-3xl font-bold text-emerald-400">
              ${netArtistPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {/* Top Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="text-[11px] text-white/50 font-mono">TOTAL STREAMS</div>
            <div className="font-display text-xl font-bold text-white mt-1">
              {totalStreams.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/40 font-mono mt-0.5">Across 5 DSPs</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="text-[11px] text-white/50 font-mono">GROSS DSP REVENUE</div>
            <div className="font-display text-xl font-bold text-white mt-1">
              ${totalGross.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-white/40 font-mono mt-0.5">Before splits</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="text-[11px] text-white/50 font-mono">RECORD LABEL CUT ({labelShare}%)</div>
            <div className="font-display text-xl font-bold text-[#BE1E2F] mt-1">
              -${labelShareAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-white/40 font-mono mt-0.5">Master Rights</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="text-[11px] text-white/50 font-mono">EFFECTIVE RATE</div>
            <div className="font-display text-xl font-bold text-amber-400 mt-1">
              ${effectivePerStream}
            </div>
            <div className="text-[10px] text-white/40 font-mono mt-0.5">Avg per stream</div>
          </div>
        </div>

        {/* Streaming Inputs Grid */}
        <div className="space-y-4 pt-2">
          <h4 className="text-xs font-mono text-white/70 uppercase">Platform Stream Volumes:</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            {/* Spotify */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Spotify ($0.0038/stream)
                </span>
                <span className="text-emerald-400 font-mono font-bold">${spotifyGross.toFixed(2)}</span>
              </div>
              <input
                type="number"
                value={spotifyStreams}
                onChange={(e) => setSpotifyStreams(Math.max(0, Number(e.target.value)))}
                className="w-full p-2.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-white text-xs font-mono focus:border-[#BE1E2F] focus:outline-none"
              />
            </div>

            {/* Apple Music */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Apple Music ($0.0078/stream)
                </span>
                <span className="text-rose-400 font-mono font-bold">${appleGross.toFixed(2)}</span>
              </div>
              <input
                type="number"
                value={appleStreams}
                onChange={(e) => setAppleStreams(Math.max(0, Number(e.target.value)))}
                className="w-full p-2.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-white text-xs font-mono focus:border-[#BE1E2F] focus:outline-none"
              />
            </div>

            {/* YouTube Music */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" /> YouTube ($0.0020/stream)
                </span>
                <span className="text-red-400 font-mono font-bold">${youtubeGross.toFixed(2)}</span>
              </div>
              <input
                type="number"
                value={youtubeStreams}
                onChange={(e) => setYoutubeStreams(Math.max(0, Number(e.target.value)))}
                className="w-full p-2.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-white text-xs font-mono focus:border-[#BE1E2F] focus:outline-none"
              />
            </div>

            {/* Tidal */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Tidal ($0.0130/stream)
                </span>
                <span className="text-cyan-400 font-mono font-bold">${tidalGross.toFixed(2)}</span>
              </div>
              <input
                type="number"
                value={tidalStreams}
                onChange={(e) => setTidalStreams(Math.max(0, Number(e.target.value)))}
                className="w-full p-2.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-white text-xs font-mono focus:border-[#BE1E2F] focus:outline-none"
              />
            </div>

            {/* Amazon Music */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Amazon ($0.0040/stream)
                </span>
                <span className="text-amber-400 font-mono font-bold">${amazonGross.toFixed(2)}</span>
              </div>
              <input
                type="number"
                value={amazonStreams}
                onChange={(e) => setAmazonStreams(Math.max(0, Number(e.target.value)))}
                className="w-full p-2.5 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-white text-xs font-mono focus:border-[#BE1E2F] focus:outline-none"
              />
            </div>

            {/* Split Sliders */}
            <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white/60">LABEL SHARE:</span>
                <span className="text-[#BE1E2F] font-bold">{labelShare}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={labelShare}
                onChange={(e) => setLabelShare(Number(e.target.value))}
                className="w-full accent-[#BE1E2F]"
              />
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>0% (100% Indie)</span>
                <span>50% (Standard)</span>
                <span>80% (Major)</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
