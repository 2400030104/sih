import React from 'react';
import { Lightbulb, CheckCircle2, Check, XCircle } from 'lucide-react';
import { Recommendation } from '../../services/types';
import { formatDate } from '../../utils/formatDate';

interface RecommendationListProps {
  recommendations: Recommendation[];
  onStatusChange?: (id: number, status: string) => void;
}

export const RecommendationList: React.FC<RecommendationListProps> = ({
  recommendations,
  onStatusChange
}) => {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No prescriptive recommendations currently generated for this project.
      </div>
    );
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">URGENT</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-50 text-blue-700 border border-blue-200">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-100 text-slate-700 border border-slate-200">LOW</span>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-bold text-slate-900">Actionable Recommendations (Decision Support)</h3>
          </div>
          <p className="text-xs text-slate-500">Evidence-based policy and recovery measures generated from live project conditions</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-badge border border-amber-200">
          {recommendations.length} Action Items
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.recommendation_id}
            className="p-4 rounded-btn bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2.5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {getPriorityBadge(rec.priority)}
                <span className="text-[11px] font-mono font-bold text-blue-600 uppercase">
                  {rec.recommendation_type.replace(/_/g, ' ')}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{formatDate(rec.created_at)}</span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
              {rec.recommendation_text}
            </p>

            {rec.rationale && (
              <div className="p-3 bg-white rounded-btn border border-slate-200 text-xs text-slate-600 space-y-1">
                <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider">Policy &amp; Operational Basis</span>
                <p className="leading-relaxed">{rec.rationale}</p>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="text-slate-500 text-[11px] font-mono">
                Source: <strong className="text-slate-900">{rec.generated_by}</strong> • Status: <strong className="text-blue-600 uppercase">{rec.status}</strong>
              </span>

              {onStatusChange && (
                <div className="flex items-center gap-2">
                  {rec.status === 'PENDING' && (
                    <button
                      onClick={() => onStatusChange(rec.recommendation_id, 'ACCEPTED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept Intervention
                    </button>
                  )}

                  {rec.status === 'ACCEPTED' && (
                    <button
                      onClick={() => onStatusChange(rec.recommendation_id, 'IMPLEMENTED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                    </button>
                  )}

                  {rec.status === 'IMPLEMENTED' && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
