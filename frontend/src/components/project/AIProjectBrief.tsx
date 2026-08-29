import React, { useState } from 'react';
import { Bot, Sparkles, AlertCircle, RefreshCw, X, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiService } from '../../services/aiService';

interface AIProjectBriefProps {
  projectId: number;
  projectCode: string;
  projectName: string;
}

export const AIProjectBrief: React.FC<AIProjectBriefProps> = ({
  projectId,
  projectCode,
  projectName
}) => {
  const [brief, setBrief] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.getProjectSummary(projectId);
      setBrief(response.executiveSummary);
      setIsOpen(true);
    } catch (err: any) {
      setError('Unable to synthesize AI Brief. Please try again or query Copilot directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card border border-slate-200 border-l-4 border-l-blue-600 p-5 shadow-command-card space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 shadow-2xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                AI Executive Intelligence & Risk Synthesis
              </h3>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                RAG + TreeSHAP
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Autonomous LLM analysis of monthly telemetry, delay risks, and procurement anomalies
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!isOpen && (
            <button
              onClick={fetchBrief}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-btn bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Bot className="w-3.5 h-3.5" />
                  <span>Generate AI Brief</span>
                </>
              )}
            </button>
          )}

          <Link
            to={`/copilot?projectId=${projectId}`}
            className="px-3 py-1.5 rounded-btn bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold flex items-center gap-1 transition-all"
          >
            <span>Ask Copilot</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-btn text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isOpen && brief && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase">
              Executive Synthesis • {projectCode}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Close Brief"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-btn border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line space-y-2">
            {brief}
          </div>
        </div>
      )}
    </div>
  );
};
