import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Flame,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  Bot,
  SlidersHorizontal,
  RefreshCw
} from 'lucide-react';
import { useRisk } from '../hooks/useRisk';
import { PageContainer } from '../components/layout/PageContainer';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const RiskAnalytics: React.FC = () => {
  const { highRiskProjects, criticalProjects, trendingRisks, riskDistribution, loading, error, refetch } = useRisk();
  const [activeTab, setActiveTab] = useState<'critical' | 'trending' | 'high'>('critical');

  if (loading) {
    return (
      <PageContainer>
        <Loading type="page" message="Synthesizing National Infrastructure Risk Portfolio & Forecasts..." />
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <ErrorMessage message={error} onRetry={refetch} />
      </PageContainer>
    );
  }

  const totalCount = riskDistribution.reduce((acc, curr) => acc + Number(curr.count || 0), 0);
  const criticalCount = riskDistribution.find((r) => r.riskLevel === 'CRITICAL')?.count || 0;
  const highCount = riskDistribution.find((r) => r.riskLevel === 'HIGH')?.count || 0;
  const mediumCount = riskDistribution.find((r) => r.riskLevel === 'MEDIUM')?.count || 0;
  const lowCount = riskDistribution.find((r) => r.riskLevel === 'LOW')?.count || 0;

  return (
    <PageContainer
      title="Portfolio Risk Intelligence & Predictions"
      subtitle="AI-driven early risk assessment, schedule variance probability, and multi-month risk acceleration tracking"
      actions={
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-btn text-xs font-bold text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Recalculate Telemetry</span>
        </button>
      }
    >
      {/* 1. Risk Tier Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card flex flex-col justify-between">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Evaluated</p>
          <h3 className="text-2xl font-black font-mono text-slate-900 mt-2">{totalCount}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Monitored Portfolio</p>
        </div>

        <div className="bg-white p-4 rounded-card border border-rose-200 shadow-command-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-rose-700 uppercase">
            <span className="text-[10px] tracking-wider">Critical Risk</span>
            <Flame className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <h3 className="text-2xl font-black font-mono text-rose-700 mt-2">{criticalCount}</h3>
          <p className="text-[11px] text-rose-600/80 font-medium mt-1">Immediate Intervention</p>
        </div>

        <div className="bg-white p-4 rounded-card border border-amber-200 shadow-command-card flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-amber-800 uppercase">
            <span className="text-[10px] tracking-wider">High Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-2xl font-black font-mono text-amber-800 mt-2">{highCount}</h3>
          <p className="text-[11px] text-amber-700/80 font-medium mt-1">Close Supervision</p>
        </div>

        <div className="bg-white p-4 rounded-card border border-blue-200 shadow-command-card flex flex-col justify-between">
          <p className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Medium Risk</p>
          <h3 className="text-2xl font-black font-mono text-blue-700 mt-2">{mediumCount}</h3>
          <p className="text-[11px] text-blue-600/80 font-medium mt-1">Standard Monitoring</p>
        </div>

        <div className="bg-white p-4 rounded-card border border-emerald-200 shadow-command-card flex flex-col justify-between col-span-2 sm:col-span-1">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Low Risk</p>
          <h3 className="text-2xl font-black font-mono text-emerald-700 mt-2">{lowCount}</h3>
          <p className="text-[11px] text-emerald-600/80 font-medium mt-1">On Track Baselines</p>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-2 text-xs font-bold overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('critical')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'critical'
              ? 'border-rose-600 text-rose-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Flame className="w-4 h-4" />
          <span>Critical Projects ({criticalProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trending')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'trending'
              ? 'border-blue-600 text-blue-700 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Accelerating Risk Velocity ({trendingRisks.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('high')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'high'
              ? 'border-amber-500 text-amber-800 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>High Risk Projects ({highRiskProjects.length})</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {activeTab === 'trending' ? (
        /* Accelerating Risk Trends Table */
        <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">Projects with Escalating Risk Acceleration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Identifies infrastructure projects where AI predictive risk has escalated drastically compared to prior observation
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Project</th>
                  <th className="px-4 py-3.5">Ministry & Sector</th>
                  <th className="px-4 py-3.5 text-center">Previous Risk</th>
                  <th className="px-4 py-3.5 text-center">Current Risk</th>
                  <th className="px-4 py-3.5 text-center">Risk Velocity</th>
                  <th className="px-4 py-3.5 text-center">Trajectory</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {trendingRisks.map((t) => {
                  const accel = Number(t.risk_acceleration || 0);
                  const isIncreasing = accel > 0;
                  const isStable = accel === 0;

                  return (
                    <tr key={t.project_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 max-w-xs">
                        <Link to={`/projects/${t.project_id}`} className="hover:text-blue-600 block">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800">
                              #{String(t.project_id).padStart(2, '0')}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-blue-600">
                              {t.project_code}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 truncate block text-xs">
                            {t.project_name}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-slate-900 font-semibold text-xs">{t.ministry_code}</div>
                        <div className="text-slate-500 text-[11px]">{t.sector_name}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-500">
                        {Number(t.prev_month_risk).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <RiskBadge level={t.risk_level} score={t.overall_risk} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-bold">
                        <span
                          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] border ${
                            isIncreasing
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : isStable
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {isIncreasing ? `+${accel.toFixed(1)}%` : `${accel.toFixed(1)}%`}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        {isIncreasing ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 font-mono">
                            <ArrowUpRight className="w-3.5 h-3.5 text-rose-600" /> Escalating
                          </span>
                        ) : isStable ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 font-mono">
                            <Minus className="w-3.5 h-3.5 text-slate-400" /> Stable
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 font-mono">
                            <ArrowDownRight className="w-3.5 h-3.5 text-emerald-600" /> Improving
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        <Link
                          to={`/copilot?projectId=${t.project_id}`}
                          className="p-1.5 rounded-btn bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center"
                          title="Analyze with Copilot"
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/projects/${t.project_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-btn text-xs font-bold transition-all shadow-xs"
                        >
                          360° <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Critical or High Risk Projects Table */
        <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-base font-bold text-slate-900">
              {activeTab === 'critical' ? 'Critical Risk Projects (Immediate Action Required)' : 'High Risk Infrastructure Projects'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by overall composite risk score with cost expansion and schedule delay predictions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Project</th>
                  <th className="px-4 py-3.5">Sector & State</th>
                  <th className="px-4 py-3.5 text-center">Composite Risk</th>
                  <th className="px-4 py-3.5 text-center">Cost Risk</th>
                  <th className="px-4 py-3.5 text-center">Schedule Risk</th>
                  <th className="px-4 py-3.5 text-center">Predicted Delay</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(activeTab === 'critical' ? criticalProjects : highRiskProjects).map((p) => {
                  const projectId = p.project_id || p.projectId;
                  const projectCode = p.project_code || p.projectCode;
                  const projectName = p.project_name || p.projectName;
                  const sector = p.sector_name || p.sectorName || '—';
                  const state = p.state_name || p.stateName || '—';
                  const overallRisk = p.overall_risk || p.overallRisk || 0;
                  const costRisk = p.cost_risk || p.costRisk || 0;
                  const timeRisk = p.time_risk || p.timeRisk || 0;
                  const delayMonths = p.predicted_delay_months || p.predictedDelayMonths || 0;
                  const status = p.current_status || p.currentStatus || 'ONGOING';
                  const riskLevel = p.risk_level || p.riskLevel;

                  return (
                    <tr key={projectId} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3.5 max-w-xs">
                        <Link to={`/projects/${projectId}`} className="hover:text-blue-600 block">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800">
                              #{String(projectId).padStart(2, '0')}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-blue-600">
                              {projectCode}
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 truncate block text-xs">
                            {projectName}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-slate-900 font-semibold text-xs">{sector}</div>
                        <div className="text-slate-500 text-[11px]">{state}</div>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <RiskBadge level={riskLevel} score={overallRisk} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-800">
                        {Number(costRisk).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-semibold text-slate-800">
                        {Number(timeRisk).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-rose-600">
                        {delayMonths > 0 ? `+${Number(delayMonths).toFixed(1)} mo` : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={status} size="sm" />
                      </td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        <Link
                          to={`/copilot?projectId=${projectId}`}
                          className="p-1.5 rounded-btn bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center"
                          title="Analyze with Copilot"
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/scenarios?projectId=${projectId}`}
                          className="p-1.5 rounded-btn bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center"
                          title="Run What-If Simulation"
                        >
                          <SlidersHorizontal className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/projects/${projectId}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-btn text-xs font-bold transition-all shadow-xs"
                        >
                          360° <ChevronRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
