import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split

from ml_service.data.feature_extractor import extract_project_dataset
from ml_service.models.cost_overrun_model import CostOverrunModel
from ml_service.models.time_overrun_model import TimeOverrunModel
from ml_service.models.risk_scoring_model import RiskScoringModel

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'trained_artifacts')

def run_training_pipeline():
    """
    Train Cost Overrun, Time Overrun, and Risk Scoring Models and save artifacts
    """
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)
    print("=" * 60)
    print("  PRAGATI-AI Machine Learning Training Pipeline Starting")
    print("=" * 60)

    # 1. Extract feature dataset from MySQL
    print("[1/4] Extracting monitoring features from MySQL database...")
    df = extract_project_dataset()
    print(f"      Loaded {len(df)} project records with {df.shape[1]} raw & engineered columns.")

    # 2. Train / Test Split (Strict featurization ordering - split BEFORE fit)
    X = df
    y_cost = df['target_cost_overrun_pct']
    y_time = df['target_delay_months']
    y_risk = df['target_risk_level']

    X_train, X_test, y_cost_train, y_cost_test, y_time_train, y_time_test, y_risk_train, y_risk_test = (
        train_test_split(
            X, y_cost, y_time, y_risk,
            test_size=0.20,
            random_state=42
        )
    )
    print(f"[2/4] Split dataset into {len(X_train)} training and {len(X_test)} validation samples.")

    # 3. Train Models
    print("[3/4] Fitting Predictive Machine Learning Models...")
    
    # Cost Model
    cost_model = CostOverrunModel(model_type='gbr')
    cost_model.fit(X_train, y_cost_train)
    cost_metrics = cost_model.evaluate(X_test, y_cost_test)
    print(f"      [Cost Model] MAE: {cost_metrics['model_mae']:.2f}% | RMSE: {cost_metrics['model_rmse']:.2f}% | R²: {cost_metrics['model_r2']:.2f} (Baseline MAE: {cost_metrics['baseline_mae']:.2f}%)")

    # Time Model
    time_model = TimeOverrunModel(model_type='gbr')
    time_model.fit(X_train, y_time_train)
    time_metrics = time_model.evaluate(X_test, y_time_test)
    print(f"      [Time Model] MAE: {time_metrics['model_mae']:.2f} mo | RMSE: {time_metrics['model_rmse']:.2f} mo | R²: {time_metrics['model_r2']:.2f} (Baseline MAE: {time_metrics['baseline_mae']:.2f} mo)")

    # Risk Scoring Model
    risk_model = RiskScoringModel(model_type='gbc')
    risk_model.fit(X_train, y_risk_train)
    risk_metrics = risk_model.evaluate(X_test, y_risk_test)
    print(f"      [Risk Tier Model] Accuracy: {risk_metrics['accuracy'] * 100:.1f}%")

    # 4. Save Artifacts
    print("[4/4] Serializing trained model artifacts to disk...")
    cost_path = os.path.join(ARTIFACTS_DIR, 'cost_overrun_model.joblib')
    time_path = os.path.join(ARTIFACTS_DIR, 'time_overrun_model.joblib')
    risk_path = os.path.join(ARTIFACTS_DIR, 'risk_scoring_model.joblib')

    joblib.dump(cost_model, cost_path)
    joblib.dump(time_model, time_path)
    joblib.dump(risk_model, risk_path)

    print(f"      Saved: {cost_path}")
    print(f"      Saved: {time_path}")
    print(f"      Saved: {risk_path}")
    print("=" * 60)
    print("  Model Training & Evaluation Completed Successfully!")
    print("=" * 60)

    return {
        'cost_metrics': cost_metrics,
        'time_metrics': time_metrics,
        'risk_metrics': risk_metrics
    }

if __name__ == '__main__':
    run_training_pipeline()
