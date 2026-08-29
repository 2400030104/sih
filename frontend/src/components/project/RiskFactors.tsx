import React from 'react';
import { Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { RiskFactor } from '../../services/types';

interface RiskFactorsProps {
  factors: RiskFactor[];
}

export const RiskFactors: React.FC<RiskFactorsProps> = ({ factors }) => {
  if (!factors || factors.length === 0) {
    return (
      <div className="bg-white p-6 rounded-card border border-slate-200 text-center text-slate-500 text-xs shadow-command-card">
        No factor attribution features recorded for this prediction model.
      </div>
    );
  }

  // Sort by impact
  const sortedFactors = [...factors].sort(
    (a, b) => Math.abs(Number(b.impact || 0)) - Math.abs(Number(a.impact || 0))
  );

  return (
    <div className="bg-white p-6 rounded-card border border-slate-200 shadow-command-card space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Key Risk Drivers (TreeSHAP Attributions)</h3>
          </div>
          <p className="text-xs text-slate-500">Root-cause contributors pushing project risk up or pulling it down</p>
        </div>
        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-badge border border-slate-200">
          SHAP Analysis
        </span>
      </div>

      <div className="space-y-3">
        {sortedFactors.map((factor, index) => {
          const impact = Number(factor.impact || 0);
          const isNegative = factor.direction === 'NEGATIVE'; // Negative impact reduces risk
          const absWeight = Math.min(100, Math.abs(impact) * 100);

          return (
            <div
              key={index}
              className="p-3.5 rounded-btn bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  {isNegative ? (
                    <ArrowDownRight className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{factor.factor}</span>
                </div>
                <span
                  className={`font-mono font-bold text-xs ${
                    isNegative ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isNegative ? '-' : '+'}{Math.abs(impact).toFixed(2)} SHAP
                </span>
              </div>

              {/* Relative Weight Bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isNegative ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.max(5, absWeight)}%` }}
                />
              </div>

              {factor.explanation && (
                <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
                  {factor.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
