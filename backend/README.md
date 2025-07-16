
# API de Prédiction Agricole avec Deep Learning

Cette API Flask utilise un modèle de deep learning entraîné pour faire des prédictions de production agricole.

## Installation

1. Installer les dépendances Python:
```bash
pip install -r requirements.txt
```

2. S'assurer que le modèle est entraîné:
```bash
python train_model.py
```

3. Démarrer l'API:
```bash
python app.py
```

L'API sera disponible sur `http://localhost:5000`

## Endpoints

- `GET /health` - Vérifier la santé de l'API
- `POST /load_model` - Charger le modèle
- `POST /predict` - Faire une prédiction
- `POST /predict_batch` - Prédictions en lot
- `GET /model_info` - Informations sur le modèle

## Exemple d'utilisation

```python
import requests

# Charger le modèle
response = requests.post('http://localhost:5000/load_model')

# Faire une prédiction
data = {
    'cultures': 'Maïs',
    'annee': 2024,
    'superficie': 10.5,
    'region': 'CENTRE'
}
response = requests.post('http://localhost:5000/predict', json=data)
print(response.json())
```

## Structure des données

Le modèle attend des données avec les champs suivants (adaptés selon votre entraînement):
- cultures: nom de la culture
- annee: année de production
- superficie: superficie en hectares
- region: région géographique

La réponse contient:
- prediction: valeur prédite en tonnes
- success: statut de la prédiction
- timestamp: horodatage
