import React, { useState } from 'react';
import { BellRing, Check, Clock, RefreshCw, Bot } from 'lucide-react';
import { useAlerts } from '../hooks/useAlerts';
import { PageContainer } from '../components/layout/PageContainer';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { EmptyState } from '../components/common/EmptyState';
import { formatDate } from '../utils/formatDate';
import { Link } from 'react-router-dom';

export const Alerts: React.FC = () => {
  const { alerts, loading, error, params, setFilter, handleAcknowledge, handleResolve, refetch } = useAlerts();
  const [selectedSeverity, setSelectedSeverity] = useState<string>('');

  const handleSeverityChange = (severity: string) => {
    setSelectedSeverity(severity);
    setFilter({ severity: severity || undefined });
  };

  if (loading && alerts.length === 0) {
    return (
      <PageContainer>
        <Loading type="page" message="Retrieving Active Early Warning Signals..." />
      </PageContainer>
    );
  }

  if (error && alerts.length === 0) {
    return (
      <PageContainer>
        <ErrorMessage message={error} onRetry={refetch} />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Early Warning & Alert Notifications"
      subtitle="Autonomous threshold alerts flagging schedule divergence, milestone slippages, and budget risk triggers"
      actions={
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-btn text-xs font-bold text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Refresh Alerts</span>
        </button>
      }
    >
      {/* 1. Severity Filter Tabs & Status Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-card border border-slate-200 shadow-command-card">
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold">
          <button
            onClick={() => handleSeverityChange('')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedSeverity === ''
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            All Alerts ({alerts.length})
          </button>
          <button
            onClick={() => handleSeverityChange('CRITICAL')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedSeverity === 'CRITICAL'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => handleSeverityChange('HIGH')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedSeverity === 'HIGH'
                ? 'bg-orange-600 text-white shadow-xs'
                : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
            }`}
          >
            High
          </button>
          <button
            onClick={() => handleSeverityChange('MEDIUM')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedSeverity === 'MEDIUM'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => handleSeverityChange('LOW')}
            className={`px-3 py-1.5 rounded-btn transition-all cursor-pointer ${
              selectedSeverity === 'LOW'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            Low
          </button>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-bold text-[11px]">Filter Status:</span>
          <select
            value={params.status || ''}
            onChange={(e) => setFilter({ status: e.target.value || undefined })}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-btn text-slate-800 text-xs font-semibold focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New (Unacknowledged)</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* 2. Alerts List */}
      {alerts.length === 0 ? (
        <EmptyState
          title="No Alerts Flagged"
          description="There are currently no active warning alerts matching the selected filter criteria."
          icon={<BellRing className="w-6 h-6 text-slate-400" />}
        />
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.alert_id}
              className={`p-5 rounded-card border shadow-command-card transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'bg-rose-50/60 border-rose-200'
                  : alert.severity === 'HIGH'
                  ? 'bg-orange-50/60 border-orange-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      alert.severity === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : alert.severity === 'HIGH'
                        ? 'bg-orange-100 text-orange-700 border-orange-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {alert.severity}
                  </span>

                  {alert.project_id && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                      #{String(alert.project_id).padStart(2, '0')}
                    </span>
                  )}

                  {alert.project_code && (
                    <Link
                      to={`/projects/${alert.project_id}`}
                      className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:underline"
                    >
                      {alert.project_code}
                    </Link>
                  )}

                  <span className="text-[11px] font-mono text-slate-500 uppercase">
                    {alert.alert_type?.replace(/_/g, ' ')}
                  </span>
                </div>

                <span className="text-[11px] font-mono text-slate-500">
                  {formatDate(alert.generated_at, 'full')}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1">{alert.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{alert.message}</p>

              {alert.trigger_value && (
                <div className="p-2.5 bg-slate-50 rounded-btn border border-slate-200 text-xs text-slate-700 mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                  <span>Trigger Observed: <strong className="text-rose-700">{alert.trigger_value}</strong></span>
                  {alert.threshold_value && (
                    <span>Baseline Threshold: <strong className="text-slate-900">{alert.threshold_value}</strong></span>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <span className="font-mono text-slate-500 text-[11px]">
                  Status: <strong className="text-blue-600 uppercase">{alert.status}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {alert.project_id && (
                    <Link
                      to={`/copilot?projectId=${alert.project_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold rounded-btn text-xs transition-colors shadow-2xs"
                    >
                      <Bot className="w-3.5 h-3.5" /> Explain Alert
                    </Link>
                  )}
                  {alert.status === 'NEW' && (
                    <button
                      onClick={() => handleAcknowledge(alert.alert_id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-800 font-bold rounded-btn text-xs transition-colors cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5 text-blue-600" /> Acknowledge
                    </button>
                  )}
                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(alert.alert_id)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve Warning
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
