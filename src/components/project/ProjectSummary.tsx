import React from 'react';
import { Coins, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { ProjectDetails, MonthlyData, RiskPrediction } from '../../services/types';
import { formatCurrency, formatPercentage } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface ProjectSummaryProps {
  project: ProjectDetails;
  latestMonthly: MonthlyData | null;
  latestRisk: RiskPrediction | null;
}

export const ProjectSummary: React.FC<ProjectSummaryProps> = ({
  project,
  latestMonthly,
  latestRisk
}) => {
  const approvedCost = Number(project.approved_cost || 0);
  const revisedCost = project.revised_cost ? Number(project.revised_cost) : null;
  const cumulativeExp = latestMonthly ? Number(latestMonthly.cumulative_expenditure) : Number(project.cumulative_expenditure || 0);
  const physicalProgress = latestMonthly ? Number(latestMonthly.physical_progress) : Number(project.physical_progress || 0);
  const financialProgress = latestMonthly ? Number(latestMonthly.financial_progress) : Number(project.financial_progress || 0);
  const plannedProgress = latestMonthly ? Number(latestMonthly.planned_progress) : 0;
  const scheduleVariance = latestMonthly ? Number(latestMonthly.schedule_variance_days) : 0;

  const costOverrun = revisedCost ? revisedCost - approvedCost : 0;
  const costOverrunPercent = approvedCost > 0 && costOverrun > 0 ? (costOverrun / approvedCost) * 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Sanctioned & Revised Budget */}
      <div className="bg-white p-5 rounded-card border border-slate-200 shadow-command-card space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">Sanctioned Outlay</span>
          <Coins className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-2xl font-extrabold font-mono text-slate-900">{formatCurrency(approvedCost)}</h3>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Revised:</span>
          <span className={`font-mono font-bold ${costOverrun > 0 ? 'text-rose-600' : 'text-slate-700'}`}>
            {revisedCost ? formatCurrency(revisedCost) : 'No Revision'}
            {costOverrun > 0 && ` (+${costOverrunPercent.toFixed(1)}%)`}
          </span>
        </div>
      </div>

      {/* 2. Cumulative Expenditure & Spend */}
      <div className="bg-white p-5 rounded-card border border-slate-200 shadow-command-card space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">Total Expenditure</span>
          <TrendingUp className="w-4 h-4 text-emerald-600" />
        </div>
        <h3 className="text-2xl font-extrabold font-mono text-slate-900">{formatCurrency(cumulativeExp)}</h3>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Financial Progress:</span>
          <span className="font-mono font-bold text-blue-600">{formatPercentage(financialProgress)}</span>
        </div>
      </div>

      {/* 3. Physical Progress vs Target */}
      <div className="bg-white p-5 rounded-card border border-slate-200 shadow-command-card space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">Physical Progress</span>
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-extrabold font-mono text-slate-900">{formatPercentage(physicalProgress)}</h3>
          {plannedProgress > 0 && (
            <span className="text-xs text-slate-400 font-mono">/ Target: {formatPercentage(plannedProgress)}</span>
          )}
        </div>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Execution Lag:</span>
          <span className={`font-mono font-bold ${plannedProgress > physicalProgress ? 'text-amber-700' : 'text-emerald-600'}`}>
            {plannedProgress > physicalProgress ? `-${(plannedProgress - physicalProgress).toFixed(1)}% behind` : 'On schedule'}
          </span>
        </div>
      </div>

      {/* 4. Target Completion & Variance */}
      <div className="bg-white p-5 rounded-card border border-slate-200 shadow-command-card space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
          <span className="font-bold uppercase tracking-wider text-[10px]">Target Completion</span>
          <Calendar className="w-4 h-4 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold font-mono text-slate-900">{formatDate(project.planned_completion_date)}</h3>
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500">Predicted Delay:</span>
          <span className={`font-mono font-bold ${latestRisk?.predictedDelayMonths ? 'text-rose-600' : 'text-slate-700'}`}>
            {latestRisk?.predictedDelayMonths ? `+${Number(latestRisk.predictedDelayMonths).toFixed(1)} Months` : scheduleVariance > 0 ? `+${scheduleVariance} Days` : '0 Months'}
          </span>
        </div>
      </div>
    </div>
  );
};
