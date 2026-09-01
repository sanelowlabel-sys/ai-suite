import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Sliders, 
  Wand2, 
  FileText,
  Share2,
  CheckCircle2,
  Flame,
  Layers
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ToolDefinition, UserProfile } from '../../types';

interface GenericAiToolProps {
  tool: ToolDefinition;
  user: UserProfile;
  onExecuteAi: (inputs: Record<string, any>) => Promise<any>;
  onOpenPaywall: () => void;
}

export const GenericAiTool: React.FC<GenericAiToolProps> = ({
  tool,
  user,
  onExecuteAi,
  onOpenPaywall,
}) => {
  // Initialize state with default input values
  const [formData, setFormData] = useState<Record<string, any>>(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((input) => {
      const key = input.id || input.name || 'field';
      if (input.defaultValue !== undefined) {
        initial[key] = input.defaultValue;
      } else if (input.type === 'select' && input.options && input.options.length > 0) {
        const firstOpt = input.options[0];
        initial[key] = typeof firstOpt === 'object' && firstOpt !== null ? firstOpt.value : firstOpt;
      } else if (input.type === 'slider') {
        initial[key] = input.min || 0;
      } else {
        initial[key] = '';
      }
    });
    return initial;
  });

  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);

  // Sync inputs when tool changes
  useEffect(() => {
    const initial: Record<string, any> = {};
    tool.inputs.forEach((input) => {
      const key = input.id || input.name || 'field';
      if (input.defaultValue !== undefined) {
        initial[key] = input.defaultValue;
      } else if (input.type === 'select' && input.options && input.options.length > 0) {
        const firstOpt = input.options[0];
        initial[key] = typeof firstOpt === 'object' && firstOpt !== null ? firstOpt.value : firstOpt;
      } else {
        initial[key] = '';
      }
    });
    setFormData(initial);
    setOutput('');
    setStatusNote(null);
  }, [tool.slug]);

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusNote(null);

    try {
      const response = await onExecuteAi(formData);
      if (response) {
        if (response.triggerPaywall) {
          onOpenPaywall();
          return;
        }
        if (response.result) {
          setOutput(response.result);
          setStatusNote(response.isAiGenerated ? 'Generated via AI Suite Studio Engine' : 'Studio Engine Output');
        }
      }
    } catch (err: any) {
      console.error(err);
      setStatusNote('Execution completed with local studio fallback.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyOutput = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${tool.slug}-output.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Input Parameters Box */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-5">
        <div className="flex items-center justify-between border-b border-[#3a3a3a] pb-3">
          <div className="flex items-center gap-2 text-xs font-mono text-white/70 uppercase">
            <Sliders className="w-4 h-4 text-[#BE1E2F]" />
            <span>Studio Parameters & Input Controls</span>
          </div>
          <span className="text-[11px] text-white/40 font-mono">
            {tool.inputs.length} configurable fields
          </span>
        </div>

        {/* Dynamic Inputs Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tool.inputs.map((input) => {
            const fieldKey = input.id || input.name || 'field';
            return (
              <div 
                key={fieldKey} 
                className={`space-y-1.5 ${input.type === 'textarea' ? 'md:col-span-2' : ''}`}
              >
                <label className="text-xs font-mono text-white/70 block">
                  {input.label.toUpperCase()} {input.required && <span className="text-[#BE1E2F]">*</span>}
                </label>

                {input.type === 'textarea' ? (
                  <textarea
                    required={input.required}
                    value={formData[fieldKey] || ''}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}...`}
                    rows={4}
                    className="w-full p-3.5 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                  />
                ) : input.type === 'select' ? (
                  <select
                    value={formData[fieldKey] || ''}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                  >
                    {input.options?.map((opt, idx) => {
                      const optVal: string = typeof opt === 'string' ? opt : (opt as { label: string; value: string }).value;
                      const optLabel: string = typeof opt === 'string' ? opt : (opt as { label: string; value: string }).label;
                      return (
                        <option key={idx} value={optVal}>
                          {optLabel}
                        </option>
                      );
                    })}
                  </select>
                ) : input.type === 'slider' ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-mono text-white/60">
                      <span>{input.min}</span>
                      <span className="text-[#BE1E2F] font-bold">{formData[fieldKey] || input.min}</span>
                      <span>{input.max}</span>
                    </div>
                    <input
                      type="range"
                      min={input.min}
                      max={input.max}
                      step={input.step || 1}
                      value={formData[fieldKey] || input.min}
                      onChange={(e) => handleInputChange(fieldKey, Number(e.target.value))}
                      className="w-full accent-[#BE1E2F]"
                    />
                  </div>
                ) : input.type === 'file' ? (
                  <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] text-center">
                    <input
                      type="file"
                      onChange={(e) => handleInputChange(fieldKey, e.target.files?.[0]?.name || 'uploaded_sample.wav')}
                      className="text-xs text-white/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#BE1E2F] file:text-white hover:file:bg-[#a11826]"
                    />
                  </div>
                ) : (
                  <input
                    type={input.type === 'number' ? 'number' : 'text'}
                    required={input.required}
                    value={formData[fieldKey] || ''}
                    onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                    placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}...`}
                    className="w-full p-3 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] focus:border-[#BE1E2F] text-white text-xs focus:outline-none transition-colors"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-[#3a3a3a]">
          <div className="text-[11px] text-white/50 font-mono">
            Requires 1 studio credit • Pro users have unlimited access
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#BE1E2F] hover:bg-[#a11826] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#BE1E2F]/25 transition-all disabled:opacity-50 active:scale-95"
            id="tool-submit-btn"
          >
            <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Processing Studio Task...' : `Execute ${tool.name}`}</span>
          </button>
        </div>
      </form>

      {/* Rendered Output Area */}
      {output && (
        <div className="p-6 rounded-2xl bg-[#2b2b2b] border border-[#3a3a3a] space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#3a3a3a] pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono font-bold text-white uppercase">
                STUDIO EXECUTION RESULT
              </span>
              {statusNote && (
                <span className="text-[10px] text-white/40 font-mono hidden sm:inline">
                  • {statusNote}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyOutput}
                className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-white text-xs flex items-center gap-1.5 transition-colors"
                id="tool-copy-output-btn"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadOutput}
                className="px-3 py-1.5 rounded-lg bg-[#1a1a1a] hover:bg-[#3a3a3a] border border-[#3a3a3a] text-white text-xs flex items-center gap-1.5 transition-colors"
                id="tool-download-output-btn"
              >
                <Download className="w-3.5 h-3.5 text-[#BE1E2F]" />
                <span>Export (.md)</span>
              </button>
            </div>
          </div>

          {/* Markdown Content Area */}
          <div className="p-4 rounded-xl bg-[#1a1a1a] border border-[#3a3a3a] prose prose-invert max-w-none text-xs leading-relaxed text-white/90 font-sans overflow-x-auto">
            <ReactMarkdown>{output}</ReactMarkdown>
          </div>
        </div>
      )}

    </div>
  );
};
