from flask import Blueprint, request, jsonify
from sklearn.cluster import KMeans
import numpy as np

bp = Blueprint('clustering', __name__)

@bp.route('/cluster', methods=['POST'])
def cluster():
    data = request.get_json()
    X = np.array(data['features'])
    n_clusters = int(data.get('n_clusters', 3))
    kmeans = KMeans(n_clusters=n_clusters, random_state=42)
    labels = kmeans.fit_predict(X)
    return jsonify({'labels': labels.tolist()})
