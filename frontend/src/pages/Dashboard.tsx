import React from 'react';
import {
  Building2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Sparkles,
  SlidersHorizontal,
  Bot,
  ArrowRight,
  TrendingUp,
  Coins,
  Activity,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDashboard } from '../hooks/useDashboard';
import { PageContainer } from '../components/layout/PageContainer';
import { RiskDistribution } from '../components/dashboard/RiskDistribution';
import { SectorChart } from '../components/dashboard/SectorChart';
import { MinistryChart } from '../components/dashboard/MinistryChart';
import { ProjectRiskTable } from '../components/dashboard/ProjectRiskTable';
import { IndiaRiskMap } from '../components/dashboard/IndiaRiskMap';
import { LiveActivityFeed } from '../components/dashboard/LiveActivityFeed';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatCurrency, formatPercentage } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import './dashboard.css';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    summary,
    sectors,
    ministries,
    riskDist,
    highRiskProjects,
    recentAlerts,
    loading,
    error,
    refetch,
  } = useDashboard();

  if (loading) {
    return (
      <PageContainer>
        <Loading type="page" message="Synthesizing National Infrastructure Telemetry..." />
      </PageContainer>
    );
  }

  if (error || !summary) {
    return (
      <PageContainer>
        <ErrorMessage
          message={error || 'Unable to connect to PRAGATI-AI command desk.'}
          onRetry={() => refetch(false)}
        />
      </PageContainer>
    );
  }

  const revisedDelta = summary.totalRevisedCost - summary.totalApprovedCost;
  const hasCostOverrun = revisedDelta > 0;
  const delayedPct = ((summary.delayedProjects / (summary.totalProjects || 1)) * 100).toFixed(0);

  return (
    <PageContainer
      title="National Infrastructure Command Center"
      subtitle="MoSPI / IPMD ₹150+ Cr Central Sector Projects • Predictive Risk Analytics, Autonomous Early Warning & Decision Support"
      actions={
        <div className="flex items-center gap-2">
          <Link
            to="/interventions"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 text-xs font-bold transition-all shadow-xs"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Priority Queue ({summary.criticalRiskProjects})</span>
          </Link>
          <Link
            to="/copilot"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-btn bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ask Copilot</span>
          </Link>
        </div>
      }
    >
      <div className="liquid-dashboard-stack">

        {/* 1. Fluid Panoramic Financial & Progress Ribbon */}
        <section className="liquid-hero-ribbon">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900">National Portfolio Pulse</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  REAL-TIME ML
                </span>
              </div>
              <p className="text-xs text-slate-500">Live monitoring across {summary.totalProjects} central infrastructure assets</p>
            </div>
          </div>

          <div className="liquid-hero-ribbon__stats">
            <div className="liquid-hero-ribbon__stat-item">
              <span className="liquid-hero-ribbon__stat-label">Sanctioned Outlay</span>
              <span className="liquid-hero-ribbon__stat-value">{formatCurrency(summary.totalApprovedCost, { compact: true })}</span>
            </div>

            <div className="liquid-hero-ribbon__stat-item">
              <span className="liquid-hero-ribbon__stat-label">Cumulative Spend</span>
              <span className="liquid-hero-ribbon__stat-value text-emerald-700">{formatCurrency(summary.totalExpenditure, { compact: true })}</span>
            </div>

            <div className="liquid-hero-ribbon__stat-item">
              <span className="liquid-hero-ribbon__stat-label">Avg Physical Progress</span>
              <span className="liquid-hero-ribbon__stat-value text-blue-600">{formatPercentage(summary.averagePhysicalProgress)}</span>
            </div>

            <div className="liquid-hero-ribbon__stat-item">
              <span className="liquid-hero-ribbon__stat-label">Cost Expansion Drift</span>
              <span className={`liquid-hero-ribbon__stat-value ${hasCostOverrun ? 'text-rose-600' : 'text-slate-700'}`}>
                {hasCostOverrun ? `+${formatCurrency(revisedDelta, { compact: true })}` : 'On Baseline'}
              </span>
            </div>
          </div>
        </section>

        {/* 2. Liquid KPI Quad Core (4 Flowing Cards) */}
        <section className="liquid-kpi-grid">
          {/* Card 1: Total Monitored Projects */}
          <div
            onClick={() => navigate('/projects')}
            className="liquid-kpi-card liquid-kpi-card--blue group"
          >
            <div className="liquid-kpi-card__header">
              <div className="liquid-kpi-card__icon-bubble liquid-kpi-card__icon-bubble--blue">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="liquid-kpi-card__tag liquid-kpi-card__tag--blue">
                100% Monitored
              </span>
            </div>
            <div className="liquid-kpi-card__body">
              <span className="liquid-kpi-card__title">Total Portfolio</span>
              <h3 className="liquid-kpi-card__value">{summary.totalProjects}</h3>
              <p className="liquid-kpi-card__subtitle">
                {summary.ongoingProjects} ongoing • {summary.completedProjects} completed
              </p>
            </div>
          </div>

          {/* Card 2: Schedule Delayed Projects */}
          <div
            onClick={() => navigate('/projects?status=delayed')}
            className="liquid-kpi-card liquid-kpi-card--amber group"
          >
            <div className="liquid-kpi-card__header">
              <div className="liquid-kpi-card__icon-bubble liquid-kpi-card__icon-bubble--amber">
                <Clock className="w-5 h-5" />
              </div>
              <span className="liquid-kpi-card__tag liquid-kpi-card__tag--amber">
                {delayedPct}% Lagging
              </span>
            </div>
            <div className="liquid-kpi-card__body">
              <span className="liquid-kpi-card__title">Delayed Schedule</span>
              <h3 className="liquid-kpi-card__value text-amber-800">{summary.delayedProjects}</h3>
              <p className="liquid-kpi-card__subtitle">
                Lagging initial contractual timelines
              </p>
            </div>
          </div>

          {/* Card 3: Critical Risk Projects */}
          <div
            onClick={() => navigate('/projects?risk=critical')}
            className="liquid-kpi-card liquid-kpi-card--rose group"
          >
            <div className="liquid-kpi-card__header">
              <div className="liquid-kpi-card__icon-bubble liquid-kpi-card__icon-bubble--rose">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="liquid-kpi-card__tag liquid-kpi-card__tag--rose">
                Immediate Action
              </span>
            </div>
            <div className="liquid-kpi-card__body">
              <span className="liquid-kpi-card__title">Critical Risk Assets</span>
              <h3 className="liquid-kpi-card__value text-rose-700">{summary.criticalRiskProjects}</h3>
              <p className="liquid-kpi-card__subtitle">
                {summary.highRiskProjects} additional high-risk projects
              </p>
            </div>
          </div>

          {/* Card 4: Active Warning Alerts */}
          <div
            onClick={() => navigate('/alerts')}
            className="liquid-kpi-card liquid-kpi-card--emerald group"
          >
            <div className="liquid-kpi-card__header">
              <div className="liquid-kpi-card__icon-bubble liquid-kpi-card__icon-bubble--emerald">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="liquid-kpi-card__tag liquid-kpi-card__tag--emerald">
                {summary.criticalAlerts} Critical
              </span>
            </div>
            <div className="liquid-kpi-card__body">
              <span className="liquid-kpi-card__title">Active Early Warnings</span>
              <h3 className="liquid-kpi-card__value text-slate-900">{summary.totalActiveAlerts}</h3>
              <p className="liquid-kpi-card__subtitle">
                Autonomous divergence signals active
              </p>
            </div>
          </div>
        </section>

        {/* 3. Fluid Asymmetric Central Workspace (8 cols Main + 4 cols Side) */}
        <section className="liquid-workspace-grid">
          {/* Main Area: India Geospatial Radar + High Risk Action Matrix (8 cols) */}
          <div className="liquid-workspace-grid__main">
            {/* National Geospatial Map */}
            <IndiaRiskMap projects={highRiskProjects} />

            {/* High-Risk Projects Matrix Table */}
            <ProjectRiskTable projects={highRiskProjects} />
          </div>

          {/* Side Area: Live Telemetry Stream + Early Warnings (4 cols) */}
          <div className="liquid-workspace-grid__side">
            {/* Real-time Live Activity Feed */}
            <LiveActivityFeed />

            {/* Recent Warning Signals Panel */}
            <div className="liquid-side-panel">
              <div className="liquid-side-panel__header">
                <div className="liquid-side-panel__title">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Recent Early Warnings</span>
                </div>
                <Link to="/alerts" className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="liquid-side-panel__list">
                {recentAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.alert_id}
                    className={`liquid-alert-pill-card ${
                      alert.severity === 'CRITICAL'
                        ? 'liquid-alert-pill-card--critical'
                        : alert.severity === 'HIGH'
                        ? 'liquid-alert-pill-card--high'
                        : 'liquid-alert-pill-card--medium'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={`font-bold px-1.5 py-0.2 rounded border ${
                        alert.severity === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        alert.severity === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {alert.severity}
                      </span>
                      <span className="text-slate-400">{formatDate(alert.generated_at)}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-1">{alert.title}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{alert.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Fluid Portfolio Analytics Matrix (3 Equal Cards) */}
        <section className="liquid-analytics-grid">
          <RiskDistribution data={riskDist} totalProjects={summary.totalProjects} />
          <SectorChart data={sectors} />
          <MinistryChart data={ministries} />
        </section>

        {/* 5. Fluid AI Decision Support Nexus (2 Flowing Hero Modules) */}
        <section className="liquid-modules-grid">
          {/* AI Copilot Module */}
          <div className="liquid-module-card liquid-module-card--copilot">
            <div className="liquid-module-card__header">
              <div className="flex items-center gap-3.5">
                <div className="liquid-module-card__icon-wrapper liquid-module-card__icon-wrapper--blue">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">PRAGATI-AI Intelligence Copilot</h3>
                  <p className="text-xs text-slate-500">Natural-Language Grounded Decision Support &amp; RAG</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                ONLINE
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Query root cause delay drivers, synthesize ministry-level progress reports, and explore MoSPI monitoring guidelines with grounded evidence citations.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Grounded RAG • MoSPI Guidelines</span>
              <Link to="/copilot" className="liquid-module-card__cta-btn liquid-module-card__cta-btn--primary">
                <Sparkles className="w-4 h-4" />
                <span>Launch Copilot</span>
              </Link>
            </div>
          </div>

          {/* What-If Scenario Simulator Module */}
          <div className="liquid-module-card liquid-module-card--simulator">
            <div className="liquid-module-card__header">
              <div className="flex items-center gap-3.5">
                <div className="liquid-module-card__icon-wrapper liquid-module-card__icon-wrapper--sky">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">What-If Policy Scenario Simulator</h3>
                  <p className="text-xs text-slate-500">Predictive ML Sandbox for Schedule &amp; Cost Recovery</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE ML
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate the risk and timeline recovery outcomes of civil acceleration, milestone recovery, and expenditure optimization in a non-destructive sandbox.
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400 font-medium">Non-Destructive In-Memory Sandbox</span>
              <Link to="/scenarios" className="liquid-module-card__cta-btn liquid-module-card__cta-btn--secondary">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Open Simulator</span>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </PageContainer>
  );
};

export default Dashboard;