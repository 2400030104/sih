import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { MinistryMetric } from '../../services/types';
import { formatCurrency } from '../../utils/formatCurrency';

interface MinistryChartProps {
  data: MinistryMetric[];
}

export const MinistryChart: React.FC<MinistryChartProps> = ({ data }) => {
  const chartData = data
    .map((item) => ({
      name: item.ministry_name,
      code: item.ministry_code,
      projects: Number(item.projectCount),
      cost: Number(item.totalApprovedCost),
      delayed: Number(item.delayedCount || 0),
      highRisk: Number(item.highRiskCount || 0)
    }))
    .sort((a, b) => b.projects - a.projects);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white text-slate-900 p-3 rounded-card shadow-lg text-xs border border-slate-200 space-y-1">
          <p className="font-bold text-sm text-blue-600">{p.name} ({p.code})</p>
          <p className="text-slate-600">Monitored Projects: <span className="font-bold text-slate-900 font-mono">{p.projects}</span></p>
          <p className="text-slate-600">Approved Cost: <span className="font-bold text-emerald-700 font-mono">{formatCurrency(p.cost)}</span></p>
          {p.delayed > 0 && <p className="text-rose-600 font-semibold">Delayed: {p.delayed} projects</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card flex flex-col justify-between space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Projects by Central Ministry</h3>
          <p className="text-xs text-slate-500">Breakdown by line ministries across Central Sector</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          {data.length} Ministries
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="code"
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="projects" fill="#0284C7" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Leading Nodal Ministry: <strong className="text-slate-900 font-semibold">{chartData[0]?.code || '—'}</strong></span>
        <span className="font-mono text-blue-600 font-bold">{chartData[0]?.projects || 0} Projects</span>
      </div>
    </div>
  );
};
