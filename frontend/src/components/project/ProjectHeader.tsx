import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Building2, MapPin, Layers, Briefcase, Bot, SlidersHorizontal, Coins } from 'lucide-react';
import { ProjectDetails, RiskLevel } from '../../services/types';
import { RiskBadge } from '../common/RiskBadge';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';

interface ProjectHeaderProps {
  project: ProjectDetails;
  riskLevel?: RiskLevel;
  overallRisk?: number;
  priority?: string;
  onUpdateAmount?: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  riskLevel,
  overallRisk,
  priority = 'P2',
  onUpdateAmount
}) => {
  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      {/* Top Breadcrumb & Status Ribbon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Directory
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
            {project.source_system || 'PAIMANA'}
          </span>
          <StatusBadge status={project.current_status} size="md" />
          <RiskBadge
            level={riskLevel || project.risk_level}
            score={overallRisk ?? project.overall_risk}
            size="md"
          />
          <PriorityBadge priority={priority} size="md" />
        </div>
      </div>

      {/* Main Title & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="space-y-1.5 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-800 shadow-xs">
              #{String(project.project_id).padStart(2, '0')}
            </span>
            <span className="text-xs font-mono font-bold tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 inline-block">
              {project.project_code}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Stage: <strong className="text-slate-800">{project.project_stage || 'Implementation'}</strong>
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {project.project_name}
          </h1>
          {project.project_description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
              {project.project_description}
            </p>
          )}
        </div>

        {/* Action Shortcuts */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {onUpdateAmount && (
            <button
              onClick={onUpdateAmount}
              className="px-3.5 py-2 rounded-btn bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Coins className="w-4 h-4 text-emerald-600" />
              <span>Update Amount</span>
            </button>
          )}

          <Link
            to={`/copilot?projectId=${project.project_id}`}
            className="px-3.5 py-2 rounded-btn bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Bot className="w-4 h-4" />
            <span>Copilot Dossier</span>
          </Link>
          <Link
            to={`/scenarios?projectId=${project.project_id}`}
            className="px-3.5 py-2 rounded-btn bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-blue-600" />
            <span>Simulate What-If</span>
          </Link>
        </div>
      </div>

      {/* Metadata Pill Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-2 text-slate-600">
          <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Ministry</span>
            <span className="font-semibold text-slate-800 truncate">{project.ministry_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Layers className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Sector</span>
            <span className="font-semibold text-slate-800 truncate">{project.sector_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Implementing Agency</span>
            <span className="font-semibold text-slate-800 truncate">{project.agency_name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">State & Location</span>
            <span className="font-semibold text-slate-800 truncate">
              {project.state_name} {project.district_name ? `• ${project.district_name}` : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
