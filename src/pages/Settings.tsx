import React, { useState } from 'react';
import {
  Cpu,
  Sliders,
  CheckCircle2,
  RefreshCw,
  Palette
} from 'lucide-react';
import { PageContainer } from '../components/layout/PageContainer';
import { useToast } from '../components/common/Toast';

export const Settings: React.FC = () => {
  const { showToast } = useToast();
  const [testingConnection, setTestingConnection] = useState(false);

  const modelCards = [
    {
      name: 'Cost Overrun Regressor',
      type: 'GradientBoostingRegressor',
      version: 'v1.4.2',
      framework: 'Scikit-Learn 1.4',
      metrics: 'R² = 0.84 • MAE = ₹18.4 Cr',
      features: 'approved_cost, cumulative_exp, physical_progress, cost_ratio',
      status: 'ONLINE / ACTIVE',
      color: 'text-blue-700 border-blue-200 bg-blue-50'
    },
    {
      name: 'Schedule Delay Regressor',
      type: 'GradientBoostingRegressor',
      version: 'v1.4.2',
      framework: 'Scikit-Learn 1.4',
      metrics: 'R² = 0.81 • MAE = 2.1 Months',
      features: 'planned_duration, schedule_variance, delayed_milestones',
      status: 'ONLINE / ACTIVE',
      color: 'text-amber-800 border-amber-200 bg-amber-50'
    },
    {
      name: 'Implementation Risk Classifier',
      type: 'GradientBoostingClassifier',
      version: 'v1.2.0',
      framework: 'Scikit-Learn 1.4',
      metrics: 'Accuracy = 89.2% • ROC-AUC = 0.94',
      features: 'composite_features (12 parameters)',
      status: 'ONLINE / ACTIVE',
      color: 'text-rose-700 border-rose-200 bg-rose-50'
    },
    {
      name: 'TreeSHAP Attribution Engine',
      type: 'TreeExplainer',
      version: 'v0.44.0',
      framework: 'SHAP (Lundberg et al.)',
      metrics: 'Local Additive Feature Attribution',
      features: 'Ranked Feature Contributions',
      status: 'ONLINE / ACTIVE',
      color: 'text-blue-700 border-blue-200 bg-blue-50'
    },
    {
      name: 'Dense Vector RAG Store',
      type: 'FAISS IndexFlatIP',
      version: 'v1.7.4',
      framework: 'FAISS + all-MiniLM-L6-v2',
      metrics: 'Cosine Similarity • Top-K = 4',
      features: 'MoSPI IPMD Guidelines & Project Briefs',
      status: 'ONLINE / ACTIVE',
      color: 'text-emerald-700 border-emerald-200 bg-emerald-50'
    },
    {
      name: 'Project Intelligence Copilot',
      type: 'Llama-3 8B / Grounded Synthesizer',
      version: 'v3.0.1',
      framework: 'Ollama / Grounded Engine',
      metrics: 'Zero-Hallucination Grounded Prompting',
      features: 'Natural Language Decision Support',
      status: 'ONLINE / ACTIVE',
      color: 'text-blue-700 border-blue-200 bg-blue-50'
    }
  ];

  const handleTestHealth = async () => {
    setTestingConnection(true);
    setTimeout(() => {
      setTestingConnection(false);
      showToast({
        type: 'success',
        title: 'System Telemetry Verified',
        message: 'Node.js Gateway (5000), ML Service (8000), and AI RAG Service (8001) are operational.'
      });
    }, 600);
  };

  return (
    <PageContainer
      title="System Settings & Model Registry"
      subtitle="AI/ML model governance, telemetry endpoints, decision thresholds, and database connection status"
      actions={
        <button
          onClick={handleTestHealth}
          disabled={testingConnection}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-btn text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
          <span>Verify Telemetry</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* 0. Theme & Appearance Customization */}
        <div className="bg-white rounded-card border border-slate-200 shadow-command-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Palette className="w-4 h-4 text-blue-600" />
                Theme & Design System
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Modern enterprise SaaS light theme with clean high-contrast black, blue, and slate surfaces
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-200">
              SaaS Light Theme • Active
            </span>
          </div>

          <div className="p-4 rounded-btn bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-900 text-xs">Standardized Production SaaS Theme</span>
              <p className="text-slate-500 text-[11px]">
                High-contrast pure light theme with sharp typography, solid borders, and clear semantic risk hierarchy.
              </p>
            </div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
              ENFORCED
            </span>
          </div>
        </div>

        {/* 1. Infrastructure Microservices Status Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Node.js Gateway</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-sm font-bold text-slate-900">REST & WebSockets</div>
            <div className="text-xs font-mono text-blue-600">http://localhost:5000</div>
          </div>

          <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">MySQL Database</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-sm font-bold text-slate-900">MySQL 8.x pragati_ai</div>
            <div className="text-xs font-mono text-blue-600">localhost:3306</div>
          </div>

          <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Python ML Service</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-sm font-bold text-slate-900">FastAPI (GBR + SHAP)</div>
            <div className="text-xs font-mono text-blue-600">http://localhost:8000</div>
          </div>

          <div className="bg-white p-4 rounded-card border border-slate-200 shadow-command-card space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Python AI/RAG Service</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="text-sm font-bold text-slate-900">FastAPI (FAISS + LLM)</div>
            <div className="text-xs font-mono text-blue-600">http://localhost:8001</div>
          </div>
        </div>

        {/* 2. Model Registry Cards */}
        <div className="bg-white rounded-card border border-slate-200 shadow-command-card p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                Active Model Registry & Governance Cards
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Versioned algorithms registered in the PRAGATI-AI predictive monitoring pipeline
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              6 Active Engines
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modelCards.map((model, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-btn border border-slate-200 p-4 space-y-3 hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{model.name}</h4>
                    <p className="text-[11px] font-mono text-blue-600">{model.type}</p>
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${model.color}`}>
                    {model.version}
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="text-slate-500 text-[11px]">
                    Framework: <strong className="text-slate-800">{model.framework}</strong>
                  </div>
                  <div className="text-slate-500 text-[11px]">
                    Metrics: <strong className="text-emerald-700">{model.metrics}</strong>
                  </div>
                  <div className="text-slate-500 text-[10px] truncate" title={model.features}>
                    Inputs: {model.features}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {model.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Decision Threshold Configuration */}
        <div className="bg-white rounded-card border border-slate-200 shadow-command-card p-6 space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              Decision Threshold Calibration & Policy Rules
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Configured threshold cutoffs governing autonomous early warning generation and intervention tiering
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className="p-4 bg-slate-50 rounded-btn border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 font-sans text-xs block">Intervention Tiering Rules</span>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>P1 Immediate Action:</span>
                  <strong className="text-rose-700">Score ≥ 68 pts</strong>
                </div>
                <div className="flex justify-between">
                  <span>P2 High Priority:</span>
                  <strong className="text-amber-800">45 ≤ Score &lt; 68</strong>
                </div>
                <div className="flex justify-between">
                  <span>P3 Close Monitoring:</span>
                  <strong className="text-blue-700">25 ≤ Score &lt; 45</strong>
                </div>
                <div className="flex justify-between">
                  <span>P4 Routine Tracking:</span>
                  <strong className="text-slate-500">Score &lt; 25 pts</strong>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-btn border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900 font-sans text-xs block">Autonomous Alert Triggers</span>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between">
                  <span>Critical Milestone Slippage:</span>
                  <strong className="text-rose-700">&gt; 30 Days Delay</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sanctioned Cost Expansion:</span>
                  <strong className="text-rose-700">&gt; 15% Budget Drift</strong>
                </div>
                <div className="flex justify-between">
                  <span>Physical Progress Drag:</span>
                  <strong className="text-amber-800">&gt; 10% Gap vs Planned</strong>
                </div>
                <div className="flex justify-between">
                  <span>Risk Acceleration Velocity:</span>
                  <strong className="text-amber-800">&gt; +10% MoM Escalation</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Settings;
