import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { RiskPrediction } from '../../services/types';
import { formatDate } from '../../utils/formatDate';

interface RiskTrendChartProps {
  history: RiskPrediction[];
}

export const RiskTrendChart: React.FC<RiskTrendChartProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No chronological risk trajectory logged for this project.
      </div>
    );
  }

  const chartData = [...history]
    .sort((a, b) => new Date(a.predictionDate).getTime() - new Date(b.predictionDate).getTime())
    .map((item) => ({
      date: formatDate(item.predictionDate, 'monthYear'),
      overall: Number(item.overallRisk),
      cost: Number(item.costRisk),
      time: Number(item.timeRisk)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-900 p-3 rounded-card shadow-lg text-xs border border-slate-200 space-y-1 font-mono">
          <p className="font-bold text-slate-900 mb-1">{label}</p>
          {payload.map((p: any) => (
            <div key={p.name} className="flex justify-between gap-4">
              <span style={{ color: p.color }} className="font-semibold">{p.name}:</span>
              <span className="font-bold">{Number(p.value).toFixed(1)}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Historical Risk Trajectory</h3>
          <p className="text-xs text-slate-500">Multi-period trend calibration across Cost, Schedule, and Composite Risk</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              height={36}
              formatter={(value) => <span className="text-xs font-semibold text-slate-600">{value}</span>}
            />
            <Line
              type="monotone"
              dataKey="overall"
              name="Composite Risk"
              stroke="#2563EB"
              strokeWidth={3}
              dot={{ r: 4, fill: '#2563EB', strokeWidth: 2, stroke: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey="cost"
              name="Cost Risk"
              stroke="#EA580C"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="time"
              name="Schedule Risk"
              stroke="#D97706"
              strokeWidth={2}
              strokeDasharray="2 2"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
