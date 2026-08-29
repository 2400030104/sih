from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List

class CopilotChatRequest(BaseModel):
    message: str = Field(..., description="Natural language question from user")
    projectId: Optional[int] = Field(None, description="Optional target project ID")

class CopilotChatResponse(BaseModel):
    intent: str
    answer: str
    whyEvidence: Optional[str] = None
    prediction: Optional[str] = None
    recommendedAction: Optional[str] = None
    limitation: Optional[str] = None
    evidenceSources: List[str] = []
    projectId: Optional[int] = None

class ScenarioSimulateRequest(BaseModel):
    projectId: int
    changes: Dict[str, Any] = Field(default_factory=dict, description="Controlled scenario input deltas")

class ProjectSummaryResponse(BaseModel):
    projectId: int
    projectCode: str
    projectName: str
    executiveSummary: str
    currentStatus: str
    financialStatus: Dict[str, Any]
    scheduleStatus: Dict[str, Any]
    riskAssessment: Dict[str, Any]
    majorRiskFactors: List[Dict[str, Any]]
    criticalMilestones: List[Dict[str, Any]]
    recommendedActions: List[Dict[str, Any]]
