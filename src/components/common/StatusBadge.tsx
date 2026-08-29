import React from 'react';
import { Activity, CheckCircle2, Clock, PauseCircle, HelpCircle } from 'lucide-react';

export interface StatusBadgeProps {
  status: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = ''
}) => {
  const normStatus = (status || 'UNKNOWN').toUpperCase();

  const configs = {
    ONGOING: {
      label: 'ONGOING',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      Icon: Activity
    },
    COMPLETED: {
      label: 'COMPLETED',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      Icon: CheckCircle2
    },
    DELAYED: {
      label: 'DELAYED',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      Icon: Clock
    },
    'ON HOLD': {
      label: 'ON HOLD',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      Icon: PauseCircle
    },
    'NOT STARTED': {
      label: 'NOT STARTED',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      Icon: HelpCircle
    },
    APPROVED: {
      label: 'APPROVED',
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      border: 'border-sky-200',
      Icon: CheckCircle2
    },
    PROPOSED: {
      label: 'PROPOSED',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      Icon: HelpCircle
    },
    CLOSED: {
      label: 'CLOSED',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      Icon: CheckCircle2
    }
  };

  const config = configs[normStatus as keyof typeof configs] || {
    label: normStatus,
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    Icon: Activity
  };

  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-bold font-mono tracking-wider rounded-badge border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <Icon className="w-3 h-3 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
