import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from sklearn.pipeline import Pipeline
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
from ml_service.data.preprocessor import create_preprocessor, FEATURE_COLUMNS

class TimeOverrunModel:
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
        Train the Time Overrun delay model
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
        Predict delay duration in months
        """
        preds = self.pipeline.predict(X[FEATURE_COLUMNS])
        return np.maximum(preds, 0.0).round(1)

    def predict_single(self, row: pd.Series):
        """
        Predict time overrun metrics for a single project
        """
        df = pd.DataFrame([row])
        delay_months = float(self.predict(df)[0])

        planned_end = row.get('planned_completion_date')
        if isinstance(planned_end, str):
            planned_end = datetime.strptime(planned_end[:10], '%Y-%m-%d')
        elif isinstance(planned_end, pd.Timestamp):
            planned_end = planned_end.to_pydatetime()
        elif not isinstance(planned_end, datetime):
            planned_end = datetime.now()

        # Approximate projected completion date
        days_to_add = int(delay_months * 30.4375)
        projected_completion_date = (planned_end + timedelta(days=days_to_add)).strftime('%Y-%m-%d')

        # Schedule risk score (0-100)
        schedule_risk_score = min(max(round(delay_months * 3.2, 1), 5.0), 98.0)

        return {
            'predicted_delay_months': delay_months,
            'predicted_completion_date': projected_completion_date,
            'schedule_risk_score': schedule_risk_score
        }
