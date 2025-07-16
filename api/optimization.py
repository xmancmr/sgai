from flask import Blueprint, request, jsonify
from scipy.optimize import linprog
import numpy as np

bp = Blueprint('optimization', __name__)

@bp.route('/optimize', methods=['POST'])
def optimize():
    data = request.get_json()
    c = np.array(data['costs'])
    A_ub = np.array(data['A_ub'])
    b_ub = np.array(data['b_ub'])
    bounds = data.get('bounds', None)
    res = linprog(c, A_ub=A_ub, b_ub=b_ub, bounds=bounds)
    return jsonify({'success': res.success, 'x': res.x.tolist(), 'fun': res.fun})
