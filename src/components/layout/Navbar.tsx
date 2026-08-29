import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, Bell, ShieldCheck, RefreshCw, X, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../../context/SocketContext';
import { useProjects } from '../../hooks/useProjects';

interface NavbarProps {
  onToggleSidebar: () => void;
  activeAlertCount?: number;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
  activeAlertCount = 6,
  onRefresh,
  isRefreshing = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connectionStatus } = useSocket();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { projects } = useProjects({ limit: 50 });

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const filteredSearchResults = searchQuery.trim()
    ? projects.filter(
        (p) =>
          p.project_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sector_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.ministry_name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const getPageTitle = (pathname: string) => {
    if (pathname === '/') return 'Home Portal';
    if (pathname.startsWith('/dashboard')) return 'Command Center';
    if (pathname.startsWith('/projects/') && pathname.length > 10) return 'Project 360° Dossier';
    if (pathname.startsWith('/projects')) return 'Infrastructure Projects';
    if (pathname.startsWith('/risk-analytics')) return 'Predictive Risk Analytics';
    if (pathname.startsWith('/alerts')) return 'Early Warning Alerts';
    if (pathname.startsWith('/interventions')) return 'Intervention Queue';
    if (pathname.startsWith('/recommendations')) return 'Action Recommendations';
    if (pathname.startsWith('/copilot')) return 'AI Copilot Assistant';
    if (pathname.startsWith('/scenarios')) return 'What-If Scenario Simulator';
    if (pathname.startsWith('/settings')) return 'System Settings & Models';
    return 'PRAGATI-AI';
  };

  const getConnectionBadge = () => {
    switch (connectionStatus) {
      case 'connected':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
            title="Real-Time WebSocket Engine Synchronized"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-tactical-pulse" />
            LIVE
          </span>
        );
      case 'reconnecting':
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-700 border border-amber-200"
            title="Re-establishing WebSocket telemetry stream..."
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            RECONNECTING
          </span>
        );
      case 'disconnected':
      default:
        return (
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200"
            title="WebSocket Offline (Auto-polling active)"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            POLLING
          </span>
        );
    }
  };

  return (
    <>
      <header className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-xs h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Mobile Hamburger + Breadcrumb/Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-btn text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight truncate max-w-[200px] sm:max-w-md">
                {getPageTitle(location.pathname)}
              </h1>
              <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                IPMD / MoSPI
              </span>
              {getConnectionBadge()}
            </div>
          </div>
        </div>

        {/* Right Side: Global Search Trigger, Refresh, Demo Data Tag, Notifications, User */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Refresh Action */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              title="Refresh Live Telemetry"
              className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-btn transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          )}

          {/* Interactive Global Search Trigger Bar */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center justify-between w-60 lg:w-72 bg-slate-50 border border-slate-200 rounded-btn px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-white hover:text-slate-700 transition-all cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">Search projects, code...</span>
            </div>
            <kbd className="text-[10px] font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 shadow-2xs">
              Ctrl+K
            </kbd>
          </button>

          {/* Notifications Bell */}
          <Link
            to="/alerts"
            className="relative p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-btn transition-colors"
            title="Early Warning Alerts"
          >
            <Bell className="w-5 h-5" />
            {activeAlertCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold font-mono text-white bg-rose-600 rounded-full animate-pulse">
                {activeAlertCount}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>

          {/* User / Officer Profile */}
          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              GOI
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-slate-900 leading-tight">IPMD Officer</p>
              <p className="text-[10px] text-slate-500 leading-none">MoSPI Command Desk</p>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal (Ctrl+K) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-start justify-center pt-20 px-4 text-center">
            <div
              className="fixed inset-0 bg-slate-900/40 transition-opacity"
              onClick={() => setSearchOpen(false)}
            />

            <div className="w-full max-w-xl transform overflow-hidden rounded-card bg-white border border-slate-200 shadow-2xl text-left align-middle transition-all z-10">
              <div className="flex items-center px-4 py-3 border-b border-slate-200 bg-slate-50">
                <Search className="w-4 h-4 text-blue-600 shrink-0 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by project code, project name, sector, ministry..."
                  className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 max-h-96 overflow-y-auto space-y-1">
                {filteredSearchResults.length > 0 ? (
                  filteredSearchResults.map((p) => (
                    <div
                      key={p.project_id}
                      onClick={() => {
                        setSearchOpen(false);
                        navigate(`/projects/${p.project_id}`);
                      }}
                      className="p-3 rounded-btn hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group border border-transparent hover:border-slate-200"
                    >
                      <div className="space-y-0.5 max-w-md truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {p.project_code}
                          </span>
                          <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">
                            {p.project_name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 truncate">
                          {p.sector_name} • {p.ministry_name}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          p.risk_level === 'CRITICAL' ? 'text-rose-700 border-rose-200 bg-rose-50' :
                          p.risk_level === 'HIGH' ? 'text-orange-700 border-orange-200 bg-orange-50' :
                          p.risk_level === 'MEDIUM' ? 'text-amber-800 border-amber-200 bg-amber-50' :
                          'text-emerald-700 border-emerald-200 bg-emerald-50'
                        }`}>
                          {p.overall_risk} {p.risk_level}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  ))
                ) : searchQuery.trim() ? (
                  <p className="text-center py-6 text-xs text-slate-500">
                    No infrastructure projects found matching "{searchQuery}"
                  </p>
                ) : (
                  <div className="py-4 px-2 text-xs text-slate-500 space-y-2">
                    <p className="font-semibold text-slate-700">Quick Search Shortcuts:</p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setSearchQuery('PRJ-0012')}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        PRJ-0012
                      </button>
                      <button
                        onClick={() => setSearchQuery('High Risk')}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        High Risk Projects
                      </button>
                      <button
                        onClick={() => setSearchQuery('Railways')}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-[11px] font-medium"
                      >
                        Railways
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
