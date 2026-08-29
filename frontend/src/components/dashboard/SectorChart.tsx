import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SectorMetric } from '../../services/types';
import { formatCurrency } from '../../utils/formatCurrency';

interface SectorChartProps {
  data: SectorMetric[];
}

export const SectorChart: React.FC<SectorChartProps> = ({ data }) => {
  const chartData = data.map((item) => ({
    name: item.sector_name,
    code: item.sector_code,
    projects: Number(item.projectCount),
    cost: Number(item.totalApprovedCost),
    highRisk: Number(item.highRiskCount || 0)
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white text-slate-900 p-3 rounded-card shadow-lg text-xs border border-slate-200 space-y-1">
          <p className="font-bold text-sm text-blue-600">{p.name}</p>
          <p className="text-slate-600">Monitored Projects: <span className="font-bold text-slate-900 font-mono">{p.projects}</span></p>
          <p className="text-slate-600">Sanctioned Outlay: <span className="font-bold text-emerald-700 font-mono">{formatCurrency(p.cost)}</span></p>
          {p.highRisk > 0 && <p className="text-orange-600 font-semibold">High/Critical Risk: {p.highRisk}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card flex flex-col justify-between space-y-4 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Projects by Infrastructure Sector</h3>
          <p className="text-xs text-slate-500">Portfolio capacity across key sectors</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          {data.length} Sectors
        </span>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis
              dataKey="code"
              tick={{ fontSize: 10, fill: '#64748B' }}
              interval={0}
              angle={-25}
              textAnchor="end"
            />
            <YAxis tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="projects" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span>Highest concentration: <strong className="text-slate-900 font-semibold">{chartData[0]?.name || '—'}</strong></span>
        <span className="font-mono text-blue-600 font-bold">{chartData[0]?.projects || 0} Projects</span>
      </div>
    </div>
  );
};
