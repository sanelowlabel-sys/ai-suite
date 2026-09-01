import React, { useState } from 'react';
import { 
  Layers, 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Download, 
  Mic2, 
  Disc, 
  Sparkles, 
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface StemSeparationToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

interface StemTrack {
  id: string;
  name: string;
  type: 'vocals' | 'drums' | 'bass' | 'other';
  volume: number;
  isMuted: boolean;
  isSolo: boolean;
  color: string;
  icon: string;
}

export const StemSeparationTool: React.FC<StemSeparationToolProps> = ({ tool, user }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDemixing, setIsDemixing] = useState(false);
  const [separationComplete, setSeparationComplete] = useState(true);

  const [tracks, setTracks] = useState<StemTrack[]>([
    { id: '1', name: 'Lead & Backing Vocals', type: 'vocals', volume: 85, isMuted: false, isSolo: false, color: '#BE1E2F', icon: '🎤' },
    { id: '2', name: 'Acoustic & Electronic Drums', type: 'drums', volume: 90, isMuted: false, isSolo: false, color: '#f59e0b', icon: '🥁' },
    { id: '3', name: 'Sub & 808 Bassline', type: 'bass', volume: 80, isMuted: false, isSolo: false, color: '#10b981', icon: '🎸' },
    { id: '4', name: 'Instruments & Synths', type: 'other', volume: 75, isMuted: false, isSolo: false, color: '#3b82f6', icon: '🎹' },
  ]);

  const toggleMute = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t))
    );
  };

  const toggleSolo = (id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isSolo: !t.isSolo } : { ...t, isSolo: false }))
    );
  };

  const updateVolume = (id: string, vol: number) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, volume: vol } : t))
    );
  };

  const handleSeparateStems = () => {
    setIsDemixing(true);
    setTimeout(() => {
      setIsDemixing(false);
      setSeparationComplete(true);
      setIsPlaying(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI 4-Track Stem Separation & Isolation
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Demixing Neural Net
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Isolate acapellas, drum breaks, basslines, and synth melodies with zero bleed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] hover:border-[#BE1E2F] text-white text-xs font-bold flex items-center gap-2 transition-colors"
            >
              {isPlaying ? <Square className="w-4 h-4 fill-current text-[#BE1E2F]" /> : <Play className="w-4 h-4 fill-current text-emerald-400" />}
              <span>{isPlaying ? 'Stop Playback' : 'Audition Stem Mix'}</span>
            </button>
          </div>
        </div>

        {/* 4-Track Stems Mixer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-white/60">
            <span>SEPARATED STEM CHANNELS (4 STEMS)</span>
            <span>SAMPLE RATE: 44.1kHz 24-BIT</span>
          </div>

          <div className="space-y-3">
            {tracks.map((track) => {
              const hasSoloActive = tracks.some((t) => t.isSolo);
              const isEffectivelyAudible = hasSoloActive ? track.isSolo : !track.isMuted;

              return (
                <div
                  key={track.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isEffectivelyAudible
                      ? 'bg-[#1a1a1a] border-[#3a3a3a]'
                      : 'bg-[#1a1a1a]/40 border-transparent opacity-40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    {/* Track Info */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg border"
                        style={{ backgroundColor: `${track.color}15`, borderColor: `${track.color}40` }}
                      >
                        {track.icon}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{track.name}</div>
                        <div className="text-[10px] text-white/40 font-mono">Channel {track.id} • Stereo</div>
                      </div>
                    </div>

                    {/* Animated Waveform Indicator */}
                    <div className="flex-1 w-full sm:w-auto flex items-center gap-1 h-6 px-3 bg-[#2b2b2b]/40 rounded-lg">
                      {[...Array(24)].map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-full transition-all"
                          style={{
                            backgroundColor: isEffectivelyAudible && isPlaying ? track.color : '#3a3a3a',
                            height: isEffectivelyAudible && isPlaying ? `${Math.sin(i * 0.5) * 80 + 20}%` : '20%',
                          }}
                        />
                      ))}
                    </div>

                    {/* Fader & Mute/Solo */}
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      {/* Volume Slider */}
                      <div className="flex items-center gap-2 w-32">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={track.volume}
                          onChange={(e) => updateVolume(track.id, Number(e.target.value))}
                          className="w-full"
                          style={{ accentColor: track.color }}
                        />
                        <span className="text-[11px] font-mono text-white/60 w-8 text-right">
                          {track.volume}%
                        </span>
                      </div>

                      {/* Solo */}
                      <button
                        onClick={() => toggleSolo(track.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                          track.isSolo
                            ? 'bg-amber-500 text-black'
                            : 'bg-[#2b2b2b] text-white/60 hover:text-white'
                        }`}
                      >
                        S
                      </button>

                      {/* Mute */}
                      <button
                        onClick={() => toggleMute(track.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-colors ${
                          track.isMuted
                            ? 'bg-red-600 text-white'
                            : 'bg-[#2b2b2b] text-white/60 hover:text-white'
                        }`}
                      >
                        M
                      </button>

                      {/* Download Single Stem */}
                      <button
                        onClick={() => alert(`Downloading individual stem: ${track.name}.wav`)}
                        className="p-1.5 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white/70 hover:text-white transition-colors"
                        title="Download Stem Track"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#3a3a3a]">
          <div className="text-xs text-white/50">
            Model: AI-Demux-v4 Deep Neural Architecture (Trained on 500k lossless multi-tracks)
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => alert('Downloading complete Stem Package (ZIP with 4 Lossless WAVs)...')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/20 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download All 4 Stems (ZIP)</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
