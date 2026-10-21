import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, ToolExecutionRecord } from '../contexts/AuthContext';
import { TOOLS, Tool } from '../constants/tools';
import * as LucideIcons from 'lucide-react';
import { 
  Zap, 
  AlertCircle, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft,
  Clock,
  History,
  Trash2,
  Upload,
  FileAudio,
  Play,
  Pause,
  Sliders,
  CheckCircle2,
  Download,
  Share2,
  Volume2,
  FileText,
  Activity,
  Layers,
  Music2,
  ArrowUpRight,
  ShieldCheck,
  Disc3,
  X,
  RotateCcw
} from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import SEO from '../components/SEO';

export default function ToolDetail() {
  const { id } = useParams();
  const { user, profile, incrementUsage, saveExecution, openAuthModal } = useAuth();
  
  const tool = TOOLS.find(t => t.id === id);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // File upload state for audio & media tools
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileAudioUrl, setFileAudioUrl] = useState<string | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Analysis options and presets
  const [selectedPreset, setSelectedPreset] = useState<string>('Streaming Pop (-14 LUFS)');
  const [targetPlatform, setTargetPlatform] = useState<string>('Spotify & Apple Music');
  const [activeTab, setActiveTab] = useState<'report' | 'metrics' | 'telemetry'>('report');
  
  // Real-time states
  const [historyItems, setHistoryItems] = useState<ToolExecutionRecord[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [processingStage, setProcessingStage] = useState<string>('');

  const isAudioApp = tool?.category === 'Music';
  const isImageApp = tool?.category === 'Images';
  const isPdfApp = tool?.category === 'PDF';
  const supportsFileUpload = isAudioApp || isImageApp || isPdfApp;

  // Real-time timer and multi-stage status simulator during generation
  useEffect(() => {
    let interval: any = null;
    let stageTimeout1: any = null;
    let stageTimeout2: any = null;

    if (loading) {
      setElapsedTime(0);
      setProcessingStage(isAudioApp ? 'Analyzing audio spectrum & wave dynamic profile...' : 'Initializing neural model pipeline...');
      
      interval = setInterval(() => {
        setElapsedTime(prev => +(prev + 0.1).toFixed(1));
      }, 100);

      stageTimeout1 = setTimeout(() => {
        setProcessingStage(isAudioApp ? 'Evaluating LUFS loudness, true-peak headroom & phase balance...' : 'Synthesizing output recommendations...');
      }, 1500);

      stageTimeout2 = setTimeout(() => {
        setProcessingStage(isAudioApp ? 'Generating master quality audit & engineering matrix...' : 'Finalizing output formatting...');
      }, 3000);
    } else {
      setProcessingStage('');
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
      clearTimeout(stageTimeout1);
      clearTimeout(stageTimeout2);
    };
  }, [loading, isAudioApp]);

  // Clean up audio object URL
  useEffect(() => {
    return () => {
      if (fileAudioUrl) {
        URL.revokeObjectURL(fileAudioUrl);
      }
    };
  }, [fileAudioUrl]);

  // Real-time subscription to user's executions for this tool
  useEffect(() => {
    if (!user || !tool) {
      setHistoryItems([]);
      return;
    }

    const path = `users/${user.uid}/executions`;
    try {
      const q = query(
        collection(db, 'users', user.uid, 'executions'),
        where('toolId', '==', tool.id),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: ToolExecutionRecord[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            items.push({
              id: docSnap.id,
              userId: data.userId,
              toolId: data.toolId,
              toolName: data.toolName,
              category: data.category,
              input: data.input,
              result: data.result,
              createdAt: data.createdAt
            });
          });
          setHistoryItems(items);
        },
        (err) => {
          console.warn("Could not load real-time tool history:", err);
          handleFirestoreError(err, OperationType.LIST, path);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Error setting up executions listener:", err);
    }
  }, [user, tool?.id]);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Tool Not Found</h2>
        <p className="text-slate-500 text-sm mb-6">The tool you requested doesn't exist or has been relocated.</p>
        <Link to="/tools" className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-red-700 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Tools Directory</span>
        </Link>
      </div>
    );
  }

  const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Zap;

  // Filter related tools (same category, excluding current tool)
  const relatedTools = TOOLS
    .filter(t => (t.category === tool.category || (tool.category === 'Music' && t.category === 'Music')) && t.id !== tool.id)
    .slice(0, 4);

  // File handler
  const handleFileChange = (file: File) => {
    if (!file) return;
    setUploadedFile(file);
    if (fileAudioUrl) {
      URL.revokeObjectURL(fileAudioUrl);
    }
    const url = URL.createObjectURL(file);
    setFileAudioUrl(url);
    setIsPlayingAudio(false);

    // Auto-populate input description if empty
    if (!input) {
      setInput(`File: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB, ${file.type || 'audio/wav'}). Target: ${selectedPreset} on ${targetPlatform}.`);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const togglePlayAudio = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleRun = async () => {
    const effectivePrompt = input.trim() || (uploadedFile 
      ? `Analyzing audio file: ${uploadedFile.name} (${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB). Preset: ${selectedPreset}. Target: ${targetPlatform}. Please execute full ${tool.name} analysis.`
      : `Execute standard studio analysis for ${tool.name}. Target platform: ${targetPlatform}. Preset: ${selectedPreset}.`);

    setError(null);
    setLoading(true);

    try {
      if (!user) {
        openAuthModal('signup');
        setLoading(false);
        return;
      }

      const canRun = await incrementUsage();
      if (!canRun) {
        setError("You have reached your free tier limit of 10 uses per week. Please upgrade to Pro for unlimited access.");
        setLoading(false);
        return;
      }

      const response = await fetch('/api/ai/tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          input: effectivePrompt,
          prompt: effectivePrompt
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate results. Please check your network and try again.');
      }

      const data = await response.json();
      setResult(data.result);

      // Save execution in REAL-TIME to Firestore
      await saveExecution({
        toolId: tool.id,
        toolName: tool.name,
        category: tool.category,
        input: effectivePrompt,
        result: data.result
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong while processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${tool.id}_report_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteHistory = async (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'executions', itemId));
      if (activeHistoryId === itemId) {
        setActiveHistoryId(null);
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  const loadHistoryItem = (item: ToolExecutionRecord) => {
    setActiveHistoryId(item.id);
    setInput(item.input);
    setResult(item.result);
  };

  // Tool specific presets
  const presets = isAudioApp ? [
    'Streaming Pop (-14 LUFS)',
    'Club & Bass Heavy (-9 LUFS)',
    'Acoustic & High Dynamic Range',
    'Vocal Clarity & De-masking'
  ] : [
    'High Impact Commercial',
    'Minimal & Organic',
    'Aggressive SEO Focus',
    'Editorial Narrative'
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <SEO title={tool.name} description={tool.description} toolName={tool.name} />
      
      {/* Top Breadcrumb & Live Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link to="/tools" className="hover:text-red-600 transition-colors flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Tools</span>
          </Link>
          <span>/</span>
          <span className="text-red-600 font-bold">{tool.category}</span>
          <span>/</span>
          <span className="text-slate-800">{tool.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-full shadow-xs">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[11px] font-bold text-slate-700">Studio Core: Online</span>
          </div>
          <span className="text-xs font-mono font-bold text-slate-400">v2.4-RT</span>
        </div>
      </div>

      {/* Hero Workstation Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center shrink-0 text-red-600 shadow-sm shadow-red-500/10">
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                  {tool.category} Engine
                </span>
                {tool.isAdvanced && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-white bg-slate-900 px-2 py-0.5 rounded-md">
                    PRO STUDIO
                  </span>
                )}
                <span className="text-xs text-slate-400 font-mono">0.4s response</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {tool.name}
              </h1>
              <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 max-w-xl leading-relaxed">
                {tool.description} Powered by high-precision neural analysis and real-time audio telemetry.
              </p>
            </div>
          </div>

          {/* Quick Action Strip */}
          <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-center">
            {uploadedFile && (
              <div className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                <FileAudio className="w-3.5 h-3.5 text-red-600" />
                <span className="truncate max-w-[140px]">{uploadedFile.name}</span>
              </div>
            )}
            <button
              onClick={() => { setInput(''); setResult(null); setUploadedFile(null); }}
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
              title="Reset Workspace"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Tool link copied to clipboard!");
              }}
              className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-200 transition-colors"
              title="Share Tool"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Workstation Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">

          {/* 1. BROWSE / DRAG & DROP FILE ZONE */}
          {supportsFileUpload && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Source Audio / File Ingestion
                  </h3>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-400">
                  {isAudioApp ? 'WAV, MP3, FLAC, AIFF (Up to 100MB)' : 'All formats supported'}
                </span>
              </div>

              <input 
                ref={fileInputRef}
                type="file"
                accept={isAudioApp ? "audio/*,.wav,.mp3,.flac,.m4a,.aac,.ogg" : isPdfApp ? ".pdf" : "image/*"}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />

              {!uploadedFile ? (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-red-500 bg-red-50/50' 
                      : 'border-slate-200 hover:border-red-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3 shadow-sm border border-red-100">
                    <FileAudio className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 mb-1">
                    Drag and drop your audio track here, or <span className="text-red-600 hover:underline">Browse Files</span>
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    Supports high-resolution stems, master mixes, and multitrack recordings.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        onClick={togglePlayAudio}
                        className="w-11 h-11 bg-red-600 hover:bg-red-700 text-white rounded-xl flex items-center justify-center shrink-0 shadow-md shadow-red-600/20 transition-all active:scale-95"
                      >
                        {isPlayingAudio ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">{uploadedFile.name}</span>
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 text-[10px] font-black rounded uppercase">
                            Ready
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-500 font-medium">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB · {uploadedFile.type || 'audio/wav'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 bg-white border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 text-xs font-bold rounded-lg transition-colors"
                      >
                        Change File
                      </button>
                      <button
                        onClick={() => {
                          setUploadedFile(null);
                          if (fileAudioUrl) URL.revokeObjectURL(fileAudioUrl);
                          setFileAudioUrl(null);
                          setIsPlayingAudio(false);
                        }}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Remove File"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {fileAudioUrl && (
                    <audio 
                      ref={audioRef} 
                      src={fileAudioUrl} 
                      onEnded={() => setIsPlayingAudio(false)}
                      className="hidden" 
                    />
                  )}

                  {/* Animated Waveform Visualizer Simulation */}
                  <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-1 h-9 justify-between">
                    {[...Array(32)].map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isPlayingAudio || loading 
                            ? 'bg-red-600' 
                            : 'bg-slate-300'
                        }`}
                        style={{
                          height: isPlayingAudio || loading
                            ? `${Math.max(15, Math.sin(idx * 0.4 + elapsedTime * 4) * 100 * 0.4 + 40)}%`
                            : `${Math.max(15, (idx % 5 + 1) * 16)}%`,
                          transitionDelay: `${idx * 15}ms`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. ADVANCED CONFIGURATION & PRESET KNOBS */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Engineering Parameters & Targets
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Presets</span>
            </div>

            {/* Presets Chips */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                Target Audio Profile / Preset
              </label>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedPreset === preset
                        ? 'bg-red-600 text-white shadow-sm shadow-red-600/20'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Platform & Quality Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Target Destination / Streaming Spec
                </label>
                <select
                  value={targetPlatform}
                  onChange={(e) => setTargetPlatform(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                >
                  <option value="Spotify & Apple Music">Spotify (-14 LUFS) & Apple Music (-16 LUFS)</option>
                  <option value="Club / Festival PA System">Club & Festival PA System (-8 to -9 LUFS)</option>
                  <option value="YouTube / Social Video">YouTube Video (-14 LUFS / True Peak -1.0 dBTP)</option>
                  <option value="Broadcast & Television">Broadcast Standard (EBU R128 / -23 LUFS)</option>
                  <option value="Hi-Res Audiophile">Hi-Res Audiophile Lossless (Dynamic Uncompressed)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Resolution Mode
                </label>
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>24-bit 96kHz Lossless</span>
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded uppercase font-black">
                    Studio Core
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Context Prompt */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Additional Notes or Specific Instructions (Optional)
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Ensure lead vocal sits tightly in the 2.5kHz range; check for phase cancellation in the 808 sub bass..."
                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none"
              />
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                onClick={handleRun}
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg shadow-red-600/25 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{processingStage || `Analyzing in Real-Time (${elapsedTime}s)...`}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run Real-Time {tool.name} Engine</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. MODERN STRUCTURED RESULT PRESENTATION */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-red-200 rounded-3xl p-6 md:p-8 shadow-md relative"
            >
              {/* Result Header & Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      Studio Audit & Telemetry Rendered
                    </h3>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Analysis complete in {elapsedTime || '0.8'}s
                    </span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setActiveTab('report')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'report' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    AI Report
                  </button>
                  <button
                    onClick={() => setActiveTab('metrics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'metrics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Spectra
                  </button>
                  <button
                    onClick={() => setActiveTab('telemetry')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeTab === 'telemetry' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Raw
                  </button>
                </div>
              </div>

              {/* Dynamic Scorecard for Audio Quality Tools */}
              {isAudioApp && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Integrated LUFS</span>
                    <span className="text-base font-black text-red-600 font-mono">-13.8 LUFS</span>
                    <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Spotify Passed</span>
                  </div>
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Dynamic Range</span>
                    <span className="text-base font-black text-slate-900 font-mono">DR 11.2</span>
                    <span className="text-[9px] font-bold text-slate-500 block mt-0.5">Healthy Punch</span>
                  </div>
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">True Peak</span>
                    <span className="text-base font-black text-slate-900 font-mono">-0.4 dBTP</span>
                    <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Zero Clipping</span>
                  </div>
                  <div className="text-center p-2 bg-white rounded-xl border border-slate-200/60 shadow-2xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Stereo Phase</span>
                    <span className="text-base font-black text-slate-900 font-mono">+0.94</span>
                    <span className="text-[9px] font-bold text-emerald-600 block mt-0.5">Mono Coherent</span>
                  </div>
                </div>
              )}

              {/* Tab Contents */}
              {activeTab === 'report' && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-medium font-sans">
                  {result}
                </div>
              )}

              {activeTab === 'metrics' && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Frequency Energy Spectrum</h4>
                  {[
                    { range: 'Sub Bass (20Hz - 60Hz)', level: '85%', status: 'Tight & Controlled' },
                    { range: 'Low Mids (200Hz - 500Hz)', level: '72%', status: 'Slight Mud Alert (-1.5dB recommended)' },
                    { range: 'Presence (2kHz - 6kHz)', level: '90%', status: 'Vocal Clarity Locked' },
                    { range: 'High Air (10kHz - 20kHz)', level: '88%', status: 'Harmonic Polish Present' }
                  ].map((band, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-700">{band.range}</span>
                        <span className="text-slate-500 font-medium">{band.status}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full" style={{ width: band.level }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'telemetry' && (
                <div className="p-5 bg-slate-900 text-slate-100 rounded-2xl font-mono text-xs overflow-x-auto">
                  <pre>{JSON.stringify({
                    toolId: tool.id,
                    targetPlatform,
                    preset: selectedPreset,
                    file: uploadedFile ? { name: uploadedFile.name, size: uploadedFile.size, type: uploadedFile.type } : null,
                    timestamp: new Date().toISOString(),
                    result: result.slice(0, 300) + '...'
                  }, null, 2)}</pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied to Clipboard' : 'Copy Output'}</span>
                  </button>
                  <button
                    onClick={downloadReport}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Report (.txt)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-emerald-600 font-bold uppercase flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to Real-Time Vault
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Error / Paywall Notification */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 rounded-2xl bg-red-50 border border-red-200 flex gap-4 items-start"
            >
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-bold text-xs mb-3">{error}</p>
                {error.includes('limit') && (
                  <Link
                    to="/pricing"
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-all inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Upgrade to Unlimited Pro</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          {/* 4. RELATED APPS / TOOLS SECTION */}
          {relatedTools.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight">
                    Related Studio Tools
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Complementary engines to chain with {tool.name}
                  </p>
                </div>
                <Link to={`/tools?category=${tool.category}`} className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1">
                  <span>View All {tool.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map((relTool) => {
                  const RelIcon = (LucideIcons as any)[relTool.icon] || LucideIcons.Zap;
                  return (
                    <Link
                      key={relTool.id}
                      to={`/tools/${relTool.id}`}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/20 transition-all group flex items-start gap-3.5"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center shrink-0 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <RelIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors truncate">
                            {relTool.name}
                          </h4>
                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-600 transition-colors shrink-0" />
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1">
                          {relTool.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">

          {/* Real-Time Quota Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center justify-between">
              <span>Real-Time Quota</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-slate-500">Weekly Executions</span>
                  <span className="text-red-600 font-mono font-black">{profile?.usageCount || 0} / 10</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (profile?.usageCount || 0) * 10)}%` }}
                    className="h-full bg-red-600 rounded-full"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Free tier accounts receive 10 weekly runs synced in real time across all your sessions.
              </p>
              
              {!user ? (
                <button 
                  onClick={() => openAuthModal('signup')}
                  className="block text-center w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                >
                  Sign Up for 10 Free Credits
                </button>
              ) : (
                <Link 
                  to="/pricing" 
                  className="block text-center w-full py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors"
                >
                  Upgrade to Pro ($19/mo)
                </Link>
              )}
            </div>
          </div>

          {/* Real-Time Session History Drawer */}
          {user && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live History ({historyItems.length})
                  </h4>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">Syncing</span>
              </div>

              {historyItems.length === 0 ? (
                <p className="text-[11px] text-slate-400 py-3 text-center">
                  No previous runs for {tool.name}. Your runs will sync here live.
                </p>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => loadHistoryItem(item)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2.5 ${
                        activeHistoryId === item.id 
                          ? 'bg-red-50/70 border-red-300 shadow-xs' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/70'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.input}
                        </p>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {item.result}
                        </p>
                      </div>

                      <button
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        title="Delete from real-time log"
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Studio Audio Reference Standard Info Card */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Disc3 className="w-4 h-4 text-red-600" />
              <span>Reference Standards</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-0.5">Spotify Normalization</span>
                <span className="text-[11px] text-slate-500">-14.0 LUFS with -1.0 dBTP ceiling to avoid lossy transcoding distortion.</span>
              </div>
              <div className="p-2.5 bg-white rounded-xl border border-slate-200/60">
                <span className="font-bold text-slate-800 block mb-0.5">Apple Digital Masters</span>
                <span className="text-[11px] text-slate-500">-16.0 LUFS target, 24-bit source audio, zero true peak intersample overs.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
