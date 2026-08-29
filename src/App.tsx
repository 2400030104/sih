import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './components/common/Toast';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { Interventions } from './pages/Interventions';
import { RiskAnalytics } from './pages/RiskAnalytics';
import { WhatIfSimulator } from './pages/WhatIfSimulator';
import { Copilot } from './pages/Copilot';
import { Alerts } from './pages/Alerts';
import { Recommendations } from './pages/Recommendations';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

const AppShellLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col antialiased text-slate-900">
      {/* Responsive Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col flex-1 min-w-0">
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          activeAlertCount={6}
        />

        <main className="flex-1 pb-16">
          <Outlet />
        </main>

        {/* Bottom Decision Support Banner */}
        <footer className="fixed bottom-0 right-0 left-0 lg:left-64 bg-white border-t border-slate-200 text-[11px] text-slate-500 py-2 px-4 flex items-center justify-between z-10 shadow-xs">
          <span className="truncate font-medium">
            PRAGATI-AI Decision Support System • MoSPI / IPMD Central Sector Infrastructure Monitoring
          </span>
          <span className="text-slate-400 hidden sm:inline text-[10px]">
            * Analytical and model-assisted outputs for official review
          </span>
        </footer>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <SocketProvider>
        <ToastProvider>
          <Router>
            <Routes>
              {/* Standalone Full-Width Home Landing & Demo Login Portal (No Sidebar) */}
              <Route path="/" element={<Home />} />

              {/* Authenticated Dashboard App Shell with Sidebar & Header */}
              <Route element={<AppShellLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetails />} />
                <Route path="/interventions" element={<Interventions />} />
                <Route path="/risk-analytics" element={<RiskAnalytics />} />
                <Route path="/scenarios" element={<WhatIfSimulator />} />
                <Route path="/copilot" element={<Copilot />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Router>
        </ToastProvider>
      </SocketProvider>
    </ThemeProvider>
  );
};

export default App;
