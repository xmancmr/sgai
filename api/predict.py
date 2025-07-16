
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
import joblib
import numpy as np
import os

bp = Blueprint('predict', __name__)


MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models/rf_model_superficie_production.pkl')
SCALER_PATH = os.path.join(os.path.dirname(__file__), '../models/scaler_superficie_production.pkl')

@bp.route('/predict_rendement', methods=['POST'])
@jwt_required()
def predict_rendement():
    data = request.get_json()
    features = np.array(data['features']).reshape(1, -1)
    scaler = joblib.load(SCALER_PATH)
    model = joblib.load(MODEL_PATH)
    features_scaled = scaler.transform(features)
    prediction = model.predict(features_scaled)
    return jsonify({'prediction': float(prediction[0])})
