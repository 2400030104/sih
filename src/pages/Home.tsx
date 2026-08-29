import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  SlidersHorizontal,
  Bot,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  Building2,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
  Mail,
  User,
  ShieldCheck,
  Zap,
  ChevronRight,
  Key
} from 'lucide-react';
import { useToast } from '../components/common/Toast';

interface DemoUser {
  id: string;
  role: string;
  name: string;
  email: string;
  department: string;
  badgeColor: string;
  description: string;
}

const DEMO_USERS: DemoUser[] = [
  {
    id: 'officer',
    role: 'IPMD Nodal Officer',
    name: 'Dr. Rajesh Sharma',
    email: 'officer@mospi.gov.in',
    department: 'MoSPI / Central Command Desk',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    description: 'Full portfolio oversight, priority queuing, and national early warning telemetry.'
  },
  {
    id: 'reviewer',
    role: 'Ministry Reviewer',
    name: 'Pooja Verma, IES',
    email: 'reviewer@railways.gov.in',
    department: 'Ministry of Railways & MORTH',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    description: 'Sector capital allocation, milestone slippage reviews, and inter-agency coordination.'
  },
  {
    id: 'director',
    role: 'Project Director',
    name: 'Er. Anand Kulkarni',
    email: 'director@nhai.gov.in',
    department: 'NHAI / Project Execution Unit',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'Asset 360° dossier management, contractor S-curves, and local risk factor attribution.'
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [selectedUser, setSelectedUser] = useState<DemoUser>(DEMO_USERS[0]);
  const [email, setEmail] = useState<string>(DEMO_USERS[0].email);
  const [password, setPassword] = useState<string>('pragati@2026');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectDemoUser = (user: DemoUser) => {
    setSelectedUser(user);
    setEmail(user.email);
    setPassword('pragati@2026');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      showToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${selectedUser.name} (${selectedUser.role}). Command desk active.`
      });
      navigate('/dashboard');
    }, 400);
  };

  const capabilities = [
    {
      title: 'Command Center & Live Radar',
      description: 'Unified operational dashboard with interactive national geospatial map, live telemetry stream, and sector-wide financial metrics.',
      path: '/dashboard',
      icon: LayoutDashboard,
      badge: 'Live Radar',
    },
    {
      title: '360° Infrastructure Dossiers',
      description: 'Comprehensive project monitoring profiles, contractual milestone matrices, cost burn curves, and physical progress S-curves.',
      path: '/projects',
      icon: FolderKanban,
      badge: '₹150+ Cr Assets',
    },
    {
      title: 'Predictive Risk Intelligence',
      description: 'Gradient Boosting models predicting schedule delays, cost drift probability, and multi-month risk velocity acceleration.',
      path: '/risk-analytics',
      icon: ShieldAlert,
      badge: 'ML Forecasting',
    },
    {
      title: 'Intervention Priority Queue',
      description: 'Autonomous multi-factor ranking (P1–P4) based on composite risk severity, financial exposure, and critical path milestone slippage.',
      path: '/interventions',
      icon: AlertOctagon,
      badge: 'Task Force Action',
    },
    {
      title: 'PRAGATI-AI Intelligence Copilot',
      description: 'Grounded RAG conversational assistant delivering factual decision support backed by MoSPI guidelines and live project records.',
      path: '/copilot',
      icon: Bot,
      badge: 'Grounded RAG',
    },
    {
      title: 'What-If Policy Simulator',
      description: 'Interactive non-destructive sandbox to model outcomes of civil acceleration, milestone recovery, and expenditure optimization.',
      path: '/scenarios',
      icon: SlidersHorizontal,
      badge: 'Policy Sandbox',
    }
  ];

  const sectors = [
    { name: 'Indian Railways', code: 'RAIL', projects: '18 Projects', cost: '₹1,42,500 Cr' },
    { name: 'Road Transport & Highways', code: 'ROAD', projects: '14 Projects', cost: '₹98,200 Cr' },
    { name: 'Power & Renewable Energy', code: 'POW', projects: '9 Projects', cost: '₹64,800 Cr' },
    { name: 'Petroleum & Natural Gas', code: 'PET', projects: '6 Projects', cost: '₹47,300 Cr' },
    { name: 'Urban Transport & Metro', code: 'URB', projects: '5 Projects', cost: '₹32,100 Cr' },
    { name: 'Shipping & Ports', code: 'PORT', projects: '4 Projects', cost: '₹19,400 Cr' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* 1. Standalone Top Header Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Info */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-lg tracking-tight">PRAGATI</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                  AI 2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-tight truncate hidden sm:block">
                National Infrastructure Monitoring • MoSPI / IPMD
              </p>
            </div>
          </Link>

          {/* Quick Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#overview" className="hover:text-blue-600 transition-colors">Overview</a>
            <a href="#capabilities" className="hover:text-blue-600 transition-colors">Capabilities</a>
            <a href="#sectors" className="hover:text-blue-600 transition-colors">Sectors</a>
            <a href="#pipeline" className="hover:text-blue-600 transition-colors">AI Pipeline</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Launch Command Center</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12" id="overview">
        {/* 2. Hero Section + Interactive Demo Login Portal */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Hero Copy & National Macro Metrics (7 Columns) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                Government of India • MoSPI / IPMD
              </span>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Central Sector Monitoring
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Autonomous Early Warning &amp; Predictive Infrastructure Intelligence
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl">
              Empowering national infrastructure governance with machine learning risk forecasting, TreeSHAP root-cause feature attribution, grounded RAG Copilot, and real-time project telemetry across ₹150+ Cr Central Sector investments.
            </p>

            {/* Macro Stats Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Tracked Outlay</span>
                <span className="text-base sm:text-lg font-black font-mono text-slate-900">₹3.84L+ Cr</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Major Assets</span>
                <span className="text-base sm:text-lg font-black font-mono text-blue-600">50+ Projects</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">AI Risk Model</span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-700">0.94 ROC-AUC</span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-0.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Live Telemetry</span>
                <span className="text-base sm:text-lg font-black font-mono text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> ACTIVE
                </span>
              </div>
            </div>

            {/* Quick Explore CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <FolderKanban className="w-4 h-4 text-blue-600" />
                <span>Explore 360° Directory</span>
              </Link>
              <Link
                to="/copilot"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Ask AI Copilot</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Demo Login Card (5 Columns) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-7 space-y-5 relative">
              {/* Header */}
              <div className="space-y-1 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      <Key className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Official Portal Login</h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    DEMO ACCESS
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Select a pre-configured official profile to auto-populate demo credentials:
                </p>
              </div>

              {/* 1-Click Role Profiles Switcher */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Select Demo Role:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {DEMO_USERS.map((user) => {
                    const isSelected = selectedUser.id === user.id;
                    return (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => handleSelectDemoUser(user)}
                        className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-300 ring-1 ring-blue-500/20'
                            : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{user.name}</span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${user.badgeColor}`}>
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate max-w-[240px]">{user.department}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <CheckCircle2 className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-3.5 pt-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Official Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Access Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isSubmitting ? (
                    <span>Authenticating Credentials...</span>
                  ) : (
                    <>
                      <span>Enter Command Desk as {selectedUser.role}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 text-center">
                Demo Credentials: Password is pre-filled as <code className="font-mono text-slate-800 font-bold">pragati@2026</code>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Platform Capabilities Bento Grid */}
        <section className="space-y-5" id="capabilities">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Decision Intelligence Capabilities</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Autonomous analytical and predictive modules for high-level infrastructure oversight
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <Link
                  key={idx}
                  to={cap.path}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-command-card hover:border-slate-300 hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {cap.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {cap.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {cap.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                    <span>Launch Module</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Central Infrastructure Sectors */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-command-card space-y-4" id="sectors">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                Central Sector Key Infrastructure Domains
              </h2>
              <p className="text-xs text-slate-500">Major public sector capital expenditure programs monitored across line ministries</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              All Sectors <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {sectors.map((sec, idx) => (
              <Link
                key={idx}
                to={`/projects?sector=${sec.code}`}
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left space-y-1 block group"
              >
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block">{sec.code}</span>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 truncate">{sec.name}</h4>
                <p className="text-[11px] text-slate-500">{sec.projects}</p>
                <p className="text-[10px] font-mono font-bold text-slate-700">{sec.cost}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. Decision Intelligence Pipeline */}
        <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4" id="pipeline">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
            PRAGATI-AI Decision Architecture Workflow
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
              <span className="font-mono font-black text-blue-600 text-sm">01</span>
              <h4 className="font-bold text-slate-900">PAIMANA Telemetry Ingestion</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Continuous sync of monthly financial burns, physical S-curves, and critical milestone dates.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
              <span className="font-mono font-black text-blue-600 text-sm">02</span>
              <h4 className="font-bold text-slate-900">ML Gradient Boosting &amp; SHAP</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Predictive regressors and classifiers calculate delay probabilities and exact root-cause drivers.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
              <span className="font-mono font-black text-blue-600 text-sm">03</span>
              <h4 className="font-bold text-slate-900">Intervention Prioritization</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Multi-factor ranking organizes task force focus into P1 (Immediate) through P4 (Routine) action tiers.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5 shadow-2xs">
              <span className="font-mono font-black text-blue-600 text-sm">04</span>
              <h4 className="font-bold text-slate-900">Grounded Copilot RAG</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Zero-hallucination conversational interface delivers grounded MoSPI policy and project analysis.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Standalone Landing Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">PRAGATI-AI 2.0</span>
            <span>•</span>
            <span>Ministry of Statistics and Programme Implementation (MoSPI)</span>
          </div>
          <p className="text-slate-400 text-[11px]">
            Infrastructure and Project Monitoring Division (IPMD) • ₹150+ Cr Central Sector Monitoring
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
