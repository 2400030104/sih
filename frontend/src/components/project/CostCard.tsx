import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { MonthlyData } from '../../services/types';
import { formatDate } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';

interface CostCardProps {
  monthlyData: MonthlyData[];
  approvedCost: number;
}

export const CostCard: React.FC<CostCardProps> = ({ monthlyData, approvedCost }) => {
  if (!monthlyData || monthlyData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No monthly financial burn records available.
      </div>
    );
  }

  const chartData = [...monthlyData]
    .sort((a, b) => new Date(a.reporting_month).getTime() - new Date(b.reporting_month).getTime())
    .map((item) => ({
      date: formatDate(item.reporting_month, 'monthYear'),
      expenditure: Number(item.cumulative_expenditure || 0),
      approved: Number(approvedCost || 0)
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white text-slate-900 p-3 rounded-card shadow-lg text-xs border border-slate-200 space-y-1 font-mono">
          <p className="font-bold text-slate-900 mb-1">{label}</p>
          <p className="text-emerald-700 font-semibold">
            Cumulative Spend: <span className="font-bold">{formatCurrency(payload[0].value)}</span>
          </p>
          <p className="text-slate-600">
            Approved Outlay: <span className="font-bold">{formatCurrency(approvedCost)}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Cumulative Financial Expenditure</h3>
          <p className="text-xs text-slate-500">Fund utilization vs sanctioned budget</p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748B' }}
              tickFormatter={(val) => `₹${(val / 100).toFixed(0)}Cr`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="expenditure"
              name="Cumulative Spend"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSpend)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
