import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, AlertOctagon } from 'lucide-react';

export interface RiskBadgeProps {
  level: string | null | undefined;
  score?: number | null | undefined;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = true,
  size = 'md',
  className = ''
}) => {
  const normLevel = (level || 'LOW').toUpperCase();

  const configs = {
    LOW: {
      label: 'LOW',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
      Icon: CheckCircle
    },
    MEDIUM: {
      label: 'MEDIUM',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
      Icon: AlertTriangle
    },
    HIGH: {
      label: 'HIGH',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
      Icon: ShieldAlert
    },
    CRITICAL: {
      label: 'CRITICAL',
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
      Icon: AlertOctagon
    }
  };

  const config = configs[normLevel as keyof typeof configs] || configs.LOW;
  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2'
  };

  return (
    <span
      className={`inline-flex items-center font-bold font-mono rounded-badge border ${config.bg} ${config.text} ${config.border} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} />
      <Icon className="w-3 h-3 shrink-0" />
      {showScore && score !== undefined && score !== null ? (
        <span>
          {score} • {config.label}
        </span>
      ) : (
        <span>{config.label}</span>
      )}
    </span>
  );
};
