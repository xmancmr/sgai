
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
import os
import json
from datetime import datetime
import logging

# Configuration du logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Permettre les requêtes cross-origin depuis le frontend

class ProductionPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.label_encoders = {}
        self.feature_names = []
        self.metadata = {}
        self.is_loaded = False
        
    def load_model(self):
        """Charge le modèle et tous ses artefacts"""
        try:
            # Charger le modèle TensorFlow
            model_path = 'models/production_model_final.h5'
            if os.path.exists(model_path):
                self.model = tf.keras.models.load_model(model_path)
                logger.info("Modèle TensorFlow chargé avec succès")
            else:
                logger.error(f"Modèle non trouvé: {model_path}")
                return False
            
            # Charger le scaler
            scaler_path = 'models/scaler.pkl'
            if os.path.exists(scaler_path):
                self.scaler = joblib.load(scaler_path)
                logger.info("Scaler chargé avec succès")
            else:
                logger.error(f"Scaler non trouvé: {scaler_path}")
                return False
            
            # Charger les métadonnées
            metadata_path = 'models/model_metadata.json'
            if os.path.exists(metadata_path):
                with open(metadata_path, 'r') as f:
                    self.metadata = json.load(f)
                self.feature_names = self.metadata.get('feature_names', [])
                logger.info("Métadonnées chargées avec succès")
            
            # Charger les encodeurs de labels
            for feature in self.feature_names:
                encoder_path = f'models/{feature}_encoder.pkl'
                if os.path.exists(encoder_path):
                    self.label_encoders[feature] = joblib.load(encoder_path)
            
            self.is_loaded = True
            logger.info("Tous les artefacts du modèle sont chargés")
            return True
            
        except Exception as e:
            logger.error(f"Erreur lors du chargement du modèle: {str(e)}")
            return False
    
    def preprocess_input(self, input_data):
        """Prétraite les données d'entrée"""
        try:
            # Convertir en DataFrame
            df = pd.DataFrame([input_data])
            
            # S'assurer que toutes les colonnes nécessaires sont présentes
            for feature in self.feature_names:
                if feature not in df.columns:
                    df[feature] = 0  # Valeur par défaut
            
            # Réorganiser les colonnes selon l'ordre d'entraînement
            df = df[self.feature_names]
            
            # Appliquer les encodeurs de labels si nécessaire
            for feature, encoder in self.label_encoders.items():
                if feature in df.columns:
                    try:
                        df[feature] = encoder.transform(df[feature].astype(str))
                    except ValueError:
                        # Si la valeur n'est pas connue, utiliser la première classe
                        df[feature] = 0
            
            # Appliquer le scaling
            if self.scaler:
                numeric_cols = df.select_dtypes(include=np.number).columns
                if len(numeric_cols) > 0:
                    df[numeric_cols] = self.scaler.transform(df[numeric_cols])
            
            return df.values
            
        except Exception as e:
            logger.error(f"Erreur lors du prétraitement: {str(e)}")
            raise
    
    def predict(self, input_data):
        """Effectue une prédiction"""
        if not self.is_loaded:
            raise ValueError("Modèle non chargé")
        
        try:
            # Prétraiter les données
            processed_data = self.preprocess_input(input_data)
            
            # Faire la prédiction
            prediction = self.model.predict(processed_data)
            
            # Retourner la prédiction
            return float(prediction[0][0])
            
        except Exception as e:
            logger.error(f"Erreur lors de la prédiction: {str(e)}")
            raise

# Initialiser le prédicteur
predictor = ProductionPredictor()

@app.route('/health', methods=['GET'])
def health_check():
    """Point de santé de l'API"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': predictor.is_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/load_model', methods=['POST'])
def load_model():
    """Charge le modèle"""
    try:
        success = predictor.load_model()
        if success:
            return jsonify({
                'success': True,
                'message': 'Modèle chargé avec succès',
                'metadata': predictor.metadata
            })
        else:
            return jsonify({
                'success': False,
                'message': 'Erreur lors du chargement du modèle'
            }), 500
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erreur: {str(e)}'
        }), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint de prédiction"""
    try:
        if not predictor.is_loaded:
            return jsonify({
                'success': False,
                'message': 'Modèle non chargé. Veuillez d\'abord charger le modèle.'
            }), 400
        
        # Récupérer les données d'entrée
        data = request.get_json()
        if not data:
            return jsonify({
                'success': False,
                'message': 'Données d\'entrée manquantes'
            }), 400
        
        # Faire la prédiction
        prediction = predictor.predict(data)
        
        return jsonify({
            'success': True,
            'prediction': prediction,
            'input_data': data,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Erreur lors de la prédiction: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Erreur lors de la prédiction: {str(e)}'
        }), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Retourne les informations sur le modèle"""
    if not predictor.is_loaded:
        return jsonify({
            'success': False,
            'message': 'Modèle non chargé'
        }), 400
    
    return jsonify({
        'success': True,
        'metadata': predictor.metadata,
        'feature_names': predictor.feature_names,
        'model_loaded': predictor.is_loaded
    })

@app.route('/predict_batch', methods=['POST'])
def predict_batch():
    """Prédictions en lot"""
    try:
        if not predictor.is_loaded:
            return jsonify({
                'success': False,
                'message': 'Modèle non chargé'
            }), 400
        
        data = request.get_json()
        if not data or 'batch' not in data:
            return jsonify({
                'success': False,
                'message': 'Format de données invalide. Attendu: {"batch": [...]}'
            }), 400
        
        batch_data = data['batch']
        predictions = []
        
        for item in batch_data:
            try:
                pred = predictor.predict(item)
                predictions.append({
                    'input': item,
                    'prediction': pred,
                    'success': True
                })
            except Exception as e:
                predictions.append({
                    'input': item,
                    'error': str(e),
                    'success': False
                })
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'total_processed': len(predictions),
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Erreur lors des prédictions en lot: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Charger le modèle au démarrage
    print("Démarrage de l'API de prédiction agricole...")
    if predictor.load_model():
        print("Modèle chargé avec succès")
    else:
        print("Attention: Le modèle n'a pas pu être chargé")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
