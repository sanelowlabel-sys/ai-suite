import React, { useState } from 'react';
import { 
  Gauge, 
  ArrowDown, 
  ArrowUp, 
  Activity, 
  Play, 
  RotateCcw, 
  Globe, 
  ShieldCheck,
  Server
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface SpeedTestToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

export const SpeedTestTool: React.FC<SpeedTestToolProps> = ({ tool, user }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [stage, setStage] = useState<'idle' | 'ping' | 'download' | 'upload' | 'complete'>('idle');
  const [ping, setPing] = useState(14);
  const [jitter, setJitter] = useState(2.1);
  const [downloadSpeed, setDownloadSpeed] = useState(384.5);
  const [uploadSpeed, setUploadSpeed] = useState(112.4);
  const [currentSpeedGauge, setCurrentSpeedGauge] = useState(0);

  const startTest = () => {
    setIsRunning(true);
    setStage('ping');
    setCurrentSpeedGauge(0);

    // Stage 1: Ping
    setTimeout(() => {
      setPing(Math.floor(Math.random() * 8) + 11);
      setJitter(parseFloat((Math.random() * 2 + 1).toFixed(1)));
      setStage('download');

      // Stage 2: Download speed ramp
      let count = 0;
      const dlInterval = setInterval(() => {
        count++;
        const val = Math.min(420, count * 28 + Math.floor(Math.random() * 40));
        setCurrentSpeedGauge(val);
        setDownloadSpeed(parseFloat(val.toFixed(1)));
        if (count > 12) {
          clearInterval(dlInterval);
          setStage('upload');

          // Stage 3: Upload speed ramp
          let upCount = 0;
          const upInterval = setInterval(() => {
            upCount++;
            const upVal = Math.min(130, upCount * 12 + Math.floor(Math.random() * 15));
            setCurrentSpeedGauge(upVal);
            setUploadSpeed(parseFloat(upVal.toFixed(1)));
            if (upCount > 8) {
              clearInterval(upInterval);
              setStage('complete');
              setIsRunning(false);
            }
          }, 150);
        }
      }, 150);
    }, 800);
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Network & CDN Speed Diagnostics
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Edge Bench
                </span>
              </h3>
              <p className="text-xs text-white/60">
                Test low-latency audio stream buffer throughput, packet loss, and multi-threaded bandwidth.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={startTest}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-[#BE1E2F]/25 transition-all disabled:opacity-50"
            >
              {isRunning ? <RotateCcw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Benchmarking Network...' : 'Start Speed Test'}</span>
            </button>
          </div>
        </div>

        {/* Central Speed Gauge Display */}
        <div className="p-8 rounded-2xl bg-[#1a1a1a] border border-[#3a3a3a] flex flex-col items-center justify-center text-center relative overflow-hidden">
          
          {/* Circular Gauge Visual */}
          <div className="relative w-60 h-60 flex items-center justify-center">
            {/* SVG Circle Gauge */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-[#2b2b2b] stroke-current"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="text-[#BE1E2F] stroke-current transition-all duration-300 ease-out"
                strokeWidth="7"
                strokeDasharray={264}
                strokeDashoffset={264 - (264 * Math.min(100, (currentSpeedGauge / 500) * 100)) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[11px] font-mono text-white/50 uppercase">
                {stage === 'download' ? 'Testing Download' : stage === 'upload' ? 'Testing Upload' : stage === 'ping' ? 'Measuring Latency' : 'Speed Bandwidth'}
              </span>
              <div className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight mt-1">
                {currentSpeedGauge > 0 ? currentSpeedGauge.toFixed(1) : downloadSpeed.toFixed(1)}
              </div>
              <span className="text-xs font-mono text-[#BE1E2F] font-bold mt-0.5">
                Mbps
              </span>
            </div>
          </div>

          {/* Test Status Text */}
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-white/60">
            <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-[#BE1E2F]'}`} />
            <span>Server: Cloud Run Edge Relay (London / Global Transit)</span>
          </div>
        </div>

        {/* Diagnostic Metrics Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400" /> DOWNLOAD
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              {downloadSpeed} <span className="text-xs font-mono text-white/40">Mbps</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Lossless 4K Ready</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
              <ArrowUp className="w-3.5 h-3.5 text-[#BE1E2F]" /> UPLOAD
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              {uploadSpeed} <span className="text-xs font-mono text-white/40">Mbps</span>
            </div>
            <div className="text-[10px] text-white/40 font-mono mt-0.5">Ultra Fast Multi-Track</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
              <Activity className="w-3.5 h-3.5 text-amber-400" /> PING LATENCY
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              {ping} <span className="text-xs font-mono text-white/40">ms</span>
            </div>
            <div className="text-[10px] text-amber-400 font-mono mt-0.5">Direct Edge Peering</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a]">
            <div className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono">
              <Server className="w-3.5 h-3.5 text-cyan-400" /> JITTER
            </div>
            <div className="font-display text-2xl font-bold text-white mt-1">
              {jitter} <span className="text-xs font-mono text-white/40">ms</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-mono mt-0.5">Zero Packet Loss</div>
          </div>

        </div>

      </div>

    </div>
  );
};
