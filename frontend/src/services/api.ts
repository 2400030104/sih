import axios from 'axios';
import {
  ApiResponse,
  ProjectListItem,
  ProjectDetails,
  ProjectOverview360,
  MonthlyData,
  Milestone,
  RiskPrediction,
  RiskFactor,
  Alert,
  Recommendation,
  DashboardSummary,
  SectorMetric,
  MinistryMetric,
  StateMetric,
  RiskDistributionMetric,
  TrendingRiskProject,
  ProjectTimelineResponse,
  ProjectAnalyticsFeatures
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 15000
});

// Centralized error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let customError = 'An unexpected error occurred';
    if (error.response?.data?.message) {
      customError = error.response.data.message;
    } else if (error.message) {
      customError = error.message;
    }
    return Promise.reject(new Error(customError));
  }
);

// ----------------------------------------------------------------------
// Dashboard APIs
// ----------------------------------------------------------------------

export const getDashboardSummary = async (): Promise<DashboardSummary> => {
  const res = await apiClient.get<ApiResponse<DashboardSummary>>('/dashboard/summary');
  return res.data.data;
};

export const getProjectsBySector = async (): Promise<SectorMetric[]> => {
  const res = await apiClient.get<ApiResponse<SectorMetric[]>>('/dashboard/projects-by-sector');
  return res.data.data;
};

export const getProjectsByMinistry = async (): Promise<MinistryMetric[]> => {
  const res = await apiClient.get<ApiResponse<MinistryMetric[]>>('/dashboard/projects-by-ministry');
  return res.data.data;
};

export const getProjectsByState = async (): Promise<StateMetric[]> => {
  const res = await apiClient.get<ApiResponse<StateMetric[]>>('/dashboard/projects-by-state');
  return res.data.data;
};

export const getRiskDistribution = async (): Promise<RiskDistributionMetric[]> => {
  const res = await apiClient.get<ApiResponse<RiskDistributionMetric[]>>('/dashboard/risk-distribution');
  return res.data.data;
};

export const getCostSummary = async (): Promise<any[]> => {
  const res = await apiClient.get<ApiResponse<any[]>>('/dashboard/cost-summary');
  return res.data.data;
};

export const getProgressSummary = async (): Promise<any[]> => {
  const res = await apiClient.get<ApiResponse<any[]>>('/dashboard/progress-summary');
  return res.data.data;
};

// ----------------------------------------------------------------------
// Project APIs
// ----------------------------------------------------------------------

export interface ProjectQueryParams {
  page?: number;
  limit?: number;
  ministry_id?: number;
  sector_id?: number;
  state_id?: number;
  district_id?: number;
  agency_id?: number;
  status?: string;
  project_stage?: string;
  risk_level?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export const getProjects = async (params: ProjectQueryParams = {}): Promise<{ projects: ProjectListItem[]; pagination: any }> => {
  const res = await apiClient.get<ApiResponse<ProjectListItem[]>>('/projects', { params });
  return {
    projects: res.data.data,
    pagination: res.data.pagination
  };
};

export const getProject = async (id: number | string): Promise<ProjectDetails> => {
  const res = await apiClient.get<ApiResponse<ProjectDetails>>(`/projects/${id}`);
  return res.data.data;
};

export const getProjectOverview = async (id: number | string): Promise<ProjectOverview360> => {
  const res = await apiClient.get<ApiResponse<ProjectOverview360>>(`/projects/${id}/overview`);
  return res.data.data;
};

export const getProjectMonthly = async (id: number | string): Promise<MonthlyData[]> => {
  const res = await apiClient.get<ApiResponse<MonthlyData[]>>(`/projects/${id}/monthly`);
  return res.data.data;
};

export const getProjectMilestones = async (id: number | string): Promise<Milestone[]> => {
  const res = await apiClient.get<ApiResponse<Milestone[]>>(`/projects/${id}/milestones`);
  return res.data.data;
};

export const getProjectRisk = async (id: number | string): Promise<RiskPrediction> => {
  const res = await apiClient.get<ApiResponse<RiskPrediction>>(`/projects/${id}/risk`);
  return res.data.data;
};

export const getProjectRiskHistory = async (id: number | string): Promise<RiskPrediction[]> => {
  const res = await apiClient.get<ApiResponse<RiskPrediction[]>>(`/projects/${id}/risk/history`);
  return res.data.data;
};

export const getProjectRiskFactors = async (id: number | string): Promise<RiskFactor[]> => {
  const res = await apiClient.get<ApiResponse<RiskFactor[]>>(`/projects/${id}/risk/factors`);
  return res.data.data;
};

export const getProjectAlerts = async (id: number | string): Promise<Alert[]> => {
  const res = await apiClient.get<ApiResponse<Alert[]>>(`/projects/${id}/alerts`);
  return res.data.data;
};

export const getProjectRecommendations = async (id: number | string): Promise<Recommendation[]> => {
  const res = await apiClient.get<ApiResponse<Recommendation[]>>(`/projects/${id}/recommendations`);
  return res.data.data;
};

export const getProjectTimeline = async (id: number | string): Promise<ProjectTimelineResponse> => {
  const res = await apiClient.get<ApiResponse<ProjectTimelineResponse>>(`/projects/${id}/timeline`);
  return res.data.data;
};

export const getProjectAnalytics = async (id: number | string): Promise<ProjectAnalyticsFeatures> => {
  const res = await apiClient.get<ApiResponse<ProjectAnalyticsFeatures>>(`/projects/${id}/analytics`);
  return res.data.data;
};

// ----------------------------------------------------------------------
// Risk Analytics APIs
// ----------------------------------------------------------------------

export const getAllRisks = async (): Promise<any[]> => {
  const res = await apiClient.get<ApiResponse<any[]>>('/risks');
  return res.data.data;
};

export const getHighRiskProjects = async (): Promise<any[]> => {
  const res = await apiClient.get<ApiResponse<any[]>>('/risks/high');
  return res.data.data;
};

export const getCriticalProjects = async (): Promise<any[]> => {
  const res = await apiClient.get<ApiResponse<any[]>>('/risks/critical');
  return res.data.data;
};

export const getTrendingRisks = async (): Promise<TrendingRiskProject[]> => {
  const res = await apiClient.get<ApiResponse<TrendingRiskProject[]>>('/risks/trending');
  return res.data.data;
};

// ----------------------------------------------------------------------
// Alerts APIs
// ----------------------------------------------------------------------

export const getAlerts = async (params: { severity?: string; status?: string; alert_type?: string; project_id?: number } = {}): Promise<Alert[]> => {
  const res = await apiClient.get<ApiResponse<Alert[]>>('/alerts', { params });
  return res.data.data;
};

export const acknowledgeAlert = async (alertId: number, userId = 1): Promise<Alert> => {
  const res = await apiClient.put<ApiResponse<Alert>>(`/alerts/${alertId}/acknowledge`, { userId });
  return res.data.data;
};

export const resolveAlert = async (alertId: number, userId = 1): Promise<Alert> => {
  const res = await apiClient.put<ApiResponse<Alert>>(`/alerts/${alertId}/resolve`, { userId });
  return res.data.data;
};

// ----------------------------------------------------------------------
// Recommendations APIs
// ----------------------------------------------------------------------

export const getRecommendations = async (params: { priority?: string; status?: string; recommendation_type?: string } = {}): Promise<Recommendation[]> => {
  const res = await apiClient.get<ApiResponse<Recommendation[]>>('/recommendations', { params });
  return res.data.data;
};

export const updateRecommendationStatus = async (id: number, status: string): Promise<Recommendation> => {
  const res = await apiClient.put<ApiResponse<Recommendation>>(`/recommendations/${id}/status`, { status });
  return res.data.data;
};

export default apiClient;
