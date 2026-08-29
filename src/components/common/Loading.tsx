import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  type?: 'spinner' | 'page' | 'inline';
  message?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  type = 'page',
  message = 'Loading telemetry & intelligence dossier...',
  className = ''
}) => {
  if (type === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 text-xs text-slate-500 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
        <span>{message}</span>
      </div>
    );
  }

  if (type === 'spinner') {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div
      className={`min-h-[400px] flex flex-col items-center justify-center p-8 space-y-4 bg-white border border-slate-200 rounded-card shadow-command-card ${className}`}
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-slate-900">{message}</p>
        <p className="text-xs text-slate-500">Synchronizing monitoring telemetry</p>
      </div>
    </div>
  );
};
