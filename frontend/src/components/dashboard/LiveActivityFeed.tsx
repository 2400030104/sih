import React from 'react';
import { Radio, Activity, Clock, ShieldAlert, CheckCircle, FileText, ArrowUpRight } from 'lucide-react';
import { useSocket, RealtimeEventItem } from '../../context/SocketContext';
import { Link } from 'react-router-dom';

export const LiveActivityFeed: React.FC = () => {
  const { recentEvents, connectionStatus } = useSocket();

  const getEventBadge = (event: string) => {
    switch (event) {
      case 'PROJECT_CREATED':
      case 'PROJECT_UPDATED':
        return {
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: FileText,
          label: 'PROJECT'
        };
      case 'ALERT_CREATED':
        return {
          color: 'bg-rose-50 text-rose-700 border-rose-200',
          icon: ShieldAlert,
          label: 'ALERT'
        };
      case 'ALERT_ACKNOWLEDGED':
      case 'ALERT_RESOLVED':
        return {
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: CheckCircle,
          label: 'RESOLVED'
        };
      case 'RISK_UPDATED':
        return {
          color: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: Activity,
          label: 'RISK'
        };
      default:
        return {
          color: 'bg-slate-100 text-slate-700 border-slate-200',
          icon: Radio,
          label: 'SYSTEM'
        };
    }
  };

  const formatEventTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return 'Just now';
    }
  };

  return (
    <div className="bg-white rounded-card border border-slate-200 p-6 shadow-command-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Real-Time Telemetry & Activity Stream
            </h2>
            <p className="text-xs text-slate-500">Live WebSocket monitoring events across IPMD infrastructure</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500">
            Status:{' '}
            <strong className={connectionStatus === 'connected' ? 'text-emerald-700 font-mono' : 'text-slate-500 font-mono'}>
              {connectionStatus === 'connected' ? 'STREAM SYNCHRONIZED' : connectionStatus.toUpperCase()}
            </strong>
          </span>
        </div>
      </div>

      {recentEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-card border border-dashed border-slate-200">
          <Activity className="w-6 h-6 text-blue-600 mb-2 animate-pulse" />
          <p className="text-xs font-bold text-slate-900">Listening for real-time monitoring events...</p>
          <p className="text-[11px] text-slate-500 max-w-sm mt-0.5">
            When database writes, monthly reports, risk score recalibrations, or alerts trigger, they will stream here instantly.
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {recentEvents.map((item: RealtimeEventItem) => {
            const badge = getEventBadge(item.event);
            const Icon = badge.icon;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-btn bg-slate-50 hover:bg-slate-100/70 border border-slate-200 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-md border shrink-0 ${badge.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                      <p className="font-bold text-slate-900">{item.description}</p>
                    </div>
                    {item.data?.projectName && (
                      <p className="text-[11px] text-slate-500 mt-0.5 truncate max-w-xs sm:max-w-md">
                        {item.data.projectName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {formatEventTime(item.timestamp)}
                  </span>
                  {item.data?.projectId && (
                    <Link
                      to={`/projects/${item.data.projectId}`}
                      className="p-1 rounded text-blue-600 hover:bg-white transition-colors"
                      title="Inspect Project"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
