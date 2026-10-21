import React, { useState, useEffect } from 'react';
import { useAuth, ToolExecutionRecord } from '../contexts/AuthContext';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  Zap, 
  History, 
  Sparkles, 
  ArrowRight, 
  User, 
  CheckCircle2,
  Clock,
  ExternalLink,
  Trash2,
  Activity,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';
import SEO from '../components/SEO';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [executions, setExecutions] = useState<ToolExecutionRecord[]>([]);
  const [selectedExecution, setSelectedExecution] = useState<ToolExecutionRecord | null>(null);

  // Real-time live stream of all executions
  useEffect(() => {
    if (!user) {
      setExecutions([]);
      return;
    }

    const path = `users/${user.uid}/executions`;
    try {
      const q = query(
        collection(db, 'users', user.uid, 'executions'),
        orderBy('createdAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: ToolExecutionRecord[] = [];
          snapshot.forEach(docSnap => {
            const data = docSnap.data();
            list.push({
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
          setExecutions(list);
        },
        (err) => {
          console.warn("Could not load real-time execution list:", err);
          handleFirestoreError(err, OperationType.LIST, path);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn("Failed to listen to executions:", err);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" />;

  const isFree = profile?.subscriptionTier === 'free' || !profile?.subscriptionTier;

  const handleDeleteExecution = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'executions', id));
      if (selectedExecution?.id === id) {
        setSelectedExecution(null);
      }
    } catch (err) {
      console.error("Failed to delete execution:", err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <SEO title="Creator Dashboard" />

      {/* Header Profile Bar */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center overflow-hidden border border-red-200 text-xl font-black">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-8 h-8 text-red-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Profile</span>
              <span className="text-slate-300">·</span>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600">
                {profile?.subscriptionTier || 'Free'} Tier
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse ml-1"></span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase">Live</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              {user.displayName || 'Creator'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex-1 md:flex-initial min-w-[160px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Membership</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 uppercase">
                {profile?.subscriptionTier || 'Free'} Plan
              </span>
              <Zap className={`w-3.5 h-3.5 ${isFree ? 'text-slate-400' : 'text-red-600 fill-red-600'}`} />
            </div>
          </div>

          <Link
            to="/pricing"
            className="px-5 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm shadow-red-600/20"
          >
            Manage Plan
          </Link>
        </div>
      </div>

      {/* Main Grid: Usage & Real-time Live Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Usage Meter Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Weekly Execution Quota</h2>
              </div>
              <span className="text-xs font-mono font-bold text-red-600">
                {isFree ? `${profile?.usageCount || 0} / 10 Used` : 'Unlimited Plan Active'}
              </span>
            </div>

            <div className="mb-6">
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isFree ? `${Math.min(100, (profile?.usageCount || 0) * 10)}%` : '100%' }}
                  className="h-full rounded-full bg-red-600"
                />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-slate-400 mt-2">
                <span>0 Runs</span>
                <span>{isFree ? '10 Runs Limit (Resets Weekly)' : 'Unlimited Cloud Runs'}</span>
              </div>
            </div>

            {isFree && (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-red-900 mb-0.5">Need more runs for batch processing?</h4>
                  <p className="text-[11px] text-red-700 font-medium">Pro gives you unlimited audio mastering, high-speed stems, and priority queue.</p>
                </div>
                <button 
                  onClick={() => navigate('/pricing')} 
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-700 transition-all whitespace-nowrap shadow-sm shadow-red-600/20"
                >
                  Upgrade Now ($19/mo)
                </button>
              </div>
            )}
          </div>

          {/* Real-Time Live Executions Log */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Real-Time Tool Activity</h3>
                  <p className="text-[11px] text-slate-500 font-medium">Live sync of outputs and generations across all tools</p>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                {executions.length} Total Runs
              </span>
            </div>

            {executions.length === 0 ? (
              <div className="py-12 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-slate-600">No tools executed yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">Pick an AI tool from the directory to start producing in real-time.</p>
                <Link
                  to="/tools"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-all shadow-sm"
                >
                  <span>Explore 60+ Tools</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {executions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedExecution(item)}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-red-300 hover:bg-red-50/20 cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded">
                          {item.toolName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {item.input}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.result}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <Link
                        to={`/tools/${item.toolId}`}
                        onClick={(e) => e.stopPropagation()}
                        title="Open Tool"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={(e) => handleDeleteExecution(item.id, e)}
                        title="Delete Run"
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Inspector of Selected Execution */}
          {selectedExecution && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-red-200 rounded-3xl p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  {selectedExecution.toolName} Output
                </span>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Close
                </button>
              </div>

              <div className="text-xs text-slate-500 font-medium mb-3">
                <span className="font-bold text-slate-700">Input: </span>
                {selectedExecution.input}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap max-h-60 overflow-y-auto">
                {selectedExecution.result}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedExecution.result);
                    alert("Output copied to clipboard!");
                  }}
                  className="flex-1 py-2 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
                >
                  Copy Output
                </button>
                <Link
                  to={`/tools/${selectedExecution.toolId}`}
                  className="px-3 py-2 border border-slate-200 text-slate-700 hover:text-red-600 rounded-xl text-xs font-bold transition-colors"
                >
                  Re-run
                </Link>
              </div>
            </motion.div>
          )}

          {/* Pro Upgrade Callout */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 text-white rounded-3xl p-6 md:p-7 shadow-lg shadow-red-600/20 relative overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-200 block mb-2">
              Pro Advantage
            </span>
            <h3 className="text-xl font-black mb-2 leading-tight">
              Unlock 24-Bit Studio Quality
            </h3>
            <p className="text-red-100 text-xs leading-relaxed mb-6">
              Export lossless audio stems, uncompressed mastering files, and unlimited lyrical variations with zero waiting.
            </p>
            <button 
              onClick={() => navigate('/pricing')}
              className="w-full bg-white text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              Explore Plans
            </button>
          </div>

          {/* Studio Insights Tips */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-600" />
              <span>Real-Time Tips</span>
            </h4>
            <div className="space-y-4">
              {[
                { title: "Multi-Tab Synchronization", desc: "Open multiple tools at once; usage and outputs sync live." },
                { title: "Target -14 LUFS for Streaming", desc: "Prevents Spotify & Apple Music compression clipping." },
                { title: "Leave -6dB Pre-Mastering Headroom", desc: "Allows our algorithms dynamic room to sculpt harmonics." }
              ].map((tip, i) => (
                <div key={i} className="pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className="text-xs font-bold text-slate-800 mb-0.5">{tip.title}</div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">{tip.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
