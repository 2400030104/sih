import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ShieldAlert,
  FileText,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Loader2,
  SlidersHorizontal,
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import { aiService, CopilotMessageResponse } from '../services/aiService';
import { useProjects } from '../hooks/useProjects';
import { RiskBadge } from '../components/common/RiskBadge';
import { formatCurrency, formatPercentage } from '../utils/formatCurrency';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text?: string;
  response?: CopilotMessageResponse;
  loading?: boolean;
}

export const Copilot: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') ? parseInt(searchParams.get('projectId')!) : undefined;

  const [selectedProjectId, setSelectedProjectId] = useState<number | undefined>(initialProjectId);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { projects } = useProjects({ limit: 50 });
  const activeProject = projects.find((p) => p.project_id === selectedProjectId);

  const quickQuestions = [
    'Which projects are currently critical?',
    'Which projects require immediate intervention?',
    selectedProjectId ? `Why is this project high risk?` : 'Why is Project PRJ-0012 high risk?',
    selectedProjectId ? `Summarize this project` : 'Summarize Project PRJ-0012',
    'Which sector has the highest average risk?',
    'What are the standard IPMD milestone delay guidelines?'
  ];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          response: {
            intent: 'GREETING',
            answer: 'Welcome to **PRAGATI-AI Copilot**. I am your grounded decision-support assistant for National Infrastructure monitoring (MoSPI / IPMD). Ask me any question about project risks, cost & schedule predictions, delayed milestones, or intervention priorities.',
            whyEvidence: 'I answer strictly using retrieved PAIMANA project monitoring records, Machine Learning predictive models, and official monitoring guidelines.',
            prediction: 'Predictive intelligence is active across Central Sector Infrastructure Projects.',
            recommendedAction: 'Select a project from the left panel or click one of the suggested query chips below to begin.',
            limitation: 'PRAGATI-AI provides analytical decision support. Outputs are model-assisted and should be reviewed by authorized personnel.',
            evidenceSources: ['MoSPI Infrastructure Monitoring Guidelines', 'PAIMANA Project Database', 'PRAGATI-ML Predictive Models']
          }
        }
      ]);
    }
  }, []);

  const handleSendMessage = async (queryText?: string) => {
    const text = (queryText || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const assistantMsgId = `assistant-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text
      },
      {
        id: assistantMsgId,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        loading: true
      }
    ]);

    setInputMessage('');
    setIsLoading(true);

    try {
      const result = await aiService.askCopilot(text, selectedProjectId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? { ...msg, loading: false, response: result }
            : msg
        )
      );
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                loading: false,
                response: {
                  intent: 'ERROR',
                  answer: `Sorry, I encountered an issue retrieving information: ${err.message || 'Service temporarily unavailable'}`,
                  whyEvidence: 'AI service request could not complete.',
                  limitation: 'Please verify local microservice connectivity.',
                  evidenceSources: []
                }
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col h-[calc(100vh-6.5rem)] space-y-4">
      {/* 3-Column Layout Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0">
        
        {/* Left Column: Context & Project Selector (3 cols) */}
        <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-slate-200 rounded-card shadow-command-card overflow-hidden">
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Target Project Context
            </span>
            <span className="text-[10px] font-mono text-slate-500">{projects.length} Available</span>
          </div>

          {/* Portfolio Option */}
          <div className="p-2 space-y-1 overflow-y-auto flex-1">
            <button
              onClick={() => setSelectedProjectId(undefined)}
              className={`w-full text-left p-2.5 rounded-btn text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                !selectedProjectId
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                  : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>National Portfolio (All)</span>
              </span>
              {!selectedProjectId && <span className="text-[10px] font-mono">ACTIVE</span>}
            </button>

            {/* List of projects */}
            <div className="pt-2 pb-1 px-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Specific Project Focus
            </div>

            {projects.map((p) => (
              <button
                key={p.project_id}
                onClick={() => setSelectedProjectId(p.project_id)}
                className={`w-full text-left p-2.5 rounded-btn text-xs transition-all cursor-pointer block space-y-1 ${
                  selectedProjectId === p.project_id
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[11px] text-blue-600">{p.project_code}</span>
                  <RiskBadge level={p.risk_level} score={p.overall_risk} size="sm" />
                </div>
                <div className="font-semibold truncate text-slate-900 text-[11px]">{p.project_name}</div>
                <div className="text-[10px] text-slate-500 truncate">{p.sector_name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Center Column: Interactive Conversational Stream (6 cols or 9 cols) */}
        <div className={`flex flex-col bg-white border border-slate-200 rounded-card shadow-command-card overflow-hidden ${activeProject ? 'lg:col-span-6' : 'lg:col-span-9'}`}>
          {/* Header Bar */}
          <div className="p-3.5 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-btn bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-slate-900">PRAGATI-AI Intelligence Copilot</h2>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    GROUNDED RAG
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Context: <strong className="text-blue-600">{activeProject ? `${activeProject.project_code} — ${activeProject.project_name}` : 'National Portfolio (All Projects)'}</strong>
                </p>
              </div>
            </div>

            <button
              onClick={handleClearChat}
              className="p-1.5 rounded-btn border border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Reset Conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-btn bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-card p-4 text-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none font-semibold shadow-xs'
                      : 'bg-white border border-slate-200 rounded-tl-none text-slate-700 space-y-3 shadow-command-card'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  ) : msg.loading ? (
                    <div className="flex items-center gap-2.5 py-2 text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-xs font-semibold">Retrieving facts & synthesizing grounded answer...</span>
                    </div>
                  ) : (
                    msg.response && (
                      <>
                        {/* Main Text Output */}
                        <div className="text-xs sm:text-sm text-slate-900 leading-relaxed whitespace-pre-wrap font-normal">
                          {msg.response.answer}
                        </div>

                        {/* Factual Evidence Box */}
                        {msg.response.whyEvidence && (
                          <div className="bg-slate-50 border-l-2 border-blue-600 p-3 rounded-r-btn space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Factual Retrieval Basis</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {msg.response.whyEvidence}
                            </p>
                          </div>
                        )}

                        {/* Predictive Model Section */}
                        {msg.response.prediction && msg.response.prediction !== 'N/A' && (
                          <div className="bg-amber-50 border-l-2 border-amber-500 p-3 rounded-r-btn space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                              <ShieldAlert className="w-3 h-3" />
                              <span>Model-Estimated Prediction</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {msg.response.prediction}
                            </p>
                          </div>
                        )}

                        {/* Recommended Action */}
                        {msg.response.recommendedAction && (
                          <div className="bg-emerald-50 border-l-2 border-emerald-600 p-3 rounded-r-btn space-y-1">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                              <Lightbulb className="w-3 h-3" />
                              <span>Policy Intervention Recommendation</span>
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed">
                              {msg.response.recommendedAction}
                            </p>
                          </div>
                        )}

                        {/* Grounded Source Citations */}
                        {msg.response.evidenceSources && msg.response.evidenceSources.length > 0 && (
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                              <BookOpen className="w-2.5 h-2.5" /> Sources Cited
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {msg.response.evidenceSources.map((source, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1 font-mono"
                                >
                                  <FileText className="w-2.5 h-2.5 text-blue-600" />
                                  <span className="truncate max-w-[220px]">{source}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Disclaimer */}
                        {msg.response.limitation && (
                          <p className="text-[10px] text-slate-400 italic pt-1">
                            * {msg.response.limitation}
                          </p>
                        )}
                      </>
                    )
                  )}

                  <div className="text-[9px] font-mono text-slate-400 text-right">
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Chips */}
          <div className="p-2 border-t border-slate-200 bg-slate-50 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-slate-500 font-bold text-[10px] flex items-center gap-1 shrink-0 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-blue-600" /> Queries:
              </span>
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  disabled={isLoading}
                  className="px-2.5 py-1 rounded bg-white hover:bg-slate-100 hover:text-blue-600 border border-slate-200 text-slate-700 text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer disabled:opacity-50 shadow-2xs"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Form Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t border-slate-200 bg-white shrink-0"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 rounded-btn pl-3.5 pr-20 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all shadow-xs"
                placeholder={
                  selectedProjectId
                    ? `Ask about project #${selectedProjectId} (e.g. 'Why is it delayed?', 'Summarize risk')...`
                    : "Ask anything about national projects (e.g. 'Which projects need intervention?')..."
                }
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Context Inspector Dossier (3 cols, only if project selected) */}
        {activeProject && (
          <div className="hidden lg:flex lg:col-span-3 flex-col bg-white border border-slate-200 rounded-card shadow-command-card p-4 space-y-4 overflow-y-auto">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase block">Active Dossier</span>
              <h3 className="text-sm font-bold text-slate-900 leading-tight mt-0.5">{activeProject.project_name}</h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{activeProject.sector_name} • {activeProject.state_name}</p>
            </div>

            {/* Quick Metrics */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Approved Cost:</span>
                <span className="font-bold text-slate-900">{formatCurrency(activeProject.approved_cost)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">Physical Progress:</span>
                <span className="font-bold text-emerald-700">{formatPercentage(activeProject.physical_progress)}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-50 border border-slate-200">
                <span className="text-slate-500">AI Risk Score:</span>
                <RiskBadge level={activeProject.risk_level} score={activeProject.overall_risk} size="sm" />
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <Link
                to={`/projects/${activeProject.project_id}`}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 rounded-btn text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span>View Full 360° Dossier</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/scenarios?projectId=${activeProject.project_id}`}
                className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-btn text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Simulate What-If</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Copilot;
