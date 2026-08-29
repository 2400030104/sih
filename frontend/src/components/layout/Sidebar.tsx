import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  BellRing,
  Lightbulb,
  Bot,
  SlidersHorizontal,
  Layers,
  AlertOctagon,
  Sparkles,
  Settings as SettingsIcon,
  X
} from 'lucide-react';
import { useSocket } from '../../context/SocketContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { connectionStatus } = useSocket();
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setLastSyncTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const mainNavItems = [
    {
      name: 'Home Portal',
      path: '/',
      icon: HomeIcon,
      end: true
    },
    {
      name: 'Command Center',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live'
    },
    {
      name: 'Projects',
      path: '/projects',
      icon: FolderKanban
    },
    {
      name: 'Risk Analytics',
      path: '/risk-analytics',
      icon: ShieldAlert
    },
    {
      name: 'Alerts',
      path: '/alerts',
      icon: BellRing
    },
    {
      name: 'Interventions',
      path: '/interventions',
      icon: AlertOctagon,
      badge: 'P1–P4'
    },
    {
      name: 'Recommendations',
      path: '/recommendations',
      icon: Lightbulb
    }
  ];

  const intelligenceNavItems = [
    {
      name: 'AI Copilot',
      path: '/copilot',
      icon: Bot,
      badge: 'RAG'
    },
    {
      name: 'What-If Simulator',
      path: '/scenarios',
      icon: SlidersHorizontal,
      badge: 'ML'
    },
    {
      name: 'Settings & Models',
      path: '/settings',
      icon: SettingsIcon
    }
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white text-slate-700 w-64 border-r border-slate-200 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-slate-200 bg-white">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900 text-base tracking-tight">PRAGATI</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium tracking-tight truncate">
              National Infrastructure Intelligence
            </p>
          </div>
        </NavLink>

        {onToggle && (
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-btn text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sub-label: MoSPI IPMD Mission */}
      <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-[11px]">
        <span className="font-bold text-slate-800">IPMD / MoSPI</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-tactical-pulse" />
          ACTIVE DESK
        </span>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monitoring & Operations
          </p>
          <nav className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-btn text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 border border-slate-200 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* AI & Decision Support Modules */}
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-blue-600" /> AI Decision Support
          </p>
          <nav className="space-y-1">
            {intelligenceNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-btn text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-[11px] space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-500">Live Sync:</span>
          <span className="text-slate-700 font-mono text-[10px] font-semibold">{lastSyncTime}</span>
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-500">
          <span>Engine Status:</span>
          <span className="text-emerald-700 font-mono font-bold">RAG + GBR Active</span>
        </div>
      </div>
    </aside>
  );
};
