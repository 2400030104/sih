import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = 'h-4 w-full' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-100 rounded ${className}`}
    />
  );
};

export const KpiCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-card p-5 border border-slate-200 shadow-command-card space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-10 w-10 rounded-lg" />
      </div>
      <div className="pt-2 border-t border-slate-100">
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 6 }) => {
  return (
    <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex gap-4 bg-slate-50">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex gap-4 items-center">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <Skeleton key={cIdx} className="h-4 flex-1" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC<{ height?: string }> = ({ height = 'h-64' }) => {
  return (
    <div className={`bg-white rounded-card p-6 border border-slate-200 shadow-command-card flex flex-col justify-between ${height}`}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="flex-1 flex items-end gap-3 pt-4">
        <Skeleton className="h-2/3 flex-1 rounded-t" />
        <Skeleton className="h-full flex-1 rounded-t" />
        <Skeleton className="h-1/2 flex-1 rounded-t" />
        <Skeleton className="h-3/4 flex-1 rounded-t" />
        <Skeleton className="h-4/5 flex-1 rounded-t" />
      </div>
    </div>
  );
};
