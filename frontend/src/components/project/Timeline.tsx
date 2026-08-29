import React from 'react';
import {
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { TimelineEvent } from '../../services/types';
import { formatDate } from '../../utils/formatDate';

interface TimelineProps {
  events: TimelineEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No chronological timeline events recorded.
      </div>
    );
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PROJECT_APPROVED':
        return { icon: FileCheck, bg: 'bg-blue-50 text-blue-600', border: 'border-blue-200' };
      case 'PROJECT_PLANNED_START':
      case 'PROJECT_ACTUAL_START':
        return { icon: Play, bg: 'bg-blue-50 text-blue-600', border: 'border-blue-200' };
      case 'MILESTONE':
        return { icon: CheckCircle2, bg: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' };
      case 'EARLY_WARNING_ALERT':
        return { icon: AlertTriangle, bg: 'bg-rose-50 text-rose-600', border: 'border-rose-200' };
      case 'RISK_PREDICTION':
        return { icon: ShieldAlert, bg: 'bg-amber-50 text-amber-600', border: 'border-amber-200' };
      case 'MONTHLY_MONITORING':
      default:
        return { icon: Activity, bg: 'bg-slate-100 text-slate-600', border: 'border-slate-200' };
    }
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Project Lifetime Chronological Timeline</h3>
          <p className="text-xs text-slate-500">Historical milestone, monitoring, risk calibration, and alert sequence</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          {events.length} Events
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((event, index) => {
          const { icon: Icon, bg, border } = getEventIcon(event.eventType);

          return (
            <div key={index} className="relative group">
              {/* Event Dot Icon */}
              <div
                className={`absolute -left-6 top-0.5 w-6 h-6 rounded-full flex items-center justify-center border ${bg} ${border} shadow-2xs z-10`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Event Content Card */}
              <div className="ml-3 p-3.5 rounded-btn bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">{event.title}</span>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-blue-600" />
                    {formatDate(event.eventDate)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
