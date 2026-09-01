import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Flame, Layers } from 'lucide-react';
import { TOOLS_REGISTRY } from '../data/tools';
import { ToolDefinition } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (slug: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const results = TOOLS_REGISTRY.filter((tool) =>
    tool.name.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase()) ||
    tool.category.toLowerCase().includes(query.toLowerCase()) ||
    tool.slug.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#1a1a1a] border border-[#3a3a3a] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        id="search-modal"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#3a3a3a] flex items-center gap-3 bg-[#2b2b2b]">
          <Search className="w-5 h-5 text-[#BE1E2F]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a tool name, format, or capability..."
            className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-white/40"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-[#3a3a3a] text-white/50 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-2 max-h-96 overflow-y-auto space-y-1">
          {results.map((tool) => (
            <button
              key={tool.slug}
              onClick={() => {
                onSelectTool(tool.slug);
                onClose();
              }}
              className="w-full text-left p-3 rounded-xl hover:bg-[#2b2b2b] flex items-center justify-between group transition-colors"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white group-hover:text-[#BE1E2F] transition-colors truncate">
                    {tool.name}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#3a3a3a] text-[10px] font-mono text-white/50">
                    {tool.category}
                  </span>
                  {tool.isPopular && (
                    <span className="text-[10px] text-amber-400 font-mono flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5" /> Hot
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-white/50 truncate mt-0.5">{tool.description}</p>
              </div>

              <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#BE1E2F] group-hover:translate-x-1 transition-all shrink-0" />
            </button>
          ))}

          {results.length === 0 && (
            <div className="p-8 text-center text-xs text-white/50">
              No studio tools match your search "{query}".
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#141414] border-t border-[#3a3a3a] flex items-center justify-between text-[11px] font-mono text-white/40">
          <span>Search 54 studio AI tools</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
