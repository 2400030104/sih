import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { RiskDistributionMetric } from '../../services/types';

interface RiskDistributionProps {
  data: RiskDistributionMetric[];
  totalProjects: number;
}

const RISK_COLORS: Record<string, string> = {
  LOW: '#059669',       // Emerald
  MEDIUM: '#D97706',    // Amber
  HIGH: '#EA580C',      // Orange
  CRITICAL: '#DC2626'   // Red
};

export const RiskDistribution: React.FC<RiskDistributionProps> = ({ data, totalProjects }) => {
  const navigate = useNavigate();

  const chartData = data.map((item) => ({
    name: item.riskLevel,
    value: Number(item.count),
    color: RISK_COLORS[item.riskLevel] || '#64748B',
    avgScore: item.avgRiskScore,
    avgDelay: item.avgPredictedDelayMonths
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white text-slate-900 p-3 rounded-card shadow-lg text-xs border border-slate-200">
          <p className="font-bold text-sm flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
            {p.name} Risk Tier
          </p>
          <div className="mt-2 space-y-1 text-slate-600 font-mono">
            <p>Projects: <span className="font-bold text-slate-900">{p.value}</span> ({((p.value / (totalProjects || 1)) * 100).toFixed(1)}%)</p>
            <p>Avg Risk Score: <span className="font-bold text-blue-600">{Number(p.avgScore).toFixed(1)}%</span></p>
            {p.avgDelay > 0 && <p>Avg Predicted Delay: <span className="font-bold text-amber-700">+{Number(p.avgDelay).toFixed(1)} mo</span></p>}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Portfolio Risk Distribution</h3>
          <p className="text-xs text-slate-500">4-Tier Gradient Boosting Risk Classification</p>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          {totalProjects} Monitored
        </span>
      </div>

      <div className="h-64 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
              cursor="pointer"
              onClick={(entry) => navigate(`/projects?risk=${entry.name.toLowerCase()}`)}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={3} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-xs font-semibold text-slate-600">
                  {value} ({entry.payload.value})
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
        {chartData.map((d) => (
          <button
            key={d.name}
            onClick={() => navigate(`/projects?risk=${d.name.toLowerCase()}`)}
            className="p-2 rounded-btn bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-center cursor-pointer"
          >
            <p className="text-[10px] font-mono font-black" style={{ color: d.color }}>{d.name}</p>
            <p className="text-sm font-black font-mono text-slate-900">{d.value}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
