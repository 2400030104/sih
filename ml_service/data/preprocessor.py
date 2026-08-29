import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer

NUMERICAL_FEATURES = [
    'sanctioned_cost',
    'revised_cost',
    'cost_revision_ratio',
    'planned_duration_months',
    'elapsed_duration_months',
    'schedule_elapsed_ratio',
    'latest_physical_progress',
    'latest_financial_progress',
    'latest_planned_progress',
    'progress_gap',
    'physical_financial_gap',
    'expenditure_rate',
    'total_milestones',
    'delayed_milestones_ratio',
    'critical_delayed_milestones',
    'avg_milestone_delay_days',
    'progress_velocity'
]

CATEGORICAL_FEATURES = [
    'sector',
    'ministry',
    'location_state'
]

FEATURE_COLUMNS = NUMERICAL_FEATURES + CATEGORICAL_FEATURES

def create_preprocessor():
    """
    Build scikit-learn ColumnTransformer for numerical and categorical features
    """
    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])

    cat_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='constant', fill_value='UNKNOWN')),
        ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
    ])

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', num_pipeline, NUMERICAL_FEATURES),
            ('cat', cat_pipeline, CATEGORICAL_FEATURES)
        ],
        remainder='drop'
    )

    return preprocessor

def get_feature_matrix(df: pd.DataFrame):
    """
    Extract only feature columns from dataframe
    """
    return df[FEATURE_COLUMNS].copy()
