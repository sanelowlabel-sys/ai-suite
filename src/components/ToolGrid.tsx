import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  SlidersHorizontal, 
  ArrowRight, 
  Radio,
  Layers,
  Crown,
  Zap,
  Filter
} from 'lucide-react';
import { ToolDefinition, ToolCategory, UserProfile } from '../types';
import { TOOLS_REGISTRY } from '../data/tools';

interface ToolGridProps {
  user: UserProfile;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectTool: (slug: string) => void;
  onOpenPaywall: () => void;
}

export const ToolGrid: React.FC<ToolGridProps> = ({
  user,
  selectedCategory,
  onSelectCategory,
  onSelectTool,
  onOpenPaywall,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'alpha' | 'category'>('popular');

  const categories: string[] = [
    'All',
    'Audio & Music',
    'Marketing & Writing',
    'Image & Visual',
    'PDF & Documents',
    'Media Converters',
    'SEO & Analytics',
    'Video AI'
  ];

  const filteredTools = useMemo(() => {
    let list = TOOLS_REGISTRY.filter((tool) => {
      const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
      const matchesSearch = 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'popular') {
      list.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    } else if (sortBy === 'alpha') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'category') {
      list.sort((a, b) => a.category.localeCompare(b.category));
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Studio Hero Header */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#2b2b2b] to-[#1a1a1a] border border-[#3a3a3a] p-8 sm:p-12 overflow-hidden shadow-2xl">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#BE1E2F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-[#BE1E2F]/20 text-[#BE1E2F] border border-[#BE1E2F]/40 text-xs font-mono font-bold tracking-wider uppercase">
              Record Label & Studio AI Stack
            </span>
            <span className="text-xs text-white/50 font-mono">54 Production Engines</span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
            The Multi-Tool AI Suite for Sound, Art & Web Mastery
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl">
            From stem isolation and LUFS audio mastering to neural voice synthesis, smart link telemetry, and universal media conversion — all in one dark studio environment.
          </p>

          {/* Search bar inside hero */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BE1E2F]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across all 54 AI tools (e.g., Voice, Stem, Mastering, Converter, Royalty)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs sm:text-sm focus:outline-none transition-colors shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                >
                  Clear
                </button>
              )}
            </div>

            {user.subscription_tier !== 'pro' && !user.isAdmin && (
              <button
                onClick={onOpenPaywall}
                className="px-5 py-3 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/30 transition-all shrink-0 active:scale-95"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>$10 Unlimited Upgrade</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Category Tabs Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#3a3a3a] pb-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#BE1E2F] text-white shadow-md shadow-[#BE1E2F]/20 font-bold'
                    : 'bg-[#2b2b2b] text-white/70 hover:text-white hover:bg-[#3a3a3a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-2 text-xs text-white/60 shrink-0">
            <SlidersHorizontal className="w-3.5 h-3.5 text-white/40" />
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#2b2b2b] border border-[#3a3a3a] rounded-lg px-2.5 py-1 text-white text-xs focus:border-[#BE1E2F] focus:outline-none"
            >
              <option value="popular">Most Popular</option>
              <option value="alpha">Alphabetical (A-Z)</option>
              <option value="category">By Category</option>
            </select>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs font-mono text-white/50">
          <span>SHOWING {filteredTools.length} OF 54 TOOLS</span>
          {selectedCategory !== 'All' && <span>FILTER: {selectedCategory.toUpperCase()}</span>}
        </div>
      </div>

      {/* 54 Tools Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <div
            key={tool.slug}
            onClick={() => onSelectTool(tool.slug)}
            className="group p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] hover:border-[#BE1E2F] hover:shadow-2xl hover:shadow-[#BE1E2F]/10 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4"
            id={`tool-card-${tool.slug}`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg bg-[#1a1a1a] text-white/60 border border-[#3a3a3a] text-[10px] font-mono uppercase">
                  {tool.category}
                </span>

                {tool.isPopular && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-mono flex items-center gap-1">
                    <Flame className="w-3 h-3 fill-amber-300" /> Hot
                  </span>
                )}
              </div>

              <h3 className="font-display text-lg font-bold text-white group-hover:text-[#BE1E2F] transition-colors">
                {tool.name}
              </h3>

              <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#3a3a3a]/60 flex items-center justify-between text-xs">
              <span className="text-[11px] font-mono text-white/40">
                {tool.inputs.length} Inputs • Edge AI
              </span>
              <span className="font-bold text-[#BE1E2F] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Launch Studio <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-3">
          <p className="text-sm font-bold text-white">No tools found matching "{searchQuery}"</p>
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('All');
            }}
            className="px-4 py-2 rounded-xl bg-[#BE1E2F] text-white text-xs font-bold"
          >
            Reset Search Filters
          </button>
        </div>
      )}

    </div>
  );
};
