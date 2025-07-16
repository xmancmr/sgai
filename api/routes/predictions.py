

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sgai.ml import models
import pandas as pd
import numpy as np
from .validation import validate_and_prepare_features

bp = Blueprint('predictions', __name__)

@bp.route('/api/predict/production', methods=['POST'])
@jwt_required()
def predict_production():
    import joblib
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    meta = joblib.load('models/meta_production_model.joblib')
    expected_columns = meta['features']
    encoders = meta.get('encoders', None)
    try:
        x_valid = validate_and_prepare_features(X, expected_columns, encoders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    y_pred = models.predict_production(x_valid)
    return jsonify({'prediction': float(y_pred[0])})

@bp.route('/api/predict/costs', methods=['POST'])
@jwt_required()
def predict_costs():
    import joblib
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    meta = joblib.load('models/meta_cost_model.joblib')
    expected_columns = meta['features']
    encoders = meta.get('encoders', None)
    try:
        x_valid = validate_and_prepare_features(X, expected_columns, encoders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    y_pred = models.predict_cost_variation(x_valid)
    return jsonify({'prediction': float(y_pred[0])})

@bp.route('/api/predict/weather', methods=['POST'])
@jwt_required()
def predict_weather():
    import joblib
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    meta = joblib.load('models/meta_weather_model.joblib')
    expected_columns = meta['features']
    encoders = meta.get('encoders', None)
    try:
        x_valid = validate_and_prepare_features(X, expected_columns, encoders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    y_pred = models.predict_weather(x_valid)
    return jsonify({'prediction': float(y_pred[0])})

@bp.route('/api/predict/inflation', methods=['POST'])
@jwt_required()
def predict_inflation():
    import joblib
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    meta = joblib.load('models/meta_inflation_model.joblib')
    expected_columns = meta['features']
    encoders = meta.get('encoders', None)
    try:
        x_valid = validate_and_prepare_features(X, expected_columns, encoders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    y_pred = models.predict_inflation(x_valid)
    return jsonify({'prediction': float(y_pred[0])})

@bp.route('/api/predict/volatility', methods=['POST'])
@jwt_required()
def predict_volatility():
    import joblib
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    meta = joblib.load('models/meta_volatility_model.joblib')
    expected_columns = meta['features']
    encoders = meta.get('encoders', None)
    try:
        x_valid = validate_and_prepare_features(X, expected_columns, encoders)
    except Exception as e:
        return jsonify({'error': str(e)}), 400
    y_pred = models.predict_volatility(x_valid)
    return jsonify({'prediction': float(y_pred[0])})
