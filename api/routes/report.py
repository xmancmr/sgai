
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from sgai.services import report_generator
import pandas as pd
import os

bp = Blueprint('report', __name__)

@bp.route('/api/report/csv', methods=['POST'])
@jwt_required()
def generate_csv():
    data = request.get_json()
    df = pd.DataFrame(data['data'])
    output_path = data.get('output_path', 'results/rapport_auto.csv')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    report_generator.generate_csv_report(df, output_path)
    return jsonify({'status': 'ok', 'path': output_path})

@bp.route('/api/report/docx', methods=['POST'])
@jwt_required()
def generate_docx():
    data = request.get_json()
    df = pd.DataFrame(data['data'])
    summary = data.get('summary', '')
    interpretation = data.get('interpretation', '')
    plots = data.get('plots', [])
    output_path = data.get('output_path', 'results/rapport_auto.docx')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    report_generator.generate_docx_report(df, output_path, summary, plots, interpretation)
    return jsonify({'status': 'ok', 'path': output_path})
