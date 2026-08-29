import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
  };
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'info' | 'cyan';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  onClick
}) => {
  const variantStyles = {
    default: {
      border: 'border-slate-200 hover:border-slate-300',
      iconBg: 'bg-slate-100 text-slate-700',
      valueColor: 'text-slate-900'
    },
    danger: {
      border: 'border-rose-200 hover:border-rose-300',
      iconBg: 'bg-rose-50 text-rose-600',
      valueColor: 'text-rose-700'
    },
    warning: {
      border: 'border-amber-200 hover:border-amber-300',
      iconBg: 'bg-amber-50 text-amber-600',
      valueColor: 'text-amber-800'
    },
    success: {
      border: 'border-emerald-200 hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600',
      valueColor: 'text-emerald-700'
    },
    info: {
      border: 'border-blue-200 hover:border-blue-300',
      iconBg: 'bg-blue-50 text-blue-600',
      valueColor: 'text-blue-700'
    },
    cyan: {
      border: 'border-sky-200 hover:border-sky-300',
      iconBg: 'bg-sky-50 text-sky-600',
      valueColor: 'text-sky-700'
    }
  };

  const style = variantStyles[variant] || variantStyles.default;

  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-card border shadow-command-card transition-all duration-150 ${
        style.border
      } ${
        onClick
          ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5'
          : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${style.valueColor}`}>{value}</h3>
        </div>
        <div className={`p-2.5 rounded-lg ${style.iconBg} shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          {subtitle && <span className="truncate text-[11px]">{subtitle}</span>}
          {trend && (
            <span
              className={`font-mono font-bold text-[11px] flex items-center gap-0.5 ${
                trend.isNeutral ? 'text-slate-500' : trend.isPositive ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
