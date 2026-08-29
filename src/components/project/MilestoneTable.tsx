import React from 'react';
import { Milestone } from '../../services/types';
import { formatDate } from '../../utils/formatDate';

interface MilestoneTableProps {
  milestones: Milestone[];
}

export const MilestoneTable: React.FC<MilestoneTableProps> = ({ milestones }) => {
  if (!milestones || milestones.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No critical milestone schedule logged for this project.
      </div>
    );
  }

  const getStatusBadge = (status: string, delayDays: number) => {
    if (status === 'COMPLETED') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          COMPLETED
        </span>
      );
    }
    if (delayDays > 0) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200">
          +{delayDays}d DELAY
        </span>
      );
    }
    if (status === 'IN_PROGRESS') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
          IN PROGRESS
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
        PLANNED
      </span>
    );
  };

  return (
    <div className="bg-white rounded-card border border-slate-200 shadow-command-card overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-white">
        <div>
          <h3 className="text-base font-bold text-slate-900">Contractual & Physical Milestones</h3>
          <p className="text-xs text-slate-500">Critical path timeline, completion deadlines, and schedule slippage</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          {milestones.length} Milestones
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3.5">#</th>
              <th className="px-4 py-3.5">Milestone Name</th>
              <th className="px-4 py-3.5">Target Date</th>
              <th className="px-4 py-3.5">Actual / Revised</th>
              <th className="px-4 py-3.5 text-center">Criticality</th>
              <th className="px-4 py-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {milestones.map((m, index) => {
              const delayDays = Number(m.delay_days || 0);
              const isCritical = m.criticality === 'CRITICAL';

              return (
                <tr key={m.milestone_id || index} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-400 font-bold">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3.5 max-w-sm">
                    <div className="font-bold text-slate-900 text-xs">{m.milestone_name}</div>
                    {isCritical && (
                      <span className="inline-block mt-0.5 text-[9px] font-mono font-bold px-1.5 py-0.2 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                        CRITICAL PATH
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-slate-600">
                    {formatDate(m.planned_date)}
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs">
                    {m.actual_date ? (
                      <span className="text-emerald-700 font-bold">{formatDate(m.actual_date)}</span>
                    ) : m.revised_date ? (
                      <span className="text-amber-700 font-bold">{formatDate(m.revised_date)}</span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-xs font-bold">
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${
                      m.criticality === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                      m.criticality === 'HIGH' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {m.criticality}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {getStatusBadge(m.status, delayDays)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
