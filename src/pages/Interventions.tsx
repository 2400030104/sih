import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertOctagon,
  ShieldAlert,
  TrendingUp,
  Coins,
  Search,
  Bot,
  SlidersHorizontal,
  RefreshCw,
  AlertTriangle,
  Info,
  ChevronRight
} from 'lucide-react';
import { aiService, InterventionItem } from '../services/aiService';
import { PageContainer } from '../components/layout/PageContainer';
import { useToast } from '../components/common/Toast';

export const Interventions: React.FC = () => {
  const { showToast } = useToast();

  const [queue, setQueue] = useState<InterventionItem[]>([]);
  const [filteredQueue, setFilteredQueue] = useState<InterventionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');

  const fetchInterventions = async () => {
    setLoading(true);
    try {
      const data = await aiService.getInterventionQueue();
      setQueue(data.queue);
      setFilteredQueue(data.queue);
    } catch (err: any) {
      showToast({
        type: 'warning',
        title: 'Intervention Queue Error',
        message: err.message || 'Failed to load intervention queue'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterventions();
  }, []);

  useEffect(() => {
    let result = [...queue];

    if (selectedPriority !== 'ALL') {
      result = result.filter((item) => item.priority === selectedPriority);
    }

    if (selectedSector !== 'ALL') {
      result = result.filter((item) => item.sector === selectedSector);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.projectCode.toLowerCase().includes(q) ||
          item.projectName.toLowerCase().includes(q) ||
          item.primaryConcern.toLowerCase().includes(q)
      );
    }

    setFilteredQueue(result);
  }, [searchQuery, selectedPriority, selectedSector, queue]);

  const p1Count = queue.filter((i) => i.priority === 'P1').length;
  const p2Count = queue.filter((i) => i.priority === 'P2').length;
  const totalFinancialExposure = queue.reduce((acc, i) => acc + (i.financialExposure || 0), 0);

  const sectors = Array.from(new Set(queue.map((i) => i.sector)));

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'P1':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> P1 Immediate
          </span>
        );
      case 'P2':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-50 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" /> P2 High
          </span>
        );
      case 'P3':
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-medium rounded bg-blue-50 text-blue-700 border border-blue-200">
            P3 Monitor
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 text-[10px] font-mono font-medium rounded bg-slate-100 text-slate-700 border border-slate-200">
            P4 Routine
          </span>
        );
    }
  };

  const getRiskTrendBadge = (trend: string) => {
    switch (trend) {
      case 'ACCELERATING':
        return (
          <span className="text-[11px] font-bold font-mono text-rose-700 flex items-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> Accelerating
          </span>
        );
      case 'STABLE':
        return <span className="text-[11px] font-mono text-slate-500">Stable</span>;
      default:
        return <span className="text-[11px] font-mono text-emerald-700">Decelerating</span>;
    }
  };

  return (
    <PageContainer
      title="Intervention Priority Command Queue"
      subtitle="Multi-Factor Decision Ranking: Risk Severity, Acceleration Velocity, Financial Exposure, and Milestone Slippage"
      actions={
        <button
          onClick={fetchInterventions}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-btn text-xs font-bold text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      }
    >
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-command-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Projects
            </span>
            <AlertOctagon className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">{queue.length}</div>
          <p className="text-[11px] text-slate-500">Central Sector Monitored</p>
        </div>

        <div className="bg-white border border-rose-200 rounded-card p-5 shadow-command-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">
              P1 Immediate
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black font-mono text-rose-700 mt-1">{p1Count}</div>
          <p className="text-[11px] text-rose-600/80 font-medium">Immediate Task Force Review</p>
        </div>

        <div className="bg-white border border-amber-200 rounded-card p-5 shadow-command-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
              P2 High Priority
            </span>
            <ShieldAlert className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black font-mono text-amber-800 mt-1">{p2Count}</div>
          <p className="text-[11px] text-amber-700/80 font-medium">Recovery Plans Needed</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-card p-5 shadow-command-card space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Financial Exposure
            </span>
            <Coins className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 mt-1">
            ₹{totalFinancialExposure.toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr
          </div>
          <p className="text-[11px] text-slate-500">Projected Cumulative Expansion</p>
        </div>
      </div>

      {/* Priority Legend Bar */}
      <div className="bg-slate-50 border border-slate-200 text-slate-700 rounded-btn p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span className="font-bold text-slate-900 text-[11px]">Intervention Priority Rubric:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-600"></span>
            <strong className="text-rose-700">P1 (≥68 pts):</strong> Immediate Task Force
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <strong className="text-amber-800">P2 (45-67 pts):</strong> High Priority
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <strong className="text-blue-700">P3 (25-44 pts):</strong> Monitor Closely
          </span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <strong className="text-slate-600">P4 (&lt;25 pts):</strong> Routine Monitoring
          </span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white border border-slate-200 rounded-card p-3 shadow-command-card">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            className="w-full bg-slate-50 border border-slate-200 rounded-btn pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder="Search by code, name, or concern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            className="bg-white border border-slate-200 rounded-btn px-3 py-2 text-xs text-slate-800 font-semibold outline-none cursor-pointer focus:border-blue-500"
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="P1">P1 — Immediate Intervention</option>
            <option value="P2">P2 — High Priority</option>
            <option value="P3">P3 — Monitor Closely</option>
            <option value="P4">P4 — Routine Monitoring</option>
          </select>

          <select
            className="bg-white border border-slate-200 rounded-btn px-3 py-2 text-xs text-slate-800 font-semibold outline-none cursor-pointer focus:border-blue-500"
            value={selectedSector}
            onChange={(e) => setSelectedSector(e.target.value)}
          >
            <option value="ALL">All Sectors</option>
            {sectors.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-slate-200 rounded-card overflow-hidden shadow-command-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">Rank</th>
                <th className="py-3.5 px-4">Project</th>
                <th className="py-3.5 px-4">Priority Tier</th>
                <th className="py-3.5 px-4">Priority Score</th>
                <th className="py-3.5 px-4">Risk & Trend</th>
                <th className="py-3.5 px-4">Exposure</th>
                <th className="py-3.5 px-4">Primary Concern</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    Calculating multi-factor intervention priority rankings...
                  </td>
                </tr>
              ) : filteredQueue.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-medium">
                    No projects found matching the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredQueue.map((item) => (
                  <tr
                    key={item.projectId}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4 text-center font-black font-mono text-slate-900">
                      #{item.rank}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-slate-100 border border-slate-200 text-slate-800">
                          #{String(item.projectId).padStart(2, '0')}
                        </span>
                        <Link
                          to={`/projects/${item.projectId}`}
                          className="font-mono font-bold text-blue-600 hover:underline block text-[11px]"
                        >
                          {item.projectCode}
                        </Link>
                      </div>
                      <div className="text-slate-900 font-bold max-w-[220px] truncate" title={item.projectName}>
                        {item.projectName}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {item.sector} • {item.ministry}
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      {getPriorityBadge(item.priority)}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full ${
                              item.priorityScore >= 68
                                ? 'bg-rose-600'
                                : item.priorityScore >= 45
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${item.priorityScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          {item.priorityScore}
                        </span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-bold font-mono text-slate-900">
                        {item.overallRisk}/100 ({item.riskLevel})
                      </div>
                      <div>{getRiskTrendBadge(item.riskTrend)}</div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-900">
                        ₹{item.financialExposure > 0 ? `+${item.financialExposure} Cr` : '₹0 Cr'}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Delay: +{item.scheduleExposureMonths} mo
                      </div>
                    </td>

                    <td className="py-4 px-4 max-w-[260px]">
                      <div className="text-slate-700 font-medium line-clamp-2">
                        {item.primaryConcern}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-1.5">
                      <Link
                        to={`/copilot?projectId=${item.projectId}`}
                        className="px-2.5 py-1.5 rounded-btn bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold text-[11px] inline-flex items-center gap-1 border border-blue-200"
                        title="Explain with Copilot"
                      >
                        <Bot className="w-3 h-3" /> Copilot
                      </Link>
                      <Link
                        to={`/scenarios?projectId=${item.projectId}`}
                        className="px-2.5 py-1.5 rounded-btn bg-slate-100 text-slate-800 hover:bg-slate-200 transition-colors font-bold text-[11px] inline-flex items-center gap-1 border border-slate-200"
                        title="Run What-If Simulator"
                      >
                        <SlidersHorizontal className="w-3 h-3 text-blue-600" /> What-If
                      </Link>
                      <Link
                        to={`/projects/${item.projectId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-btn text-[11px] font-bold transition-all shadow-xs"
                      >
                        360° <ChevronRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PageContainer>
  );
};

export default Interventions;
