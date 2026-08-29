import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Home, LayoutDashboard } from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';

export const NotFound: React.FC = () => {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-8 space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center shadow-command-card">
          <Layers className="w-8 h-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-2xl font-black text-slate-900">404 — Route Not Located</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested monitoring dashboard, dossier, or intelligence route does not exist in the PRAGATI-AI registry.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-btn text-xs transition-all shadow-xs"
          >
            <Home className="w-3.5 h-3.5" />
            Home Portal
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 font-bold rounded-btn text-xs transition-all shadow-xs"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-600" />
            Command Center
          </Link>
        </div>
      </div>
    </PageContainer>
  );
};

export default NotFound;
