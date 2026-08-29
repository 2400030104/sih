import React from 'react';
import { ShieldAlert, AlertTriangle, Clock, Gauge, Cpu } from 'lucide-react';
import { RiskPrediction } from '../../services/types';
import { RiskBadge } from '../common/RiskBadge';

interface RiskOverviewProps {
  risk: RiskPrediction | null;
}

export const RiskOverview: React.FC<RiskOverviewProps> = ({ risk }) => {
  if (!risk) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No active risk telemetry recorded for this project.
      </div>
    );
  }

  const overall = Number(risk.overallRisk || 0);
  const cost = Number(risk.costRisk || 0);
  const time = Number(risk.timeRisk || 0);
  const impl = Number(risk.implementationRisk || 0);
  const confidence = Number(risk.confidenceScore || 0);

  const getRiskStyles = (score: number) => {
    if (score >= 75) return { text: 'text-rose-700', bg: 'bg-rose-600' };
    if (score >= 50) return { text: 'text-orange-700', bg: 'bg-orange-500' };
    if (score >= 25) return { text: 'text-amber-700', bg: 'bg-amber-500' };
    return { text: 'text-emerald-700', bg: 'bg-emerald-600' };
  };

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Predictive Risk Assessment (4-Gauge)</h3>
          </div>
          <p className="text-xs text-slate-500">
            Multi-factor composite risk synthesised by Gradient Boosting Classifiers & TreeSHAP
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">
            {risk.modelName || 'GradientBoosting'} v{risk.modelVersion || '1.2'}
          </span>
          <RiskBadge level={risk.riskLevel} score={overall} size="md" />
        </div>
      </div>

      {/* Main 4-Gauge Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Risk */}
        <div className="p-4 rounded-btn bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Composite Risk</span>
            <Gauge className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className={`text-3xl font-extrabold ${getRiskStyles(overall).text}`}>
              {overall.toFixed(0)}%
            </span>
            <span className="text-[11px] font-bold uppercase text-slate-700">{risk.riskLevel}</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${getRiskStyles(overall).bg}`}
              style={{ width: `${overall}%` }}
            />
          </div>
        </div>

        {/* Cost Risk */}
        <div className="p-4 rounded-btn bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Cost Expansion Risk</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className={`text-3xl font-extrabold ${getRiskStyles(cost).text}`}>
              {cost.toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500">Probability</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${getRiskStyles(cost).bg}`}
              style={{ width: `${cost}%` }}
            />
          </div>
        </div>

        {/* Time Risk */}
        <div className="p-4 rounded-btn bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Schedule Delay Risk</span>
            <Clock className="w-4 h-4 text-orange-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className={`text-3xl font-extrabold ${getRiskStyles(time).text}`}>
              {time.toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500">
              {risk.predictedDelayMonths ? `+${Number(risk.predictedDelayMonths).toFixed(1)} mo` : 'Variance'}
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${getRiskStyles(time).bg}`}
              style={{ width: `${time}%` }}
            />
          </div>
        </div>

        {/* Implementation Risk */}
        <div className="p-4 rounded-btn bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-xs text-slate-500">
            <span className="font-bold uppercase tracking-wider text-[10px]">Execution Bottleneck</span>
            <Cpu className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline justify-between font-mono">
            <span className={`text-3xl font-extrabold ${getRiskStyles(impl).text}`}>
              {impl.toFixed(0)}%
            </span>
            <span className="text-[11px] text-slate-500">Milestone Drag</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${getRiskStyles(impl).bg}`}
              style={{ width: `${impl}%` }}
            />
          </div>
        </div>
      </div>

      {/* Model Rationale & Confidence Bar */}
      {risk.predictionExplanation && (
        <div className="p-4 bg-slate-50 rounded-btn border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold text-slate-900">
            <span>Model Explainability Summary</span>
            <span className="text-blue-600 font-mono text-[11px]">
              Confidence Score: {(confidence * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-slate-600 leading-relaxed">{risk.predictionExplanation}</p>
        </div>
      )}
    </div>
  );
};
