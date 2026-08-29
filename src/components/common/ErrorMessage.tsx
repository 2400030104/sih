import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'System Synchronization Error',
  message = 'An unexpected issue occurred while retrieving infrastructure monitoring telemetry.',
  onRetry,
  className = ''
}) => {
  return (
    <div
      className={`bg-rose-50/70 border border-rose-200 rounded-card p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-command-card ${className}`}
    >
      <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1 max-w-md">
        <h4 className="text-base font-bold text-slate-900">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-600">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-btn text-xs font-bold text-slate-900 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
};
