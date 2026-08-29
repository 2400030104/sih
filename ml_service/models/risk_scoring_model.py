import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from ml_service.data.preprocessor import create_preprocessor, FEATURE_COLUMNS

class RiskScoringModel:
    def __init__(self, model_type='gbc'):
        self.model_type = model_type
        self.preprocessor = create_preprocessor()

        if model_type == 'gbc':
            self.classifier = GradientBoostingClassifier(
                n_estimators=100,
                learning_rate=0.08,
                max_depth=3,
                random_state=42
            )
        else:
            self.classifier = RandomForestClassifier(
                n_estimators=100,
                max_depth=5,
                random_state=42
            )

        self.pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('classifier', self.classifier)
        ])

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        """
        Train the Risk Tier Classifier
        """
        self.pipeline.fit(X_train[FEATURE_COLUMNS], y_train)
        return self

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series):
        """
        Evaluate classification accuracy
        """
        preds = self.pipeline.predict(X_test[FEATURE_COLUMNS])
        acc = float(accuracy_score(y_test, preds))
        report = classification_report(y_test, preds, output_dict=True, zero_division=0)
        return {
            'accuracy': acc,
            'classification_report': report
        }

    def predict_risk_scores(self, row: pd.Series, cost_risk: float, schedule_risk: float):
        """
        Synthesize multi-dimensional 4-gauge risk scores and composite overall score
        """
        # 1. Scope Risk (Progress gap, milestone delay ratio, cost revision ratio)
        progress_gap = float(row.get('progress_gap', 0.0))
        delayed_milestones_ratio = float(row.get('delayed_milestones_ratio', 0.0))
        cost_revision_ratio = float(row.get('cost_revision_ratio', 1.0))

        scope_risk = min(max(
            round(progress_gap * 1.8 + delayed_milestones_ratio * 35.0 + (cost_revision_ratio - 1.0) * 40.0, 1),
            5.0
        ), 95.0)

        # 2. Contractor / Implementation Risk (Critical milestones delayed, progress velocity deficit)
        critical_delayed = int(row.get('critical_delayed_milestones', 0))
        progress_velocity = float(row.get('progress_velocity', 1.0))
        
        velocity_penalty = max((2.0 - progress_velocity) * 15.0, 0.0)
        contractor_risk = min(max(
            round(critical_delayed * 22.0 + velocity_penalty + delayed_milestones_ratio * 25.0, 1),
            5.0
        ), 98.0)

        # 3. Overall Composite Weighted Risk Score (0-100)
        # Weights: 30% Cost Risk + 30% Schedule Risk + 20% Scope Risk + 20% Contractor Risk
        overall_risk = round(
            0.30 * cost_risk + 0.30 * schedule_risk + 0.20 * scope_risk + 0.20 * contractor_risk,
            2
        )
        overall_risk = min(max(overall_risk, 5.0), 96.0)

        # 4. Risk Level Tier
        if overall_risk >= 75.0:
            risk_level = 'CRITICAL'
        elif overall_risk >= 50.0:
            risk_level = 'HIGH'
        elif overall_risk >= 25.0:
            risk_level = 'MEDIUM'
        else:
            risk_level = 'LOW'

        return {
            'cost_risk_score': round(cost_risk, 1),
            'schedule_risk_score': round(schedule_risk, 1),
            'scope_risk_score': round(scope_risk, 1),
            'contractor_risk_score': round(contractor_risk, 1),
            'overall_risk_score': round(overall_risk, 1),
            'risk_level': risk_level
        }
