import React from 'react';
import { AlertOctagon, ShieldAlert, Clock, CheckCircle2 } from 'lucide-react';

export interface PriorityBadgeProps {
  priority: string | null | undefined;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = true,
  className = ''
}) => {
  const norm = (priority || 'P4').toUpperCase();

  const configs = {
    P1: {
      tier: 'P1',
      label: 'Immediate',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      Icon: AlertOctagon
    },
    P2: {
      tier: 'P2',
      label: 'High Priority',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      Icon: ShieldAlert
    },
    P3: {
      tier: 'P3',
      label: 'Monitor Closely',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      Icon: Clock
    },
    P4: {
      tier: 'P4',
      label: 'Routine',
      bg: 'bg-slate-100',
      text: 'text-slate-700',
      border: 'border-slate-200',
      Icon: CheckCircle2
    }
  };

  const config = configs[norm as keyof typeof configs] || configs.P4;
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
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.tier}</span>
      {showLabel && <span className="font-semibold opacity-90">• {config.label}</span>}
    </span>
  );
};
