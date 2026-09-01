import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Clock, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { ToolExecutionLog } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [logs, setLogs] = useState<ToolExecutionLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tools/logs');
      const data = await res.json();
      if (data.success && data.logs) {
        setLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLogs();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#1a1a1a] border-l border-[#3a3a3a] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        id="history-drawer"
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#3a3a3a] flex items-center justify-between bg-[#2b2b2b]">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#BE1E2F]" />
            <h3 className="font-bold text-white text-sm">Execution Logs & Telemetry</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLogs}
              className="p-1.5 rounded-lg hover:bg-[#3a3a3a] text-white/60 hover:text-white"
              title="Refresh logs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#3a3a3a] text-white/60 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              onClick={() => {
                onSelectTool(log.tool_slug);
                onClose();
              }}
              className="p-3.5 rounded-xl bg-[#2b2b2b]/50 border border-[#3a3a3a] hover:border-[#BE1E2F] cursor-pointer group transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white group-hover:text-[#BE1E2F] transition-colors truncate">
                  {log.tool_name}
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono flex items-center gap-1 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> {log.status.toUpperCase()}
                </span>
              </div>

              <div className="text-[11px] text-white/50 font-mono flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {new Date(log.executed_at).toLocaleString()}
              </div>

              {log.output_summary && (
                <p className="text-[11px] text-white/60 line-clamp-2 bg-[#1a1a1a] p-2 rounded-lg font-mono">
                  {log.output_summary}
                </p>
              )}
            </div>
          ))}

          {logs.length === 0 && !isLoading && (
            <div className="p-12 text-center text-xs text-white/50 space-y-2">
              <Terminal className="w-8 h-8 text-white/30 mx-auto" />
              <p>No tool execution logs found yet.</p>
              <p className="text-[11px] text-white/40">Execute any of the 54 tools to view real-time logs.</p>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#3a3a3a] bg-[#141414] text-[11px] font-mono text-white/40 text-center">
          AI Suite Telemetry Guard
        </div>
      </div>
    </div>
  );
};
