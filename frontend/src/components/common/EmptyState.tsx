import React from 'react';
import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Records Found',
  description = 'No infrastructure projects or monitoring observations match your criteria.',
  icon,
  action,
  className = ''
}) => {
  return (
    <div
      className={`bg-white border border-slate-200 border-dashed rounded-card p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-3 shadow-command-card ${className}`}
    >
      <div className="w-12 h-12 bg-slate-100 text-blue-600 border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
        {icon || <FolderSearch className="w-6 h-6" />}
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-500">{description}</p>
      </div>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
