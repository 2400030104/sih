import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  TrendingDown,
  CheckCircle2,
  Bot,
  Loader2
} from 'lucide-react';
import { aiService, ScenarioSimulationResult } from '../services/aiService';
import { useProjects } from '../hooks/useProjects';
import { PageContainer } from '../components/layout/PageContainer';
import { useToast } from '../components/common/Toast';

export const WhatIfSimulator: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const initialProjectId = searchParams.get('projectId') ? parseInt(searchParams.get('projectId')!) : 14;

  const { projects } = useProjects({ limit: 50 });
  const [selectedProjectId, setSelectedProjectId] = useState<number>(initialProjectId);

  // Scenario Input Controls
  const [progressIncrease, setProgressIncrease] = useState<number>(2.5);
  const [delayReduction, setDelayReduction] = useState<number>(20);
  const [expenditureEfficiency, setExpenditureEfficiency] = useState<number>(5);

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<ScenarioSimulationResult | null>(null);

  const runSimulation = async (projId = selectedProjectId) => {
    if (!projId) return;
    setLoading(true);
    try {
      const res = await aiService.simulateScenario(projId, {
        monthlyProgressIncrease: progressIncrease,
        milestoneDelayReduction: delayReduction,
        expenditureEfficiencyPct: expenditureEfficiency
      });
      setResult(res);
    } catch (err: any) {
      showToast({
        type: 'warning',
        title: 'Simulation Error',
        message: err.message || 'Scenario simulation failed'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedProjectId) {
      runSimulation(selectedProjectId);
    }
  }, [selectedProjectId]);

  const handleResetControls = () => {
    setProgressIncrease(0);
    setDelayReduction(0);
    setExpenditureEfficiency(0);
  };

  return (
    <PageContainer
      title="What-If Scenario Simulator"
      subtitle="Interactive predictive modeling: evaluate the impact of policy interventions, progress acceleration, and milestone de-bottlenecking"
      actions={
        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-btn px-3 py-1.5 shadow-xs text-xs">
          <span className="text-slate-500 font-bold text-[11px]">Target Project:</span>
          <select
            className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer max-w-[240px] truncate"
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(parseInt(e.target.value))}
          >
            {projects.map((p) => (
              <option key={p.project_id} value={p.project_id} className="bg-white text-slate-900">
                #{String(p.project_id).padStart(2, '0')} • {p.project_code} — {p.project_name}
              </option>
            ))}
          </select>
        </div>
      }
    >
      {/* Main Grid: Controls on Left, Live Results on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Controls Panel (5 Columns) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-card p-6 shadow-command-card space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span>Simulated Policy Levers</span>
            </div>
            <button
              onClick={handleResetControls}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Slider 1: Monthly Progress Acceleration */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900">
                Monthly Progress Acceleration
              </label>
              <span className="font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                +{progressIncrease.toFixed(1)}% / month
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="8"
              step="0.5"
              value={progressIncrease}
              onChange={(e) => setProgressIncrease(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-500">
              E.g. Deploying double-shift civil contractors or parallel package execution.
            </p>
          </div>

          {/* Slider 2: Milestone Delay Recovery */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900">
                Milestone Delay Recovery
              </label>
              <span className="font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                -{delayReduction} days
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              step="5"
              value={delayReduction}
              onChange={(e) => setDelayReduction(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-[11px] text-slate-500">
              E.g. Resolving RoW clearance or utility shifting bottlenecks on critical path.
            </p>
          </div>

          {/* Slider 3: Expenditure Efficiency */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900">
                Expenditure & Value Optimization
              </label>
              <span className="font-bold font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                +{expenditureEfficiency}% efficiency
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={expenditureEfficiency}
              onChange={(e) => setExpenditureEfficiency(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <p className="text-[11px] text-slate-500">
              E.g. Value engineering review and tighter contractor claim reconciliations.
            </p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => runSimulation()}
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-btn font-bold text-xs flex items-center justify-center gap-2 shadow-command-card transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Gradient Boosting Models...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Scenario Simulation</span>
              </>
            )}
          </button>

          {/* Safety & Sandbox Notice */}
          <div className="bg-slate-50 rounded-btn p-3.5 border border-slate-200 text-xs text-slate-700 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Non-Destructive Simulation Sandbox</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Simulations evaluate an in-memory feature copy through trained ML models. Live MySQL database records are never modified.
            </p>
          </div>
        </div>

        {/* Results & Comparison Section (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <>
              {/* Top Impact Delta Summary Card */}
              <div
                className={`rounded-card p-6 border shadow-command-card transition-all ${
                  result.delta.improved
                    ? 'bg-white border-blue-200 shadow-command-elevated'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-blue-600">
                      Model-Estimated Scenario Outcome
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {result.projectCode} — {result.projectName}
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate(`/copilot?projectId=${result.projectId}`)}
                    className="text-xs font-bold px-3 py-1.5 rounded-btn bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 flex items-center gap-1 cursor-pointer transition-all shadow-2xs"
                  >
                    <Bot className="w-3.5 h-3.5" /> Ask Copilot
                  </button>
                </div>

                {/* 3 Metric Delta Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 font-mono">
                  {/* Metric 1: Risk Delta */}
                  <div className="bg-slate-50 border border-slate-200 rounded-btn p-4">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Simulated Risk</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        {result.scenario.overallRisk}
                      </span>
                      <span className="text-xs text-slate-500">/ 100</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{result.delta.riskChange} pts vs Base ({result.baseCase.overallRisk})</span>
                    </div>
                  </div>

                  {/* Metric 2: Delay Delta */}
                  <div className="bg-slate-50 border border-slate-200 rounded-btn p-4">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Simulated Delay</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-slate-900">
                        {result.scenario.predictedDelayMonths}
                      </span>
                      <span className="text-xs text-slate-500">months</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{result.delta.delayChangeMonths} mo vs Base ({result.baseCase.predictedDelayMonths}m)</span>
                    </div>
                  </div>

                  {/* Metric 3: Cost Delta */}
                  <div className="bg-slate-50 border border-slate-200 rounded-btn p-4">
                    <div className="text-[10px] font-bold uppercase text-slate-500">Final Forecast Cost</div>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-xl font-black text-slate-900">
                        ₹{result.scenario.predictedFinalCost}
                      </span>
                      <span className="text-xs text-slate-500">Cr</span>
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span>{result.delta.costChangeCr > 0 ? `+${result.delta.costChangeCr}` : result.delta.costChangeCr} Cr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Table */}
              <div className="bg-white border border-slate-200 rounded-card overflow-hidden shadow-command-card">
                <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Current Baseline vs. Simulated Policy Scenario
                  </h3>
                  <span className="text-[10px] font-mono text-blue-600">{result.modelVersion}</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  <div className="grid grid-cols-3 p-4 bg-slate-50/80 font-bold text-slate-500 uppercase text-[10px]">
                    <div>Monitoring Metric</div>
                    <div className="text-center">Current Baseline</div>
                    <div className="text-right text-emerald-600">Simulated Policy</div>
                  </div>

                  <div className="grid grid-cols-3 p-4 items-center">
                    <div className="font-bold text-slate-900">Risk Tier Classification</div>
                    <div className="text-center font-mono font-medium text-slate-700">
                      {result.baseCase.riskLevel}
                    </div>
                    <div className="text-right font-mono font-bold text-emerald-600">
                      {result.scenario.riskLevel}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 p-4 items-center font-mono">
                    <div className="font-bold font-sans text-slate-900">Composite Risk Score</div>
                    <div className="text-center font-medium text-slate-700">
                      {result.baseCase.overallRisk} / 100
                    </div>
                    <div className="text-right font-bold text-emerald-600">
                      {result.scenario.overallRisk} / 100
                    </div>
                  </div>

                  <div className="grid grid-cols-3 p-4 items-center font-mono">
                    <div className="font-bold font-sans text-slate-900">Anticipated Delay</div>
                    <div className="text-center font-medium text-slate-700">
                      {result.baseCase.predictedDelayMonths} months
                    </div>
                    <div className="text-right font-bold text-emerald-600">
                      {result.scenario.predictedDelayMonths} months
                    </div>
                  </div>

                  <div className="grid grid-cols-3 p-4 items-center font-mono">
                    <div className="font-bold font-sans text-slate-900">Forecasted Completion</div>
                    <div className="text-center font-medium text-slate-700">
                      {result.baseCase.predictedCompletionDate}
                    </div>
                    <div className="text-right font-bold text-emerald-600">
                      {result.scenario.predictedCompletionDate}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 p-4 items-center font-mono">
                    <div className="font-bold font-sans text-slate-900">Predicted Final Cost</div>
                    <div className="text-center font-medium text-slate-700">
                      ₹{result.baseCase.predictedFinalCost} Cr
                    </div>
                    <div className="text-right font-bold text-emerald-600">
                      ₹{result.scenario.predictedFinalCost} Cr
                    </div>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-[10px] text-slate-500 italic text-center">
                * {result.limitation}
              </p>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded-card p-12 text-center text-slate-500 text-xs shadow-command-card">
              Select a project and click "Run Scenario Simulation" to view model-evaluated outcomes.
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default WhatIfSimulator;
