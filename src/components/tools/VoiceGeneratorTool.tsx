import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Play, 
  Square, 
  Volume2, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Sliders, 
  Radio,
  Disc,
  Flame,
  Layers,
  Wand2
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface VoiceGeneratorToolProps {
  tool: ToolDefinition;
  user: UserProfile;
  onExecuteAi: (inputs: Record<string, any>) => Promise<any>;
}

export const VoiceGeneratorTool: React.FC<VoiceGeneratorToolProps> = ({
  tool,
  user,
  onExecuteAi,
}) => {
  const [script, setScript] = useState('AI Suite in the mix. Turn up the monitors and feel the sub-bass frequency.');
  const [voiceArchetype, setVoiceArchetype] = useState('studio_male');
  const [pitch, setPitch] = useState(0);
  const [speed, setSpeed] = useState(1.0);
  const [reverb, setReverb] = useState('plate');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);

  // Producer tag quick templates
  const presets = [
    { label: 'Producer Drop', text: 'AI Suite exclusive. Another certified club heater.' },
    { label: 'Festival Intro', text: 'Ladies and gentlemen, welcome to the main stage. Drop incoming in three, two, one!' },
    { label: 'Late Night Radio', text: 'You are locked in to the late night studio broadcast. Pure underground frequencies until sunrise.' },
    { label: 'Cyberpunk Tag', text: 'Warning: Neural audio overload detected. AI Suite synthesis active.' },
  ];

  // Speech Synthesis Engine
  const speakText = () => {
    if (!('speechSynthesis' in window)) {
      setStatusMessage('Web Speech API is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(script);

    // Pitch mapping (-12 to 12 semitones to 0.5 - 1.8)
    utterance.pitch = Math.max(0.2, Math.min(2.0, 1 + pitch / 12));
    utterance.rate = speed;

    // Pick suitable available system voices
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      if (voiceArchetype === 'ambient_female') {
        const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira'));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else if (voiceArchetype === 'studio_male') {
        const maleVoice = voices.find(v => v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('daniel'));
        if (maleVoice) utterance.voice = maleVoice;
      }
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setStatusMessage('Synthesizing studio voice with dynamic pitch inflection...');
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setStatusMessage('Voice synthesis playback completed.');
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setStatusMessage('Playback error.');
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopPlayback = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setStatusMessage('Playback stopped.');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGenerateScriptWithAi = async () => {
    setIsGeneratingAi(true);
    try {
      const response = await onExecuteAi({
        voiceArchetype,
        pitch,
        speed,
        reverb,
        requestType: 'Generate 3 high-impact producer voice drops and vocal hook lines'
      });
      if (response && response.result) {
        setScript(response.result.replace(/#/g, '').replace(/\*/g, '').trim().substring(0, 300));
        setStatusMessage('AI generated a new custom studio script!');
      }
    } catch (e) {
      // Handled in parent
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Neural Voice & Producer Drop Generator
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Studio FX
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Synthesize custom DJ drops, podcast intros, vocal chops, and narration.
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateScriptWithAi}
            disabled={isGeneratingAi}
            className="px-3.5 py-2 rounded-xl bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#BE1E2F]/50 text-xs text-white flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#BE1E2F]" />
            <span>{isGeneratingAi ? 'Generating AI Drop...' : 'AI Generate Drop Script'}</span>
          </button>
        </div>

        {/* Preset Selector */}
        <div>
          <span className="text-[11px] font-mono text-white/50 block mb-2">QUICK STUDIO PRESETS:</span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p, i) => (
              <button
                key={i}
                onClick={() => setScript(p.text)}
                className="px-3 py-1 rounded-lg bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-xs text-white/80 hover:text-white transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Script Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono text-white/70">VOICE SCRIPT & LYRICS</label>
            <button
              onClick={handleCopy}
              className="text-xs text-white/50 hover:text-white flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            rows={3}
            className="w-full p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-sm focus:outline-none transition-colors"
            placeholder="Type speech script or producer drop here..."
          />
        </div>

        {/* Timbre & Modulation Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          
          {/* Voice Archetype */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/60">VOICE PROFILE</label>
            <select
              value={voiceArchetype}
              onChange={(e) => setVoiceArchetype(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-xs text-white focus:border-[#BE1E2F] focus:outline-none"
            >
              <option value="studio_male">Deep Studio Male (Radio/Drop)</option>
              <option value="ambient_female">Smooth Ambient Female (Ethereal)</option>
              <option value="hype_host">Energetic Hype Host (Festival)</option>
              <option value="cyber_vocoder">Cyberpunk Vocoder (Robotic)</option>
              <option value="warm_narrator">Warm Narrative Acoustic</option>
            </select>
          </div>

          {/* Pitch Shifter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>PITCH SHIFT</span>
              <span className="text-[#BE1E2F] font-bold">{pitch > 0 ? `+${pitch}` : pitch} st</span>
            </div>
            <input
              type="range"
              min="-12"
              max="12"
              step="1"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="w-full accent-[#BE1E2F]"
            />
          </div>

          {/* Speed Multiplier */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono text-white/60">
              <span>SPEED RATE</span>
              <span className="text-[#BE1E2F] font-bold">{speed}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-[#BE1E2F]"
            />
          </div>

          {/* Reverb Space */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-white/60">REVERB SPACE</label>
            <select
              value={reverb}
              onChange={(e) => setReverb(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-xs text-white focus:border-[#BE1E2F] focus:outline-none"
            >
              <option value="dry">Dry Studio Booth</option>
              <option value="plate">Vintage Plate Reverb</option>
              <option value="cathedral">Cathedral Hall Reverb</option>
              <option value="echo">Cyber Slapback Echo</option>
            </select>
          </div>

        </div>

        {/* Visual Audio Spectrum Simulator */}
        <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-end gap-1 h-8 px-2">
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-1' : 'h-2'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-2' : 'h-4'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-3' : 'h-3'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-4' : 'h-6'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-5' : 'h-2'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-2' : 'h-5'}`} />
              <div className={`w-1 bg-[#BE1E2F] rounded-full ${isPlaying ? 'animate-wave-4' : 'h-3'}`} />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                {isPlaying ? 'Streaming Synthesized Audio...' : 'Audio Synthesizer Ready'}
              </div>
              <div className="text-[11px] text-white/50 font-mono">
                {statusMessage || 'Click Play to hear speech output in real-time.'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isPlaying ? (
              <button
                onClick={stopPlayback}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={speakText}
                className="px-5 py-2.5 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#BE1E2F]/25 hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Synthesize & Play</span>
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
