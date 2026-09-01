import React, { useState } from 'react';
import { 
  RefreshCw, 
  UploadCloud, 
  FileCheck, 
  Download, 
  Sliders, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  CheckCircle2, 
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ToolDefinition, UserProfile } from '../../types';

interface FileConverterToolProps {
  tool: ToolDefinition;
  user: UserProfile;
}

interface QueuedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  sourceFormat: string;
  targetFormat: string;
  progress: number;
  status: 'idle' | 'converting' | 'done' | 'error';
  convertedSize?: number;
  downloadUrl?: string;
}

export const FileConverterTool: React.FC<FileConverterToolProps> = ({ tool, user }) => {
  const [sourceFormat, setSourceFormat] = useState('WAV');
  const [targetFormat, setTargetFormat] = useState('MP3');
  const [bitrate, setBitrate] = useState('320k');
  const [files, setFiles] = useState<QueuedFile[]>([
    {
      id: 'demo_1',
      name: 'Midnight_Horizon_Master_48k24b.wav',
      size: 48200000, // 48.2 MB
      type: 'audio',
      sourceFormat: 'WAV',
      targetFormat: 'MP3',
      progress: 100,
      status: 'done',
      convertedSize: 8400000, // 8.4 MB (82% smaller)
    }
  ]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const uploaded = Array.from(e.target.files).map((f) => {
      const ext = f.name.split('.').pop()?.toUpperCase() || 'FILE';
      return {
        id: `f_${Math.random().toString(36).substring(2, 9)}`,
        name: f.name,
        size: f.size,
        type: f.type,
        sourceFormat: ext,
        targetFormat: targetFormat,
        progress: 0,
        status: 'idle' as const,
      };
    });
    setFiles((prev) => [...prev, ...uploaded]);
  };

  const startConversion = (fileId?: string) => {
    setIsProcessingAll(true);

    setFiles((prev) =>
      prev.map((f) => {
        if (!fileId || f.id === fileId) {
          return { ...f, status: 'converting', progress: 10 };
        }
        return f;
      })
    );

    // Simulate multi-stage conversion pipeline
    const interval = setInterval(() => {
      setFiles((prev) => {
        const updated = prev.map((f) => {
          if (f.status === 'converting') {
            const nextProgress = f.progress + Math.floor(Math.random() * 25) + 15;
            if (nextProgress >= 100) {
              const reductionFactor = f.targetFormat === 'MP3' ? 0.18 : f.targetFormat === 'WEBP' ? 0.25 : 0.6;
              return {
                ...f,
                progress: 100,
                status: 'done' as const,
                convertedSize: Math.round(f.size * reductionFactor),
              };
            }
            return { ...f, progress: nextProgress };
          }
          return f;
        });

        const anyConverting = updated.some((f) => f.status === 'converting');
        if (!anyConverting) {
          setIsProcessingAll(false);
          clearInterval(interval);
        }

        return updated;
      });
    }, 400);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      
      {/* Studio Header Card */}
      <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#BE1E2F]/20 border border-[#BE1E2F]/40 flex items-center justify-center text-[#BE1E2F]">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                AI Universal Media Converter Engine
                <span className="px-2 py-0.5 rounded bg-[#BE1E2F] text-white text-[10px] font-mono uppercase">
                  Fast DSP
                </span>
              </h3>
              <p className="text-xs text-white/60">
                High-throughput lossless conversion for audio stems, video cuts, photos, and documents.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => startConversion()}
              disabled={isProcessingAll || files.length === 0}
              className="px-4 py-2 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#BE1E2F]/20 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isProcessingAll ? 'animate-spin' : ''}`} />
              <span>{isProcessingAll ? 'Converting Queue...' : 'Convert All Files'}</span>
            </button>
          </div>
        </div>

        {/* Global Format Selector Bar */}
        <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          
          <div className="space-y-1">
            <label className="text-[11px] font-mono text-white/60">FROM FORMAT</label>
            <select
              value={sourceFormat}
              onChange={(e) => setSourceFormat(e.target.value)}
              className="w-full p-2 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-xs text-white focus:border-[#BE1E2F] focus:outline-none"
            >
              <optgroup label="Audio Formats">
                <option value="WAV">WAV (24-bit Studio Lossless)</option>
                <option value="MP3">MP3 (MPEG Layer 3)</option>
                <option value="FLAC">FLAC (Free Lossless Audio)</option>
                <option value="AIFF">AIFF (Apple Audio)</option>
              </optgroup>
              <optgroup label="Video Formats">
                <option value="MOV">MOV (Apple ProRes / QuickTime)</option>
                <option value="MP4">MP4 (H.264 / AVC)</option>
                <option value="WEBM">WEBM (HTML5 Video)</option>
              </optgroup>
              <optgroup label="Image Formats">
                <option value="PNG">PNG (Transparent)</option>
                <option value="JPG">JPG (Standard Photo)</option>
                <option value="WEBP">WEBP (Modern Compressed)</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-center justify-center pt-4 sm:pt-0">
            <div className="w-8 h-8 rounded-full bg-[#2b2b2b] border border-[#3a3a3a] flex items-center justify-center text-[#BE1E2F]">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-mono text-white/60">TO TARGET FORMAT</label>
            <select
              value={targetFormat}
              onChange={(e) => {
                setTargetFormat(e.target.value);
                setFiles((prev) => prev.map((f) => ({ ...f, targetFormat: e.target.value })));
              }}
              className="w-full p-2 rounded-lg bg-[#2b2b2b] border border-[#3a3a3a] text-xs text-white focus:border-[#BE1E2F] focus:outline-none"
            >
              <optgroup label="Audio Targets">
                <option value="MP3">MP3 (320kbps High Quality)</option>
                <option value="WAV">WAV (Lossless 48kHz)</option>
                <option value="AAC">AAC (Streaming Optimized)</option>
              </optgroup>
              <optgroup label="Video Targets">
                <option value="MP4">MP4 (1080p Web Stream)</option>
                <option value="WEBM">WEBM (High Efficiency)</option>
              </optgroup>
              <optgroup label="Image Targets">
                <option value="WEBP">WEBP (Maximum Compression)</option>
                <option value="JPG">JPG (High Quality 95%)</option>
                <option value="PNG">PNG (Lossless Output)</option>
              </optgroup>
            </select>
          </div>

        </div>

        {/* Drag and Drop Zone */}
        <label className="border-2 border-dashed border-[#3a3a3a] hover:border-[#BE1E2F] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-[#1a1a1a]/50 group">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-[#2b2b2b] group-hover:bg-[#BE1E2F]/20 flex items-center justify-center text-white/70 group-hover:text-[#BE1E2F] transition-colors mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <span className="text-sm font-bold text-white">Click or drag files here to convert</span>
          <p className="text-xs text-white/50 mt-1 max-w-sm">
            Supports MP3, WAV, MOV, MP4, PNG, JPG, WebP, PDF. Batch conversion with automated codec optimization.
          </p>
        </label>

        {/* File Conversion Queue */}
        {files.length > 0 && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-mono text-white/60">
              <span>CONVERSION QUEUE ({files.length} ITEMS)</span>
              <button
                onClick={() => setFiles([])}
                className="text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3 h-3" /> Clear Queue
              </button>
            </div>

            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-[#2b2b2b] flex items-center justify-center text-[#BE1E2F] shrink-0 font-mono text-xs font-bold">
                      {file.targetFormat}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate max-w-xs sm:max-w-sm">
                        {file.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50 font-mono">
                        <span>Original: {formatBytes(file.size)}</span>
                        <span>•</span>
                        <span className="text-[#BE1E2F] font-bold">{file.sourceFormat} → {file.targetFormat}</span>
                        {file.convertedSize && (
                          <>
                            <span>•</span>
                            <span className="text-emerald-400 font-bold">
                              {formatBytes(file.convertedSize)} (-{Math.round((1 - file.convertedSize / file.size) * 100)}%)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Progress & Actions */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    {file.status === 'converting' ? (
                      <div className="flex items-center gap-2 w-32">
                        <div className="w-full h-1.5 bg-[#2b2b2b] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#BE1E2F] transition-all"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-white/60">{file.progress}%</span>
                      </div>
                    ) : file.status === 'done' ? (
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono flex items-center gap-1 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Ready
                        </span>
                        <a
                          href="#download"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading converted file: ${file.name.replace(/\.[^/.]+$/, "")}.${file.targetFormat.toLowerCase()}`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-[#BE1E2F]" />
                          <span>Download</span>
                        </a>
                      </div>
                    ) : (
                      <button
                        onClick={() => startConversion(file.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#2b2b2b] hover:bg-[#3a3a3a] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-[#BE1E2F]" />
                        <span>Convert</span>
                      </button>
                    )}

                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
