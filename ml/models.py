import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
# ... autres imports nécessaires

def predict_production(X):
    model = joblib.load('models/production_model.pkl')
    return model.predict(X)

def predict_cost_variation(X):
    model = joblib.load('models/cost_model.pkl')
    return model.predict(X)

def predict_weather(X):
    model = joblib.load('models/weather_model.pkl')
    return model.predict(X)

def predict_inflation(X):
    model = joblib.load('models/inflation_model.pkl')
    return model.predict(X)

def predict_volatility(X):
    model = joblib.load('models/volatility_model.pkl')
    return model.predict(X)
