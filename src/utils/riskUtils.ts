import { RiskLevel, ProjectStatus, AlertSeverity } from '../services/types';

export function getRiskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'CRITICAL';
  if (score >= 50) return 'HIGH';
  if (score >= 25) return 'MEDIUM';
  return 'LOW';
}

export function getRiskBadgeClasses(level: RiskLevel | undefined | null): { bg: string; text: string; border: string; dot: string } {
  switch (level) {
    case 'CRITICAL':
      return {
        bg: 'bg-red-950/60 text-red-400 border-red-500/40 shadow-xs',
        text: 'text-red-400',
        border: 'border-red-500/50',
        dot: 'bg-red-500 animate-tactical-pulse'
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-950/60 text-orange-400 border-orange-500/40 shadow-xs',
        text: 'text-orange-400',
        border: 'border-orange-500/50',
        dot: 'bg-orange-500'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40 shadow-xs',
        text: 'text-amber-400',
        border: 'border-amber-500/50',
        dot: 'bg-amber-400'
      };
    case 'LOW':
    default:
      return {
        bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-xs',
        text: 'text-emerald-400',
        border: 'border-emerald-500/50',
        dot: 'bg-emerald-400'
      };
  }
}

export function getStatusBadgeClasses(status: ProjectStatus | undefined | null): { bg: string; text: string; dot: string } {
  switch (status) {
    case 'COMPLETED':
      return { bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40', text: 'text-cyan-300', dot: 'bg-cyan-400' };
    case 'DELAYED':
      return { bg: 'bg-red-950/60 text-red-400 border-red-500/40', text: 'text-red-400', dot: 'bg-red-500 animate-tactical-pulse' };
    case 'ONGOING':
      return { bg: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40', text: 'text-emerald-400', dot: 'bg-emerald-400' };
    case 'ON_HOLD':
      return { bg: 'bg-amber-950/60 text-amber-400 border-amber-500/40', text: 'text-amber-400', dot: 'bg-amber-400' };
    case 'CANCELLED':
    case 'CLOSED':
      return { bg: 'bg-slate-800/80 text-slate-400 border-slate-700', text: 'text-slate-400', dot: 'bg-slate-500' };
    case 'APPROVED':
    case 'PROPOSED':
    default:
      return { bg: 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40', text: 'text-indigo-300', dot: 'bg-indigo-400' };
  }
}

export function getSeverityBadgeClasses(severity: AlertSeverity): { bg: string; text: string; dot: string } {
  switch (severity) {
    case 'CRITICAL':
      return { bg: 'bg-red-950/70 text-red-400 border-red-500/50', text: 'text-red-400', dot: 'bg-red-500' };
    case 'HIGH':
      return { bg: 'bg-orange-950/70 text-orange-400 border-orange-500/50', text: 'text-orange-400', dot: 'bg-orange-500' };
    case 'MEDIUM':
      return { bg: 'bg-amber-950/70 text-amber-400 border-amber-500/50', text: 'text-amber-400', dot: 'bg-amber-400' };
    case 'LOW':
    default:
      return { bg: 'bg-cyan-950/70 text-cyan-300 border-cyan-500/50', text: 'text-cyan-300', dot: 'bg-cyan-400' };
  }
}
