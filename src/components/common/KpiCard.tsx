import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string | number;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
    isPositive?: boolean;
  };
  icon: LucideIcon;
  variant?: 'default' | 'cyan' | 'low' | 'medium' | 'high' | 'critical';
  onClick?: () => void;
  className?: string;
  highlighted?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon: Icon,
  variant = 'default',
  onClick,
  className = '',
  highlighted = false
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      number: 'text-slate-900'
    },
    cyan: {
      border: 'border-blue-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600',
      number: 'text-blue-600'
    },
    low: {
      border: 'border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      number: 'text-emerald-700'
    },
    medium: {
      border: 'border-amber-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      number: 'text-amber-800'
    },
    high: {
      border: 'border-orange-200 hover:border-orange-300',
      iconBg: 'bg-orange-50 text-orange-600',
      number: 'text-orange-700'
    },
    critical: {
      border: 'border-rose-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      number: 'text-rose-700'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`relative bg-white rounded-card p-5 border shadow-command-card transition-all duration-150 ${
        style.border
      } ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
          : ''
      } ${
        highlighted ? 'ring-1 ring-blue-500' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {title}
          </span>
          <div className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${style.number}`}>
            {value}
          </div>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(trend || subtitle) && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
          {trend ? (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold flex items-center gap-0.5 text-[11px] ${
                  trend.direction === 'neutral'
                    ? 'text-slate-500'
                    : trend.isPositive
                    ? 'text-emerald-600'
                    : 'text-rose-600'
                }`}
              >
                {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5" />}
                <span>{trend.value}</span>
              </span>
              {trend.label && (
                <span className="text-slate-500 text-[11px] truncate">
                  {trend.label}
                </span>
              )}
            </div>
          ) : (
            <span className="text-slate-500 text-[11px] truncate">
              {subtitle}
            </span>
          )}
          {onClick && (
            <span className="text-[10px] text-blue-600 font-semibold ml-auto flex items-center gap-0.5 hover:underline">
              View →
            </span>
          )}
        </div>
      )}
    </div>
  );
};
