import secrets
from flask_jwt_extended import JWTManager
from flask import Flask

from sgai.api.predict import bp as predict_bp
from sgai.api.diagnostic import bp as diagnostic_bp
from sgai.api.clustering import bp as clustering_bp
from sgai.api.optimization import bp as optimization_bp
from sgai.api.routes.predictions import bp as predictions_bp
from sgai.api.routes.report import bp as report_bp


# Génère une clé secrète JWT sécurisée à chaque démarrage (à fixer en prod !)
JWT_SECRET_KEY = secrets.token_hex(32)  # 64 caractères hexadécimaux
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
jwt = JWTManager(app)
print(f"[INFO] JWT_SECRET_KEY utilisé pour Flask-JWT-Extended : {JWT_SECRET_KEY}")


app.register_blueprint(predict_bp)
app.register_blueprint(diagnostic_bp)
app.register_blueprint(clustering_bp)
app.register_blueprint(optimization_bp)
app.register_blueprint(predictions_bp)
app.register_blueprint(report_bp)

@app.route('/')
def index():
    return 'SGAI API is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
