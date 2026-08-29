import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  Layers,
  Coins,
  Clock,
  ShieldAlert,
  Calendar,
  BellRing,
  FileSpreadsheet
} from 'lucide-react';
import {
  getProjectOverview,
  getProjectMonthly,
  getProjectRiskHistory,
  getProjectTimeline,
  acknowledgeAlert,
  resolveAlert,
  updateRecommendationStatus
} from '../services/api';
import {
  ProjectOverview360,
  MonthlyData,
  RiskPrediction,
  TimelineEvent
} from '../services/types';
import { useSocket } from '../context/SocketContext';
import useRealtimeEvent from '../hooks/useRealtimeEvent';
import { PageContainer } from '../components/layout/PageContainer';
import { ProjectHeader } from '../components/project/ProjectHeader';
import { ProjectSummary } from '../components/project/ProjectSummary';
import { RiskOverview } from '../components/project/RiskOverview';
import { RiskTrendChart } from '../components/project/RiskTrendChart';
import { RiskFactors } from '../components/project/RiskFactors';
import { ProgressCard } from '../components/project/ProgressCard';
import { CostCard } from '../components/project/CostCard';
import { MilestoneTable } from '../components/project/MilestoneTable';
import { Timeline } from '../components/project/Timeline';
import { AlertList } from '../components/project/AlertList';
import { RecommendationList } from '../components/project/RecommendationList';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { AIProjectBrief } from '../components/project/AIProjectBrief';
import { UpdateAmountModal } from '../components/project/UpdateAmountModal';

type ActiveTab = 'overview' | 'financial' | 'schedule' | 'risk' | 'milestones' | 'alerts' | 'timeline';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { joinRoom, leaveRoom } = useSocket();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [overview, setOverview] = useState<ProjectOverview360 | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [riskHistory, setRiskHistory] = useState<RiskPrediction[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateAmountOpen, setIsUpdateAmountOpen] = useState<boolean>(false);

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchProjectData = useCallback(async (isBackgroundUpdate = false) => {
    if (!id) return;
    if (!isBackgroundUpdate) {
      setLoading(true);
    }
    setError(null);
    try {
      const [overviewRes, monthlyRes, riskHistRes, timelineRes] = await Promise.all([
        getProjectOverview(id),
        getProjectMonthly(id),
        getProjectRiskHistory(id),
        getProjectTimeline(id)
      ]);

      setOverview(overviewRes);
      setMonthlyData(monthlyRes);
      setRiskHistory(riskHistRes);
      setTimelineEvents(timelineRes.timeline || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load project 360 overview');
    } finally {
      if (!isBackgroundUpdate) {
        setLoading(false);
      }
    }
  }, [id]);

  // Initial load and Room subscription
  useEffect(() => {
    if (id) {
      joinRoom('project', id);
    }
    fetchProjectData();

    return () => {
      if (id) {
        leaveRoom('project', id);
      }
    };
  }, [id, fetchProjectData, joinRoom, leaveRoom]);

  // Real-time update handler for this specific project
  const handleProjectRealtimeEvent = useCallback(
    (payload: any) => {
      if (payload.data?.projectId && String(payload.data.projectId) !== String(id)) {
        return;
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        fetchProjectData(true);
      }, 400);
    },
    [id, fetchProjectData]
  );

  // Subscribe to real-time events scoped to this project
  useRealtimeEvent('PROJECT_UPDATED', handleProjectRealtimeEvent);
  useRealtimeEvent('MONTHLY_DATA_ADDED', handleProjectRealtimeEvent);
  useRealtimeEvent('MILESTONE_UPDATED', handleProjectRealtimeEvent);
  useRealtimeEvent('RISK_PREDICTION_UPDATED', handleProjectRealtimeEvent);
  useRealtimeEvent('ALERT_TRIGGERED', handleProjectRealtimeEvent);

  const handleAcknowledgeAlert = async (alertId: number) => {
    try {
      await acknowledgeAlert(alertId);
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          activeAlerts: prev.activeAlerts.map((a) =>
            a.alert_id === alertId ? { ...a, alert_status: 'ACKNOWLEDGED' as any } : a
          )
        };
      });
    } catch (err: any) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  const handleResolveAlert = async (alertId: number) => {
    try {
      await resolveAlert(alertId, 1);
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          activeAlerts: prev.activeAlerts.filter((a) => a.alert_id !== alertId)
        };
      });
    } catch (err: any) {
      console.error('Failed to resolve alert:', err);
    }
  };

  const handleRecommendationStatus = async (recId: number, status: string) => {
    try {
      await updateRecommendationStatus(recId, status);
      setOverview((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          activeRecommendations: prev.activeRecommendations.map((r) =>
            r.recommendation_id === recId ? { ...r, recommendation_status: status as any } : r
          )
        };
      });
    } catch (err: any) {
      console.error('Failed to update recommendation status:', err);
    }
  };

  if (loading && !overview) {
    return (
      <PageContainer>
        <Loading type="page" message="Synthesizing Project 360° Intelligence Dossier..." />
      </PageContainer>
    );
  }

  if (error || !overview) {
    return (
      <PageContainer>
        <ErrorMessage
          message={error || `Project #${id} could not be retrieved from monitoring records.`}
          onRetry={() => fetchProjectData(false)}
        />
      </PageContainer>
    );
  }

  const { project, latestMonthlyData, latestRisk, riskFactors, milestones, activeAlerts, activeRecommendations } = overview;

  return (
    <PageContainer className="space-y-6">
      {/* 1. Project Master Header */}
      <ProjectHeader
        project={project}
        riskLevel={latestRisk?.riskLevel || project.risk_level}
        overallRisk={latestRisk?.overallRisk ?? project.overall_risk}
        onUpdateAmount={() => setIsUpdateAmountOpen(true)}
      />

      {/* 2. Command Center Section Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Full 360° View</span>
        </button>

        <button
          onClick={() => setActiveTab('risk')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'risk'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Risk &amp; SHAP Drivers</span>
        </button>

        <button
          onClick={() => setActiveTab('financial')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'financial'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-3.5 h-3.5 text-blue-600" />
          <span>Financials &amp; Spend</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'schedule'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>Schedule &amp; S-Curve</span>
        </button>

        <button
          onClick={() => setActiveTab('milestones')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'milestones'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          <span>Milestones ({milestones.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'alerts'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BellRing className="w-3.5 h-3.5 text-rose-600" />
          <span>Alerts &amp; Actions ({activeAlerts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-3.5 py-2 rounded-btn text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'timeline'
              ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-cyan-accent" />
          <span>Audit Timeline</span>
        </button>
      </div>

      {/* 3. Tab Contents */}
      {/* Tab: 360 Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ProjectSummary project={project} latestMonthly={latestMonthlyData} latestRisk={latestRisk} />
          
          <AIProjectBrief
            projectId={project.project_id}
            projectCode={project.project_code}
            projectName={project.project_name}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskOverview risk={latestRisk} />
            <RiskTrendChart history={riskHistory} />
          </div>

          <RiskFactors factors={riskFactors} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressCard monthlyData={monthlyData} />
            <CostCard monthlyData={monthlyData} approvedCost={Number(project.approved_cost || 0)} />
          </div>

          <MilestoneTable milestones={milestones} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertList
              alerts={activeAlerts}
              onAcknowledge={handleAcknowledgeAlert}
              onResolve={handleResolveAlert}
            />
            <RecommendationList
              recommendations={activeRecommendations}
              onStatusChange={handleRecommendationStatus}
            />
          </div>
        </div>
      )}

      {/* Tab: Risk Analysis */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RiskOverview risk={latestRisk} />
            <RiskTrendChart history={riskHistory} />
          </div>
          <RiskFactors factors={riskFactors} />
        </div>
      )}

      {/* Tab: Financials */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <CostCard monthlyData={monthlyData} approvedCost={Number(project.approved_cost || 0)} />
        </div>
      )}

      {/* Tab: Schedule & Delivery */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <ProgressCard monthlyData={monthlyData} />
        </div>
      )}

      {/* Tab: Milestones */}
      {activeTab === 'milestones' && (
        <div className="space-y-6">
          <MilestoneTable milestones={milestones} />
        </div>
      )}

      {/* Tab: Alerts & Recommendations */}
      {activeTab === 'alerts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AlertList
            alerts={activeAlerts}
            onAcknowledge={handleAcknowledgeAlert}
            onResolve={handleResolveAlert}
          />
          <RecommendationList
            recommendations={activeRecommendations}
            onStatusChange={handleRecommendationStatus}
          />
        </div>
      )}

      {/* Tab: Timeline */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <Timeline events={timelineEvents} />
        </div>
      )}

      {/* Update Financial Amount Modal */}
      <UpdateAmountModal
        isOpen={isUpdateAmountOpen}
        onClose={() => setIsUpdateAmountOpen(false)}
        onSuccess={() => fetchProjectData(true)}
        project={
          overview
            ? {
                project_id: overview.project.project_id,
                project_code: overview.project.project_code,
                project_name: overview.project.project_name,
                approved_cost: overview.project.approved_cost,
                revised_cost: overview.project.revised_cost,
                original_cost: overview.project.original_cost
              }
            : null
        }
      />
    </PageContainer>
  );
};

export default ProjectDetails;
