import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Sliders, 
  Play, 
  Square, 
  Activity, 
  Disc, 
  Sparkles, 
  Download, 
  Check, 
  Layers,
  Flame,
  Radio
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface MusicMasteringToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

export const MusicMasteringTool: React.FC<MusicMasteringToolProps> = ({ tool, user }) => {
  const [targetLufs, setTargetLufs] = useState('-14');
  const [profilePreset, setProfilePreset] = useState('warm_analog');
  const [lowGain, setLowGain] = useState(2.4);
  const [midGain, setMidGain] = useState(-0.8);
  const [highAir, setHighAir] = useState(3.2);
  const [stereoWidth, setStereoWidth] = useState(130);
  const [isPlaying, setIsPlaying] = useState(false);
  const [abComparison, setAbComparison] = useState<'mastered' | 'unmastered'>('mastered');
  const [isProcessing, setIsProcessing] = useState(false);
  const [masteredReady, setMasteredReady] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Animated spectrum canvas visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      // Draw background grid lines
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw spectrum bars
      const numBars = 48;
      const barWidth = (width / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        const freqRatio = i / numBars;
        let barHeight = 10;

        if (isPlaying) {
          // Dynamic curve boosted by mastering EQ settings
          const bassBoost = (1 - freqRatio) * (lowGain * 4);
          const airBoost = freqRatio * (highAir * 3);
          const wave = Math.sin(tick * 0.15 + i * 0.3) * 18 + Math.cos(tick * 0.1 + i * 0.1) * 15;
          barHeight = Math.max(8, Math.min(height - 10, (height * 0.45) + wave + bassBoost + airBoost));
          if (abComparison === 'unmastered') {
            barHeight *= 0.68; // Lower unmastered energy
          }
        } else {
          barHeight = 12 + Math.sin(i * 0.5) * 6;
        }

        // Gradient for AI Suite neon red
        const grad = ctx.createLinearGradient(0, height, 0, 0);
        grad.addColorStop(0, '#7a0f1c');
        grad.addColorStop(0.6, '#BE1E2F');
        grad.addColorStop(1, abComparison === 'mastered' ? '#ff4d5e' : '#888888');

        ctx.fillStyle = grad;
        ctx.fillRect(i * (barWidth + 2), height - barHeight, barWidth, barHeight);
      }

      tick++;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, lowGain, highAir, abComparison]);

  const handleStartMastering = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setMasteredReady(true);
      setIsPlaying(true);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Music Mastering Console & LUFS Meter
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Studio DSP
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Loudness normalization, multi-band compression, analog tape saturation, and spatial widening.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* A/B Comparison Switch */}
            <div className="flex items-center p-1 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-xs">
              <button
                onClick={() => setAbComparison('mastered')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  abComparison === 'mastered'
                    ? 'bg-[#BE1E2F] text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Mastered
              </button>
              <button
                onClick={() => setAbComparison('unmastered')}
                className={`px-3 py-1 rounded-lg font-bold transition-all ${
                  abComparison === 'unmastered'
                    ? 'bg-white/20 text-white'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                Original Bypass
              </button>
            </div>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#BE1E2F] text-white transition-colors"
              title="Audition Master"
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current text-[#BE1E2F]" /> : <Play className="w-4 h-4 fill-current text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Real-time Spectrum Visualizer Screen */}
        <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/60 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 text-[#BE1E2F]" />
              REAL-TIME SPECTRAL BALANCE (20Hz - 20kHz)
            </span>
            <div className="flex items-center gap-3">
              <span className="text-emerald-400 font-bold">
                LOUDNESS: {targetLufs} LUFS
              </span>
              <span className="text-white/40">
                TRUE PEAK: -0.3 dBTP
              </span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={600}
            height={140}
            className="w-full h-32 rounded-lg bg-black/40 border border-[#3a3a3a]/40 block"
          />

          <div className="flex justify-between text-[10px] font-mono text-white/40 px-1">
            <span>20 Hz (Sub)</span>
            <span>250 Hz (Low-Mid)</span>
            <span>1 kHz (Mids)</span>
            <span>4 kHz (Presence)</span>
            <span>12 kHz (Air)</span>
            <span>20 kHz</span>
          </div>
        </div>

        {/* DSP Mastering Sliders & Knobs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Target LUFS */}
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1.5">
            <label className="text-[11px] font-mono text-white/60">TARGET INTEGRATED LOUDNESS</label>
            <select
              value={targetLufs}
              onChange={(e) => setTargetLufs(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-xs text-white focus:border-[#BE1E2F] focus:outline-none font-mono"
            >
              <option value="-14">-14 LUFS (Spotify / Apple / YouTube)</option>
              <option value="-8">-8 LUFS (Club DJ / Heavy Bass / Festival)</option>
              <option value="-11">-11 LUFS (Audiophile / CD Master)</option>
              <option value="-6">-6 LUFS (Extreme Limiting / Hardstyle)</option>
            </select>
          </div>

          {/* Low End Tightening */}
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-white/60">SUB BASS TIGHTEN</span>
              <span className="text-[#BE1E2F] font-bold">+{lowGain.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="-6"
              max="6"
              step="0.2"
              value={lowGain}
              onChange={(e) => setLowGain(Number(e.target.value))}
              className="w-full accent-[#BE1E2F]"
            />
          </div>

          {/* High Air Band */}
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-white/60">AIR BAND (+12kHz)</span>
              <span className="text-[#BE1E2F] font-bold">+{highAir.toFixed(1)} dB</span>
            </div>
            <input
              type="range"
              min="-6"
              max="8"
              step="0.2"
              value={highAir}
              onChange={(e) => setHighAir(Number(e.target.value))}
              className="w-full accent-[#BE1E2F]"
            />
          </div>

          {/* Stereo Spread */}
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono">
              <span className="text-white/60">STEREO SPREAD</span>
              <span className="text-amber-400 font-bold">{stereoWidth}%</span>
            </div>
            <input
              type="range"
              min="100"
              max="200"
              step="5"
              value={stereoWidth}
              onChange={(e) => setStereoWidth(Number(e.target.value))}
              className="w-full accent-amber-400"
            />
          </div>

        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#3a3a3a]">
          <div className="text-xs text-white/50">
            Engine outputs 24-bit 48kHz uncompressed WAV + 320kbps MP3 streaming copies.
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleStartMastering}
              disabled={isProcessing}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/25 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Processing Master Chain...' : 'Render & Master Audio'}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
