import apiClient from './api';

export interface CopilotMessageResponse {
  intent: string;
  answer: string;
  whyEvidence?: string;
  prediction?: string;
  recommendedAction?: string;
  limitation?: string;
  evidenceSources: string[];
  projectId?: number;
}

export interface InterventionItem {
  rank: number;
  projectId: number;
  projectCode: string;
  projectName: string;
  sector: string;
  ministry: string;
  state: string;
  agency: string;
  priority: 'P1' | 'P2' | 'P3' | 'P4';
  priorityLabel: string;
  priorityScore: number;
  overallRisk: number;
  riskLevel: string;
  riskTrend: 'ACCELERATING' | 'STABLE' | 'DECELERATING';
  financialExposure: number;
  scheduleExposureMonths: number;
  physicalProgress: number;
  plannedProgress: number;
  criticalMilestonesDelayed: number;
  primaryConcern: string;
  recommendedAction: string;
  breakdown: {
    riskSeverity: number;
    riskAcceleration: number;
    financialExposureScore: number;
    scheduleExposureScore: number;
    milestoneExposureScore: number;
  };
}

export interface ProjectSummaryData {
  projectId: number;
  projectCode: string;
  projectName: string;
  sector: string;
  ministry: string;
  agency: string;
  executiveSummary: string;
  currentStatus: string;
  priority: string;
  priorityLabel: string;
  financialStatus: {
    sanctionedCostCr: number;
    cumulativeExpenditureCr: number;
    financialProgressPct: number;
    predictedFinalCostCr: number;
    predictedCostOverrunCr: number;
  };
  scheduleStatus: {
    plannedCompletionDate: string;
    predictedDelayMonths: number;
    predictedCompletionDate: string;
    physicalProgressPct: number;
    plannedProgressPct: number;
    progressGapPct: number;
  };
  riskAssessment: {
    overallRiskScore: number;
    riskLevel: string;
    costRisk: number;
    timeRisk: number;
    implementationRisk: number;
  };
  majorRiskFactors: Array<{
    factor_name: string;
    factor_code: string;
    impact_percentage: number;
    direction: string;
    explanation: string;
  }>;
  criticalMilestones: Array<{
    milestone_name: string;
    delay_days: number;
    criticality: string;
  }>;
  recommendedActions: Array<{
    type: string;
    priority: string;
    trigger: string;
    recommendedAction: string;
  }>;
}

export interface ScenarioSimulationResult {
  projectId: number;
  projectCode: string;
  projectName: string;
  inputChanges: {
    monthlyProgressIncrease: number;
    milestoneDelayReductionDays: number;
    expenditureEfficiencyPct: number;
  };
  baseCase: {
    overallRisk: number;
    riskLevel: string;
    predictedDelayMonths: number;
    predictedCompletionDate: string;
    predictedFinalCost: number;
    costOverrunPct: number;
  };
  scenario: {
    overallRisk: number;
    riskLevel: string;
    predictedDelayMonths: number;
    predictedCompletionDate: string;
    predictedFinalCost: number;
    costOverrunPct: number;
  };
  delta: {
    riskChange: number;
    delayChangeMonths: number;
    costChangeCr: number;
    improved: boolean;
  };
  modelVersion: string;
  limitation: string;
}

export const aiService = {
  async askCopilot(message: string, projectId?: number): Promise<CopilotMessageResponse> {
    const res = await apiClient.post<{ success: boolean; data: CopilotMessageResponse }>('/copilot/chat', {
      message,
      projectId
    });
    return res.data.data;
  },

  async getProjectSummary(projectId: number): Promise<ProjectSummaryData> {
    const res = await apiClient.post<{ success: boolean; data: ProjectSummaryData }>(
      `/copilot/project-summary/${projectId}`
    );
    return res.data.data;
  },

  async getInterventionQueue(): Promise<{ count: number; queue: InterventionItem[] }> {
    const res = await apiClient.get<{ success: boolean; data: { count: number; queue: InterventionItem[] } }>(
      '/interventions'
    );
    return res.data.data;
  },

  async getSingleIntervention(projectId: number): Promise<InterventionItem> {
    const res = await apiClient.get<{ success: boolean; data: InterventionItem }>(
      `/interventions/${projectId}`
    );
    return res.data.data;
  },

  async simulateScenario(
    projectId: number,
    changes: {
      monthlyProgressIncrease?: number;
      milestoneDelayReduction?: number;
      expenditureEfficiencyPct?: number;
    }
  ): Promise<ScenarioSimulationResult> {
    const res = await apiClient.post<{ success: boolean; data: ScenarioSimulationResult }>(
      '/scenarios/simulate',
      { projectId, changes }
    );
    return res.data.data;
  },

  async generateRecommendations(projectId: number) {
    const res = await apiClient.post(`/recommendations/generate/${projectId}`);
    return res.data.data;
  }
};
