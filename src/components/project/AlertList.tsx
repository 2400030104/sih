import React from 'react';
import { BellRing, Check, Clock } from 'lucide-react';
import { Alert } from '../../services/types';
import { formatDate } from '../../utils/formatDate';

interface AlertListProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: number) => void;
  onResolve?: (alertId: number) => void;
}

export const AlertList: React.FC<AlertListProps> = ({ alerts, onAcknowledge, onResolve }) => {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No active early warning alerts flagged for this project.
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">Active Early Warning Alerts</h3>
          </div>
          <p className="text-xs text-slate-500">Autonomous risk threshold breaches and milestone slippage flags</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-rose-50 text-rose-700 rounded-badge border border-rose-200">
          {alerts.length} Active Warnings
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.alert_id}
            className={`p-4 rounded-btn border transition-all ${
              alert.severity === 'CRITICAL'
                ? 'bg-rose-50/70 border-rose-200'
                : alert.severity === 'HIGH'
                ? 'bg-orange-50/70 border-orange-200'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono font-bold text-[10px] border ${
                    alert.severity === 'CRITICAL'
                      ? 'bg-rose-100 text-rose-700 border-rose-300'
                      : alert.severity === 'HIGH'
                      ? 'bg-orange-100 text-orange-700 border-orange-300'
                      : 'bg-amber-100 text-amber-800 border-amber-300'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {alert.severity}
                </span>
                <span className="font-bold text-slate-900 text-xs sm:text-sm">{alert.title}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {formatDate(alert.generated_at, 'full')}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">{alert.message}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
              <span className="font-mono text-slate-500 text-[11px]">
                Status: <strong className="text-slate-900 uppercase">{alert.status}</strong>
              </span>

              <div className="flex items-center gap-2">
                {alert.status === 'NEW' && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.alert_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-2xs"
                  >
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Acknowledge
                  </button>
                )}
                {alert.status !== 'RESOLVED' && onResolve && (
                  <button
                    onClick={() => onResolve(alert.alert_id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-btn text-xs transition-colors cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
