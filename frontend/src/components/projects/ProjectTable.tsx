import React from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  Bot,
  SlidersHorizontal,
  FolderKanban,
  Coins
} from 'lucide-react';
import { ProjectListItem } from '../../services/types';
import { StatusBadge } from '../common/StatusBadge';
import { RiskBadge } from '../common/RiskBadge';
import { formatCurrency } from '../../utils/formatCurrency';

interface ProjectTableProps {
  projects: ProjectListItem[];
  onEditAmount?: (project: ProjectListItem) => void;
}

export const ProjectTable: React.FC<ProjectTableProps> = ({ projects, onEditAmount }) => {
  const formatPercentage = (val?: number | null) => {
    if (val === undefined || val === null) return '0%';
    return `${Number(val).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
      {/* Desktop & Tablet Table View */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[220px]">Project Code &amp; Name</th>
              <th className="py-3 px-4">Ministry &amp; Sector</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 text-right">Cost (₹ Cr)</th>
              <th className="py-3 px-4 text-center min-w-[130px]">Progress</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Risk Tier</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {projects.map((project) => {
              const approvedCost = Number(project.approved_cost) || 0;
              const revisedCost = project.revised_cost ? Number(project.revised_cost) : null;
              const hasCostOverrun = revisedCost !== null && revisedCost > approvedCost;
              const progress = Number(project.physical_progress) || 0;
              const finProgress = Number(project.financial_progress) || 0;

              return (
                <tr
                  key={project.project_id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* ID */}
                  <td className="px-4 py-3.5 text-center font-mono text-[11px] font-bold text-slate-400">
                    {String(project.project_id).padStart(2, '0')}
                  </td>

                  {/* Code & Name */}
                  <td className="px-4 py-3.5">
                    <Link
                      to={`/projects/${project.project_id}`}
                      className="block group-hover:text-blue-600 transition-colors"
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-mono font-bold text-blue-600">
                          {project.project_code}
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-1 text-xs">
                        {project.project_name}
                      </span>
                    </Link>
                  </td>

                  {/* Ministry & Sector */}
                  <td className="px-4 py-3.5">
                    <div className="text-slate-900 text-xs font-semibold">{project.ministry_name}</div>
                    <div className="text-slate-500 text-[11px]">{project.sector_name}</div>
                  </td>

                  {/* State */}
                  <td className="px-4 py-3.5 text-xs text-slate-600 font-medium">
                    {project.state_name || '—'}
                  </td>

                  {/* Approved / Revised Cost */}
                  <td className="px-4 py-3.5 text-right font-mono text-xs">
                    <div className="font-bold text-slate-900">{formatCurrency(approvedCost)}</div>
                    {hasCostOverrun && (
                      <div className="text-[10px] text-rose-600 font-bold">
                        Rev: {formatCurrency(revisedCost)}
                      </div>
                    )}
                  </td>

                  {/* Progress (Physical & Financial) */}
                  <td className="px-4 py-3.5 text-center min-w-[130px]">
                    <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 mb-1">
                      <span>Phy: {formatPercentage(progress)}</span>
                      <span>Fin: {formatPercentage(finProgress)}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full ${
                          progress >= 80
                            ? 'bg-emerald-500'
                            : progress >= 40
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3.5">
                    <StatusBadge status={project.current_status} size="sm" />
                  </td>

                  {/* AI Risk Score */}
                  <td className="px-4 py-3.5 text-center">
                    <RiskBadge
                      level={project.risk_level}
                      score={project.overall_risk}
                      size="sm"
                    />
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1.5">
                    {onEditAmount && (
                      <button
                        onClick={() => onEditAmount(project)}
                        className="p-1.5 rounded-btn bg-emerald-50 text-emerald-700 hover:bg-emerald-100 inline-flex items-center cursor-pointer transition-colors"
                        title="Update Budget & Outlay Amount"
                      >
                        <Coins className="w-3.5 h-3.5 text-emerald-600" />
                      </button>
                    )}

                    <Link
                      to={`/copilot?projectId=${project.project_id}`}
                      className="p-1.5 rounded-btn bg-blue-50 text-blue-600 hover:bg-blue-100 inline-flex items-center"
                      title="Analyze with Copilot"
                    >
                      <Bot className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/scenarios?projectId=${project.project_id}`}
                      className="p-1.5 rounded-btn bg-slate-100 text-slate-700 hover:bg-slate-200 inline-flex items-center"
                      title="Run What-If Simulation"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/projects/${project.project_id}`}
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

      {/* Mobile Card Transformation View */}
      <div className="sm:hidden divide-y divide-slate-100">
        {projects.map((project) => (
          <div key={project.project_id} className="p-4 space-y-3 bg-white">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800">
                    #{String(project.project_id).padStart(2, '0')}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-blue-600">
                    {project.project_code}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {project.project_name}
                </h4>
              </div>
              <RiskBadge level={project.risk_level} score={project.overall_risk} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-1 border-y border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Ministry</span>
                <span className="font-semibold text-slate-700">{project.ministry_name}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Cost</span>
                <span className="font-mono font-bold text-slate-900">
                  {formatCurrency(Number(project.approved_cost))}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <StatusBadge status={project.current_status} size="sm" />
              <div className="flex items-center gap-2">
                {onEditAmount && (
                  <button
                    onClick={() => onEditAmount(project)}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-btn border border-emerald-200"
                  >
                    Edit Cost
                  </button>
                )}
                <Link
                  to={`/projects/${project.project_id}`}
                  className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-btn border border-blue-200 inline-flex items-center gap-1"
                >
                  View 360° <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTable;
