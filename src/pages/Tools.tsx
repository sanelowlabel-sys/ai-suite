import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocation, Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
import { TOOLS } from '../constants/tools';
import * as LucideIcons from 'lucide-react';
import SEO from '../components/SEO';

export default function Tools() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>(initialCategory);

  useEffect(() => {
    setCategory(queryParams.get('category') || 'All');
  }, [location.search]);

  const categories = ['All', 'Music', 'SEO', 'Content', 'Images', 'PDF', 'Campaign', 'Utilities'];
  
  const filteredTools = TOOLS.filter(t => 
    (category === 'All' || t.category === category) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || 
     t.description.toLowerCase().includes(search.toLowerCase()) ||
     t.category.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <SEO title="AI Tools Directory" description="Explore our 60+ specialized AI tools for creators." />
      
      {/* Header */}
      <div className="mb-8">
        <span className="text-xs font-black text-red-600 uppercase tracking-widest block mb-1">
          Catalog & Utilities
        </span>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Tools Directory
        </h1>
        <p className="text-slate-500 font-medium text-sm mt-1">
          Select any specialized model engine to automate production, analysis, and optimization.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch lg:items-center justify-between">
        <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto max-w-full">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                category === c 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text"
            placeholder="Search all 60+ tools..."
            className="w-full bg-white border border-slate-200 rounded-xl py-2 pl-10 pr-4 text-xs font-medium text-slate-800 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredTools.map((tool, i) => {
          const IconComponent = (LucideIcons as any)[tool.icon] || LucideIcons.Zap;
          
          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.2) }}
              whileHover={{ y: -3 }}
            >
              <Link 
                to={`/tools/${tool.id}`}
                className="studio-card p-5 h-full flex flex-col justify-between group block bg-white"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                        {tool.category}
                      </span>
                      {tool.isAdvanced && (
                        <span className="bg-red-100 text-red-700 text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                          PRO
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-red-600 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-slate-400 group-hover:text-red-600 transition-colors">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Execute Engine</span>
                  <div className="w-6 h-6 rounded-lg bg-slate-50 group-hover:bg-red-50 flex items-center justify-center">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="py-24 text-center bg-slate-50 rounded-2xl border border-slate-200 mt-6">
          <div className="text-slate-600 font-bold text-base">No tools found matching your criteria.</div>
          <p className="text-slate-400 text-xs mt-1">Try searching for keywords like "audio", "writer", or "meta".</p>
          <button 
            onClick={() => { setSearch(''); setCategory('All'); }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-700 transition-all"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
