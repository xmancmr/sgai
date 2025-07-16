from flask import Blueprint, request, jsonify
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from PIL import Image
import numpy as np
import io

bp = Blueprint('diagnostic', __name__)

model = MobileNetV2(weights='imagenet')

@bp.route('/detect_disease', methods=['POST'])
def detect_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    img = Image.open(file.stream).convert('RGB').resize((224, 224))
    arr = np.array(img)
    arr = np.expand_dims(arr, axis=0)
    arr = preprocess_input(arr)
    preds = model.predict(arr)
    decoded = decode_predictions(preds, top=3)[0]
    return jsonify({'predictions': [
        {'label': label, 'prob': float(prob)} for (_, label, prob) in decoded
    ]})
