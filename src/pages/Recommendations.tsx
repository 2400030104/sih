import React, { useState, useEffect, useCallback } from 'react';
import { Lightbulb, CheckCircle2, Check, RefreshCw, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getRecommendations, updateRecommendationStatus } from '../services/api';
import { Recommendation } from '../services/types';
import { PageContainer } from '../components/layout/PageContainer';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';

export const Recommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRecommendations({
        priority: selectedPriority || undefined,
        status: selectedStatus || undefined
      });
      setRecommendations(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  }, [selectedPriority, selectedStatus]);

  useEffect(() => {
    fetchRecs();
  }, [fetchRecs]);

  const handleStatusChange = async (recId: number, status: string) => {
    try {
      await updateRecommendationStatus(recId, status);
      await fetchRecs();
    } catch (err: any) {
      alert(err.message || 'Failed to update recommendation status');
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">URGENT</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">HIGH PRIORITY</span>;
      case 'MEDIUM':
        return <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">MEDIUM</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-0.5 rounded font-mono text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">LOW</span>;
    }
  };

  if (loading && recommendations.length === 0) {
    return (
      <PageContainer>
        <Loading type="page" message="Synthesizing Prescriptive Action Recommendations & Interventions..." />
      </PageContainer>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <PageContainer>
        <ErrorMessage message={error} onRetry={fetchRecs} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Action Recommendations & Policy Interventions"
      subtitle="Evidence-based corrective measures, inter-ministerial coordination advisories, and risk-mitigation strategies"
      actions={
        <button
          onClick={() => fetchRecs()}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-btn text-xs font-bold text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Refresh Actions</span>
        </button>
      }
    >
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-card border border-slate-200 shadow-command-card">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => setSelectedPriority('')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedPriority === '' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            All Priorities ({recommendations.length})
          </button>
          <button
            onClick={() => setSelectedPriority('URGENT')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedPriority === 'URGENT' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Urgent
          </button>
          <button
            onClick={() => setSelectedPriority('HIGH')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedPriority === 'HIGH' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            High
          </button>
          <button
            onClick={() => setSelectedPriority('MEDIUM')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedPriority === 'MEDIUM' ? 'bg-blue-600 text-white shadow-xs' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            Medium
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold text-[11px]">Lifecycle Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-btn text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending Review</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="IMPLEMENTED">Implemented</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Recommendations Cards */}
      {recommendations.length === 0 ? (
        <EmptyState
          title="No Recommendations Found"
          description="There are currently no prescriptive intervention action items matching the filter."
          icon={<Lightbulb className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.recommendation_id}
              className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card hover:border-slate-300 transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  {getPriorityBadge(rec.priority)}
                  {rec.project_id && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                      #{String(rec.project_id).padStart(2, '0')}
                    </span>
                  )}
                  {rec.project_code && (
                    <Link
                      to={`/projects/${rec.project_id}`}
                      className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 hover:underline"
                    >
                      {rec.project_code}
                    </Link>
                  )}
                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {rec.recommendation_type.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500">{formatDate(rec.created_at)}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {rec.recommendation_text}
              </h3>

              {rec.rationale && (
                <div className="p-3.5 bg-slate-50 rounded-btn border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block">
                    Strategic Rationale & Policy Evidence
                  </span>
                  <p className="leading-relaxed">{rec.rationale}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-500 text-[11px] font-mono">
                  Engine: <strong className="text-slate-900">{rec.generated_by}</strong> • Status: <strong className="text-blue-600 uppercase">{rec.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {rec.project_id && (
                    <Link
                      to={`/copilot?projectId=${rec.project_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-btn text-xs transition-colors shadow-2xs"
                    >
                      <Bot className="w-3.5 h-3.5" /> Explain Rationale
                    </Link>
                  )}
                  {rec.status === 'PENDING' && (
                    <button
                      onClick={() => handleStatusChange(rec.recommendation_id, 'ACCEPTED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Accept Intervention
                    </button>
                  )}
                  {rec.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleStatusChange(rec.recommendation_id, 'IMPLEMENTED')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mark Implemented
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PageContainer>
  );
};
