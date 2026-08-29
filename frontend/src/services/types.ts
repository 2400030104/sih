/**
 * PRAGATI-AI Data Models & TypeScript Type Definitions
 */

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ProjectStatus = 'PROPOSED' | 'APPROVED' | 'ONGOING' | 'COMPLETED' | 'DELAYED' | 'ON_HOLD' | 'CANCELLED' | 'CLOSED';
export type ProjectStage = 'PLANNING' | 'PROCUREMENT' | 'EXECUTION' | 'COMMISSIONING' | 'COMPLETED';
export type PriorityCategory = 'TOP_PRIORITY' | 'HIGH_IMPACT' | 'REGULAR' | 'STRATEGIC';
export type MilestoneStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
export type Criticality = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'NEW' | 'ACKNOWLEDGED' | 'RESOLVED' | 'DISMISSED';
export type RecommendationPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type RecommendationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'IMPLEMENTED';

export interface Pagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  error?: string;
  details?: any;
}

export interface ProjectListItem {
  project_id: number;
  project_code: string;
  project_name: string;
  project_description?: string;
  ministry_code: string;
  ministry_name: string;
  sector_code: string;
  sector_name: string;
  agency_code: string;
  agency_name: string;
  state_code: string;
  state_name: string;
  district_name?: string;
  location_description?: string;
  latitude?: number;
  longitude?: number;
  original_cost: number;
  approved_cost: number;
  revised_cost?: number;
  approved_date: string;
  planned_start_date: string;
  planned_completion_date: string;
  actual_start_date?: string;
  actual_completion_date?: string;
  current_status: ProjectStatus;
  project_stage: ProjectStage;
  priority_category: PriorityCategory;
  source_system: string;
  physical_progress?: number;
  financial_progress?: number;
  cumulative_expenditure?: number;
  schedule_variance_days?: number;
  overall_risk?: number;
  risk_level?: RiskLevel;
  predicted_delay_months?: number;
  predicted_final_cost?: number;
}

export interface ProjectDetails extends ProjectListItem {
  ministry_id: number;
  sector_id: number;
  agency_id: number;
  agency_type: string;
  state_id: number;
  district_id?: number;
  region: string;
  source_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface MonthlyData {
  monthly_data_id: number;
  project_id: number;
  reporting_month: string;
  expenditure: number;
  cumulative_expenditure: number;
  physical_progress: number;
  financial_progress: number;
  planned_progress: number;
  milestones_planned: number;
  milestones_completed: number;
  milestones_delayed: number;
  schedule_variance_days: number;
  cost_variance: number;
  manpower_count?: number;
  remarks?: string;
  data_source: string;
}

export interface Milestone {
  milestone_id: number;
  project_id: number;
  milestone_code: string;
  milestone_name: string;
  milestone_description?: string;
  planned_date: string;
  revised_date?: string;
  actual_date?: string;
  status: MilestoneStatus;
  delay_days: number;
  criticality: Criticality;
}

export interface RiskPrediction {
  predictionId: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  costRisk: number;
  timeRisk: number;
  implementationRisk: number;
  overallRisk: number;
  riskLevel: RiskLevel;
  predictedFinalCost?: number;
  predictedDelayMonths?: number;
  predictedCompletionDate?: string;
  confidenceScore: number;
  predictionExplanation?: string;
  predictionDate: string;
  modelName?: string;
  modelVersion?: string;
}

export interface RiskFactor {
  factor: string;
  factorCode?: string;
  impactValue?: number;
  impact: number;
  direction: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
  rank: number;
  explanation: string;
}

export interface Alert {
  alert_id: number;
  project_id: number;
  project_code?: string;
  project_name?: string;
  prediction_id?: number;
  alert_type: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  trigger_value?: string;
  threshold_value?: string;
  status: AlertStatus;
  generated_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  acknowledged_by_name?: string;
  resolved_by_name?: string;
}

export interface Recommendation {
  recommendation_id: number;
  project_id: number;
  project_code?: string;
  project_name?: string;
  prediction_id?: number;
  recommendation_type: string;
  priority: RecommendationPriority;
  recommendation_text: string;
  rationale?: string;
  generated_by: 'RULE_ENGINE' | 'ML' | 'LLM' | 'HUMAN';
  status: RecommendationStatus;
  created_at: string;
}

export interface DashboardSummary {
  totalProjects: number;
  ongoingProjects: number;
  completedProjects: number;
  delayedProjects: number;
  highRiskProjects: number;
  criticalRiskProjects: number;
  mediumRiskProjects: number;
  lowRiskProjects: number;
  averageOverallRisk: number;
  totalOriginalCost: number;
  totalApprovedCost: number;
  totalRevisedCost: number;
  totalExpenditure: number;
  averagePhysicalProgress: number;
  averageFinancialProgress: number;
  averagePlannedProgress: number;
  totalActiveAlerts: number;
  criticalAlerts: number;
}

export interface SectorMetric {
  sector_id: number;
  sector_code: string;
  sector_name: string;
  projectCount: number;
  totalApprovedCost: number;
  totalCurrentCost: number;
  avgPhysicalProgress: number;
  avgFinancialProgress: number;
  highRiskCount: number;
}

export interface MinistryMetric {
  ministry_id: number;
  ministry_code: string;
  ministry_name: string;
  projectCount: number;
  totalApprovedCost: number;
  totalCurrentCost: number;
  avgPhysicalProgress: number;
  delayedCount: number;
  highRiskCount: number;
}

export interface StateMetric {
  state_id: number;
  state_code: string;
  state_name: string;
  region: string;
  projectCount: number;
  totalApprovedCost: number;
  avgPhysicalProgress: number;
  highRiskCount: number;
}

export interface RiskDistributionMetric {
  riskLevel: RiskLevel;
  count: number;
  avgRiskScore: number;
  avgCostRisk: number;
  avgTimeRisk: number;
  avgImplementationRisk: number;
  avgPredictedDelayMonths: number;
  totalPredictedCostOverrun: number;
}

export interface ProjectOverview360 {
  project: ProjectDetails;
  latestMonthlyData: MonthlyData | null;
  latestRisk: RiskPrediction | null;
  riskFactors: RiskFactor[];
  milestones: Milestone[];
  activeAlerts: Alert[];
  activeRecommendations: Recommendation[];
}

export interface TimelineEvent {
  eventDate: string;
  eventType: 'PROJECT_APPROVED' | 'PROJECT_PLANNED_START' | 'PROJECT_ACTUAL_START' | 'MILESTONE' | 'MONTHLY_MONITORING' | 'RISK_PREDICTION' | 'EARLY_WARNING_ALERT';
  title: string;
  description: string;
  metadata: any;
}

export interface ProjectTimelineResponse {
  projectId: number;
  projectCode: string;
  projectName: string;
  totalEvents: number;
  timeline: TimelineEvent[];
}

export interface ProjectAnalyticsFeatures {
  projectId: number;
  latestReportingMonth: string | null;
  latestPhysicalProgress: number;
  latestFinancialProgress: number;
  latestPlannedProgress: number;
  progressVelocity: number;
  progressSlowdown: number;
  physicalFinancialGap: number;
  milestoneDelayCount: number;
  criticalMilestoneDelayCount: number;
  averageMilestoneDelayDays: number;
  maxMilestoneDelayDays: number;
  scheduleVarianceDays: number;
  costRevisionRatio: number;
  expenditureRatio: number;
}

export interface TrendingRiskProject {
  prediction_id: number;
  project_id: number;
  project_code: string;
  project_name: string;
  ministry_code: string;
  sector_name: string;
  prediction_date: string;
  overall_risk: number;
  prev_month_risk: number;
  risk_acceleration: number;
  risk_level: RiskLevel;
  predicted_delay_months: number;
}
