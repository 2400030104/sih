import pytest
import numpy as np
import pandas as pd
from ml_service.data.feature_extractor import extract_project_dataset, extract_single_project_features
from ml_service.data.preprocessor import create_preprocessor, FEATURE_COLUMNS
from ml_service.models.cost_overrun_model import CostOverrunModel
from ml_service.models.time_overrun_model import TimeOverrunModel
from ml_service.models.risk_scoring_model import RiskScoringModel
from ml_service.models.explainability import ExplainabilityEngine
from ml_service.pipelines.inference_pipeline import predict_and_persist_project

def test_feature_extraction():
    """Verify that dataset features are successfully extracted from MySQL"""
    df = extract_project_dataset()
    assert isinstance(df, pd.DataFrame)
    assert len(df) > 0
    assert 'sanctioned_cost' in df.columns
    assert 'revised_cost' in df.columns
    assert 'cost_revision_ratio' in df.columns
    assert 'progress_gap' in df.columns
    assert 'target_overall_risk' in df.columns

def test_preprocessor_pipeline():
    """Verify ColumnTransformer handles numerical and categorical features cleanly"""
    df = extract_project_dataset()
    preprocessor = create_preprocessor()
    X = df[FEATURE_COLUMNS]
    transformed = preprocessor.fit_transform(X)
    assert transformed.shape[0] == len(df)
    assert not np.isnan(transformed).any()

def test_cost_overrun_model():
    """Verify cost overrun model training, evaluation, and prediction"""
    df = extract_project_dataset()
    model = CostOverrunModel(model_type='gbr')
    model.fit(df, df['target_cost_overrun_pct'])
    
    single_res = model.predict_single(df.iloc[0])
    assert 'predicted_cost_overrun_pct' in single_res
    assert 'predicted_final_cost' in single_res
    assert single_res['predicted_final_cost'] >= 0.0

def test_time_overrun_model():
    """Verify time overrun model training and delay prediction"""
    df = extract_project_dataset()
    model = TimeOverrunModel(model_type='gbr')
    model.fit(df, df['target_delay_months'])
    
    single_res = model.predict_single(df.iloc[0])
    assert 'predicted_delay_months' in single_res
    assert 'predicted_completion_date' in single_res
    assert single_res['predicted_delay_months'] >= 0.0

def test_risk_scoring_model():
    """Verify 4-gauge risk scoring and tier categorization"""
    df = extract_project_dataset()
    risk_model = RiskScoringModel(model_type='gbc')
    risk_model.fit(df, df['target_risk_level'])

    res = risk_model.predict_risk_scores(df.iloc[0], cost_risk=72.0, schedule_risk=80.0)
    assert res['risk_level'] in ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    assert 0 <= res['overall_risk_score'] <= 100
    assert 0 <= res['cost_risk_score'] <= 100
    assert 0 <= res['schedule_risk_score'] <= 100

def test_explainability_factors():
    """Verify SHAP/Attribution explainable risk drivers generator"""
    df = extract_project_dataset()
    cost_model = CostOverrunModel().fit(df, df['target_cost_overrun_pct'])
    time_model = TimeOverrunModel().fit(df, df['target_delay_months'])
    risk_model = RiskScoringModel().fit(df, df['target_risk_level'])

    engine = ExplainabilityEngine(cost_model, time_model, risk_model)
    scores = risk_model.predict_risk_scores(df.iloc[0], 65.0, 70.0)
    factors = engine.explain_project_risk(df.iloc[0], scores)

    assert len(factors) >= 1
    for f in factors:
        assert 'factor_name' in f
        assert 'factor_code' in f
        assert 'impact_value' in f
        assert 'impact_percentage' in f
        assert f['direction'] in ['POSITIVE', 'NEGATIVE', 'NEUTRAL']
        assert 'explanation' in f

def test_single_project_inference_pipeline():
    """Verify live inference and persistence to MySQL for Project 14"""
    result = predict_and_persist_project(14, model_version_id=3)
    assert result['project_id'] == 14
    assert result['prediction_id'] > 0
    assert 'cost_prediction' in result
    assert 'time_prediction' in result
    assert 'risk_scores' in result
    assert len(result['risk_factors']) > 0
