
# SGAI - Système de Gestion Agricole Intelligente

## Structure détaillée du projet

```
sgai/
├── api/                # Endpoints Flask (prédiction, diagnostic, clustering, optimisation, reporting)
│   └── routes/         # Blueprints Flask (prédiction, clustering, etc.)
├── models/             # Modèles ML sauvegardés (.pkl) et scripts d'entraînement (train_model.py)
├── data/               # Jeux de données de référence (CSV, pour l'entraînement des modèles)
├── frontend/           # Application React/TypeScript (UI, dashboards, formulaires, animations)
├── requirements.txt    # Dépendances Python backend
├── Dockerfile          # Image backend Flask/ML
├── docker-compose.yml  # Orchestration multi-service (backend, frontend, etc.)
├── README.md           # Documentation
└── ...
```

**Données d'entraînement** : Les fichiers CSV du dossier `data/` servent uniquement à entraîner les modèles de référence (production, superficie, prix, etc.).

**Données utilisateur** : Les données affichées dans l'application sont celles de chaque utilisateur, stockées dans Supabase (import CSV, saisie manuelle, etc.).

**Modèles ML** : Chaque tâche (prédiction de production, de superficie, etc.) dispose de son propre modèle, entraîné automatiquement à partir des datasets pertinents. Des modèles innovants sont créés par fusion intelligente de plusieurs fichiers (ex : Production + Prix, Superficie + Prix, etc.).

## Installation

### Prérequis
- Python 3.8+
- pip
- Docker (optionnel)

### Installation locale
```bash
cd sgai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```


## Entraînement automatique des modèles IA

1. Placez vos fichiers CSV de référence dans `sgai/data/` (voir exemples fournis).
2. Le script `models/train_model.py` entraîne automatiquement :
   - Un modèle pour chaque fichier CSV mappé (ex : production, superficie, prix).
   - Des modèles innovants issus de la fusion de plusieurs datasets (ex : prédire la production à partir de la superficie et du prix).
3. Lancez l'entraînement global :
   ```bash
   python models/train_model.py
   ```
   Tous les modèles et scalers sont sauvegardés dans `sgai/models/` avec des noms explicites.

**Adapter les fusions** : Pour créer de nouveaux modèles combinés, modifiez la section "FUSIONS INNOVANTES" dans `train_model.py`.

**Exemple de modèles générés** :
  - `rf_model_Production_des_principales_cultures_2018.pkl` (production 2018)
  - `rf_model_superficie_production.pkl` (production prédite à partir de la superficie)
  - `rf_model_prix_production.pkl` (production prédite à partir du prix)
  - `rf_model_superficie_prix_production.pkl` (production prédite à partir de la superficie et du prix)


## Lancement du backend Flask

```bash
export FLASK_APP=main.py
flask run
```

Le backend expose des endpoints pour la prédiction, le clustering, l'optimisation, le reporting, etc. Les modèles sont chargés automatiquement depuis `models/`.

## Endpoints disponibles
- `POST /predict_rendement` : Prédiction rendement (tabulaire)
- `POST /detect_disease` : Détection maladie (image)
- `POST /cluster` : Clustering parcelles/utilisateurs
- `POST /optimize` : Optimisation des ressources


## Déploiement avec Docker

### Backend seul
```bash
docker build -t sgai-backend .
docker run -p 5000:5000 sgai-backend
```

### Orchestration complète (backend, frontend, etc.)
```yaml
version: '3'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./models:/app/models
      - ./data:/app/data
  # Ajouter ici le service frontend si besoin
```



## Exemple d'intégration Frontend <-> Backend

### 1. Appel API côté React (extrait de `frontend/src/components/PredictionForm.tsx`)

```tsx
import React, { useState } from 'react';

export const PredictionForm = () => {
  const [features, setFeatures] = useState({});
  const [result, setResult] = useState(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeatures({ ...features, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/predict/production', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features }),
  };

  return (
      <input name="feature2" onChange={handleChange} placeholder="Feature 2" />
      {/* Ajoutez d'autres champs selon vos besoins */}
      <button type="submit">Prédire</button>
  );
```

### 2. Endpoint Flask correspondant (`api/routes/predictions.py`)

```python
@bp.route('/api/predict/production', methods=['POST'])
def predict_production():
    data = request.get_json()
    X = pd.DataFrame([data['features']])
    y_pred = models.predict_production(X)
    return jsonify({'prediction': float(y_pred[0])})
```

### 3. Exemple d'appel API avec curl

```bash
curl -X POST http://localhost:5000/api/predict/production \
     -H 'Content-Type: application/json' \
     -d '{"features": {"feature1": 1.2, "feature2": 0.5}}'
```

---


## Exemples d'intégration avancée Frontend <-> Backend

### 1. Prédiction tabulaire (production, coûts, météo, etc.)

- Voir plus haut pour le schéma React/Flask/curl (remplacer l'endpoint par `/api/predict/costs`, `/api/predict/weather`, etc.)

### 2. Upload d'image (détection maladie)

#### React (extrait)
```tsx
const [file, setFile] = useState<File|null>(null);
const [result, setResult] = useState(null);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) setFile(e.target.files[0]);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  if (file) formData.append('image', file);
  const res = await fetch('/api/detect_disease', {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  setResult(data.predictions);
};
```

#### Flask
```python
@bp.route('/detect_disease', methods=['POST'])
def detect_disease():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    file = request.files['image']
    # ... traitement image ...
    return jsonify({'predictions': [...]})
```

#### curl
```bash
curl -X POST http://localhost:5000/api/detect_disease \
     -F image=@/chemin/vers/mafeuille.jpg
```

### 3. Clustering (KMeans)

#### React (extrait)
```tsx
const handleClustering = async () => {
  const res = await fetch('/api/cluster', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ features: [[1.2, 0.5], [2.1, 1.3]], n_clusters: 3 }),
  });
  const data = await res.json();
  setResult(data.labels);
};
```

#### Flask
```python
@bp.route('/cluster', methods=['POST'])
def cluster():
    data = request.get_json()
    X = np.array(data['features'])
    n_clusters = int(data.get('n_clusters', 3))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(X)
    return jsonify({'labels': labels.tolist()})
```

#### curl
```bash
curl -X POST http://localhost:5000/api/cluster \
     -H 'Content-Type: application/json' \
     -d '{"features": [[1.2, 0.5], [2.1, 1.3]], "n_clusters": 3}'
```

### 4. Optimisation (allocation ressources)

#### React (extrait)
```tsx
const handleOptimize = async () => {
  const res = await fetch('/api/optimize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ costs: [1,2,3], A_ub: [[1,1,0]], b_ub: [2], bounds: [[0,1],[0,2],[0,3]] }),
  });
  const data = await res.json();
  setResult(data.x);
};
```

#### Flask
```python
@bp.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    c = np.array(data['costs'])
    A_ub = np.array(data['A_ub'])
    b_ub = np.array(data['b_ub'])
    bounds = data.get('bounds', None)
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds)
    return jsonify({'success': res.success, 'x': res.x.tolist(), 'fun': res.fun})
```

#### curl
```bash
curl -X POST http://localhost:5000/api/optimize \
     -H 'Content-Type: application/json' \
     -d '{"costs": [1,2,3], "A_ub": [[1,1,0]], "b_ub": [2], "bounds": [[0,1],[0,2],[0,3]]}'
```

---


## Génération de rapports automatiques

### 1. Générer un rapport CSV

```python
import pandas as pd
from services import report_generator

df = pd.read_csv('data/production_predictions.csv')
report_generator.generate_csv_report(df, 'results/rapport_production.csv')
```

### 2. Générer un rapport DOCX avec résumé et interprétation

```python
from services import report_generator

df = pd.read_csv('data/production_predictions.csv')
summary = "Résumé automatique des résultats de prédiction."
interpretation = "Le rendement moyen est en hausse par rapport à l'année précédente."
plots = ['results/graphique1.png']  # Graphiques générés avec matplotlib
report_generator.generate_docx_report(df, 'results/rapport_production.docx', summary, plots, interpretation)
```

- Le module `report_generator.py` permet de produire des rapports professionnels à partir de vos résultats IA.
- Les rapports peuvent être partagés avec les parties prenantes ou archivés pour audit.

---


## Exemple d'appel API pour le reporting automatique

### 1. Génération d'un rapport CSV

#### Frontend (fetch)
```js
fetch('/api/report/csv', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: [
      { col1: 1, col2: 2 },
      { col1: 3, col2: 4 }
    ],
    output_path: 'results/rapport_auto.csv'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### curl
```bash
curl -X POST http://localhost:5000/api/report/csv \
     -H 'Content-Type: application/json' \
     -d '{"data": [{"col1": 1, "col2": 2}, {"col1": 3, "col2": 4}], "output_path": "results/rapport_auto.csv"}'
```

### 2. Génération d'un rapport DOCX

#### Frontend (fetch)
```js
fetch('/api/report/docx', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: [
      { col1: 1, col2: 2 },
      { col1: 3, col2: 4 }
    ],
    summary: 'Résumé automatique',
    interpretation: 'Interprétation IA',
    plots: ['results/graphique1.png'],
    output_path: 'results/rapport_auto.docx'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

#### curl
```bash
curl -X POST http://localhost:5000/api/report/docx \
     -H 'Content-Type: application/json' \
     -d '{"data": [{"col1": 1, "col2": 2}, {"col1": 3, "col2": 4}], "summary": "Résumé automatique", "interpretation": "Interprétation IA", "plots": ["results/graphique1.png"], "output_path": "results/rapport_auto.docx"}'
```

---


## Frontend

L'application React/TypeScript (dossier `frontend/`) permet à chaque utilisateur :
- D'importer ses propres données (CSV ou saisie manuelle)
- De visualiser ses résultats, graphiques et dashboards personnalisés
- D'utiliser les modèles ML pour obtenir des prédictions sur ses propres données (les données de référence ne servent qu'à l'entraînement)
- Toutes les données utilisateurs sont stockées dans Supabase (sécurité, personnalisation, partage)

**Animations et UI** : L'interface est professionnelle, ergonomique, animée (GSAP, animejs), avec un thème agricole et un mode sombre.

**Pour développer le frontend** :
```bash
cd frontend
npm install
npm run dev
```



## Sécurité

- Les accès API sont protégés par des tokens JWT (à configurer dans Flask).
- Les données utilisateurs sont isolées et sécurisées dans Supabase (authentification, RBAC).
- Les imports de fichiers sont validés côté backend (type, taille, contenu).
- Les dépendances sont régulièrement mises à jour et vérifiées (pip, npm audit).
- Les modèles ML sont versionnés et stockés dans un dossier non accessible publiquement.

## CI/CD

- **Tests automatiques** : Ajoutez vos tests dans `tests/` (backend et frontend). Utilisez `pytest` pour Python, `jest` pour React.
- **Linting** : Utilisez `flake8` (Python) et `eslint` (JS/TS) pour garantir la qualité du code.
- **GitHub Actions** : Exemple de workflow pour build, test et déploiement Docker :
  ```yaml
  name: CI/CD
  on: [push]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v3
        - name: Set up Python
          uses: actions/setup-python@v4
          with:
            python-version: '3.11'
        - name: Install backend dependencies
          run: |
            cd sgai
            pip install -r requirements.txt
        - name: Run backend tests
          run: |
            cd sgai
            pytest
        - name: Set up Node.js
          uses: actions/setup-node@v3
          with:
            node-version: '20'
        - name: Install frontend dependencies
          run: |
            cd sgai/frontend
            npm install
        - name: Run frontend tests
          run: |
            cd sgai/frontend
            npm run test
        - name: Build Docker image
          run: |
            cd sgai
            docker build -t sgai-backend .
  ```
- **Déploiement** : Utilisez Docker Compose ou un service cloud (Azure, AWS, GCP, Railway, etc.).

## FAQ

**Q : Puis-je utiliser mes propres données pour la prédiction ?**
A : Oui, chaque utilisateur peut importer ses données (CSV ou formulaire) et obtenir des prédictions personnalisées.

**Q : Les données d'entraînement sont-elles visibles par les utilisateurs ?**
A : Non, seules les données de l'utilisateur sont affichées dans l'application. Les datasets de référence servent uniquement à entraîner les modèles.

**Q : Comment ajouter un nouveau modèle ou une nouvelle fusion de datasets ?**
A : Modifiez la section "FUSIONS INNOVANTES" dans `models/train_model.py` pour créer de nouveaux modèles combinés.

**Q : Comment réentraîner les modèles ?**
A : Placez vos nouveaux CSV dans `data/` et relancez `python models/train_model.py`.

**Q : Comment contribuer ?**
A : Forkez le repo, créez une branche, proposez une PR. Merci de respecter les conventions de code et d'ajouter des tests !

## Contact

Pour toute question ou contribution, contactez l'équipe SGAI.
