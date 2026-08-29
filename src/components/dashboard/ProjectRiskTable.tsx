import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldAlert, Bot, SlidersHorizontal } from 'lucide-react';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';

interface ProjectRiskTableProps {
  projects: any[];
  title?: string;
  subtitle?: string;
}

export const ProjectRiskTable: React.FC<ProjectRiskTableProps> = ({
  projects,
  title = 'Top High & Critical Risk Projects',
  subtitle = 'Projects with severe schedule variance, cost overrun probability, or implementation bottlenecks'
}) => {
  return (
    <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
        </div>
        <Link
          to="/risk-analytics"
          className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
        >
          View All Risks <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-3 text-center w-12">#</th>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Sector & State</th>
              <th className="px-4 py-3 text-center">Overall Risk</th>
              <th className="px-4 py-3 text-center">Cost Risk</th>
              <th className="px-4 py-3 text-center">Time Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.slice(0, 6).map((p) => {
              const projectId = p.project_id || p.projectId;
              const projectCode = p.project_code || p.projectCode;
              const projectName = p.project_name || p.projectName;
              const sector = p.sector_name || p.sectorName || '—';
              const state = p.state_name || p.stateName || '—';
              const overallRisk = p.overall_risk || p.overallRisk || 0;
              const costRisk = p.cost_risk || p.costRisk || 0;
              const timeRisk = p.time_risk || p.timeRisk || 0;
              const status = p.current_status || p.currentStatus || 'ONGOING';
              const riskLevel = p.risk_level || p.riskLevel;
              const projNum = String(projectId).padStart(2, '0');

              return (
                <tr key={projectId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-3 py-3.5 text-center font-mono font-bold text-xs">
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 group-hover:border-blue-300 transition-colors">
                      #{projNum}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 max-w-xs">
                    <Link
                      to={`/projects/${projectId}`}
                      className="font-bold text-slate-900 hover:text-blue-600 truncate block"
                      title={projectName}
                    >
                      {projectName}
                    </Link>
                    <div className="text-[11px] font-mono text-blue-600">{projectCode}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="text-slate-900 text-xs font-semibold">{sector}</div>
                    <div className="text-slate-500 text-[11px]">{state}</div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <RiskBadge level={riskLevel} score={overallRisk} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-slate-800">
                    {Number(costRisk).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold text-slate-800">
                    {Number(timeRisk).toFixed(0)}%
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={status} size="sm" />
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                    <Link
                      to={`/copilot?projectId=${projectId}`}
                      className="p-1.5 rounded-btn bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center"
                      title="Analyze in Copilot"
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/scenarios?projectId=${projectId}`}
                      className="p-1.5 rounded-btn bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center"
                      title="Simulate What-If"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/projects/${projectId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-btn text-xs font-bold transition-colors"
                    >
                      360°
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
