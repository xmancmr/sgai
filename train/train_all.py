import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor
# ... autres imports

def train_and_save(X, y, model, path):
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print('RMSE:', mean_squared_error(y_test, y_pred, squared=False))
    print('MAE:', mean_absolute_error(y_test, y_pred))
    print('R2:', r2_score(y_test, y_pred))
    joblib.dump(model, path)

# Exemple d'utilisation pour chaque modèle
# df = pd.read_csv('data/production.csv')
# train_and_save(df.drop('target', axis=1), df['target'], RandomForestRegressor(), 'models/production_model.pkl')
