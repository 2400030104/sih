import numpy as np
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from ml_service.data.preprocessor import create_preprocessor, FEATURE_COLUMNS

class CostOverrunModel:
    def __init__(self, model_type='gbr'):
        self.model_type = model_type
        self.preprocessor = create_preprocessor()
        
        if model_type == 'gbr':
            self.regressor = GradientBoostingRegressor(
                n_estimators=100,
                learning_rate=0.08,
                max_depth=4,
                random_state=42
            )
        elif model_type == 'rf':
            self.regressor = RandomForestRegressor(
                n_estimators=100,
                max_depth=6,
                random_state=42
            )
        else:
            self.regressor = Ridge(alpha=1.0)

        self.pipeline = Pipeline([
            ('preprocessor', self.preprocessor),
            ('regressor', self.regressor)
        ])
        self.baseline_pipeline = Pipeline([
            ('preprocessor', create_preprocessor()),
            ('regressor', Ridge(alpha=1.0))
        ])

    def fit(self, X_train: pd.DataFrame, y_train: pd.Series):
        """
        Train the Cost Overrun model
        """
        self.pipeline.fit(X_train[FEATURE_COLUMNS], y_train)
        self.baseline_pipeline.fit(X_train[FEATURE_COLUMNS], y_train)
        return self

    def evaluate(self, X_test: pd.DataFrame, y_test: pd.Series):
        """
        Evaluate model against test set and baseline
        """
        preds = self.pipeline.predict(X_test[FEATURE_COLUMNS])
        baseline_preds = self.baseline_pipeline.predict(X_test[FEATURE_COLUMNS])

        metrics = {
            'model_mae': float(mean_absolute_error(y_test, preds)),
            'model_rmse': float(root_mean_squared_error(y_test, preds)),
            'model_r2': float(r2_score(y_test, preds)),
            'baseline_mae': float(mean_absolute_error(y_test, baseline_preds)),
            'baseline_rmse': float(root_mean_squared_error(y_test, baseline_preds)),
            'baseline_r2': float(r2_score(y_test, baseline_preds))
        }
        return metrics

    def predict(self, X: pd.DataFrame):
        """
        Predict cost overrun % for given features
        """
        preds = self.pipeline.predict(X[FEATURE_COLUMNS])
        return np.maximum(preds, 0.0).round(2)

    def predict_single(self, row: pd.Series):
        """
        Predict cost overrun metrics for a single project
        """
        df = pd.DataFrame([row])
        overrun_pct = float(self.predict(df)[0])
        
        sanctioned_cost = float(row.get('sanctioned_cost', row.get('original_sanctioned_cost', 0)))
        revised_cost = float(row.get('revised_cost', row.get('revised_approved_cost', sanctioned_cost)))
        
        # Projected final cost
        projected_cost = round(sanctioned_cost * (1.0 + overrun_pct / 100.0), 2)
        projected_overrun_amount = max(round(projected_cost - sanctioned_cost, 2), 0.0)

        # Overrun risk score (0-100)
        cost_risk_score = min(max(round(overrun_pct * 1.5, 1), 5.0), 98.0)

        return {
            'predicted_cost_overrun_pct': overrun_pct,
            'predicted_final_cost': projected_cost,
            'predicted_cost_overrun_amount': projected_overrun_amount,
            'cost_risk_score': cost_risk_score
        }
