import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, ToolExecutionRecord } from '../contexts/AuthContext';
import { TOOLS } from '../constants/tools';
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
  ExternalLink,
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
  const [historyItems, setHistoryItems] = useState<ToolExecutionRecord[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Real-time execution timer
  useEffect(() => {
    let interval: any = null;
    if (loading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => +(prev + 0.1).toFixed(1));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [loading]);

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

  const handleRun = async () => {
    if (!input.trim() && tool.category !== 'Music') return;
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        // Prompt user to sign up or sign in
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
          input: input || 'Execute default calibration',
          prompt: input || 'Execute default calibration'
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
        input: input || 'Default calibration parameter',
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

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <SEO title={tool.name} description={tool.description} toolName={tool.name} />
      
      {/* Back button breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/tools" 
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Tools</span>
        </Link>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Real-Time Engine Active</span>
        </div>
      </div>

      {/* Tool Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-center shrink-0 text-red-600">
            <IconComponent className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-600">{tool.category}</span>
              <span className="text-slate-300">/</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Real-Time Cloud</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">{tool.name}</h1>
            <p className="text-xs text-slate-500 font-medium mt-1">{tool.description}</p>
          </div>
        </div>
        
        {tool.category === 'Music' && (
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-red-50 border border-red-200 rounded-xl w-fit">
            <div className="w-2 h-2 rounded-full bg-red-600 animate-ping"></div>
            <span className="text-[11px] font-bold text-red-700 uppercase tracking-wider">Acoustic Engine Ready</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Terminal Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600"></span>
                Input Parameters & Description
              </label>
              {loading && (
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-red-600">
                  <Clock className="w-3.5 h-3.5 animate-spin" />
                  <span>{elapsedTime}s</span>
                </div>
              )}
            </div>

            <textarea 
              className="w-full h-48 bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all resize-none mb-4"
              placeholder={`Describe your requirements for ${tool.name} (e.g. key details, audio style, target keywords, or content tone)...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={handleRun}
                disabled={loading || (!input.trim() && tool.category !== 'Music')}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-md shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing in Real-Time ({elapsedTime}s)...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Run {tool.name}</span>
                  </>
                )}
              </button>

              {input && (
                <button
                  onClick={() => { setInput(''); setResult(null); setActiveHistoryId(null); }}
                  className="px-4 py-3.5 border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold uppercase transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Result Output */}
          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-red-200 rounded-2xl p-6 shadow-sm relative"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-600"></div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-red-600">
                    Real-Time Generated Output
                  </h3>
                </div>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition-colors py-1 px-2.5 rounded-lg hover:bg-red-50"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-red-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Output'}</span>
                </button>
              </div>
              
              <div className="text-sm leading-relaxed text-slate-800 whitespace-pre-wrap font-medium p-4 bg-slate-50 rounded-xl border border-slate-200">
                {result}
              </div>
            </motion.div>
          )}

          {/* Real-Time Generation History Subcollection */}
          {user && historyItems.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-red-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Live Session History ({historyItems.length})
                  </h3>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Synced in Real-Time</span>
              </div>

              <div className="space-y-3">
                {historyItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => loadHistoryItem(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      activeHistoryId === item.id 
                        ? 'bg-red-50/60 border-red-300 shadow-sm' 
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate mb-1">
                        {item.input}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1">
                        {item.result}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={(e) => handleDeleteHistory(item.id, e)}
                        title="Delete from real-time log"
                        className="p-1 text-slate-400 hover:text-red-600 rounded transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error / Limit Notification */}
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
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-red-700 transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Upgrade to Unlimited Pro</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar Info Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Usage Meter Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
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
                Free accounts receive 10 executions refreshed weekly. Data syncs live across all your browsers and devices.
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
                  Upgrade to Pro
                </Link>
              )}
            </div>
          </div>

          {/* Pro Benefits Card */}
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider mb-4">
              Pro Engine Benefits
            </h4>
            <ul className="space-y-3">
              {[
                "Unlimited Real-Time Runs",
                "High-Fidelity Audio Models",
                "Export Clean Stems & WAVs",
                "Priority Inference Queue"
              ].map((feat, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
