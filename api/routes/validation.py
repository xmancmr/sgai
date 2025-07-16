import pandas as pd
import numpy as np

def validate_and_prepare_features(X, expected_columns, encoders=None, fillna_strategy='mean'):
    """
    - Vérifie que X contient exactement les colonnes attendues (ordre, noms).
    - Impute les NaN (par la moyenne ou médiane).
    - Convertit les types (float par défaut).
    - Applique les encoders si fournis (LabelEncoder pour les colonnes catégorielles).
    - Retourne un DataFrame prêt pour la prédiction ou l'entraînement.
    """
    # Vérification des colonnes
    missing = [col for col in expected_columns if col not in X.columns]
    extra = [col for col in X.columns if col not in expected_columns]
    if missing or extra:
        raise ValueError(f"Colonnes attendues: {expected_columns}. Colonnes reçues: {list(X.columns)}. Manquantes: {missing}. En trop: {extra}")
    X = X[expected_columns]
    # Imputation des NaN
    for col in X.columns:
        if X[col].isnull().any():
            if fillna_strategy == 'mean':
                fill_value = X[col].mean()
            elif fillna_strategy == 'median':
                fill_value = X[col].median()
            else:
                fill_value = 0
            X[col] = X[col].fillna(fill_value)
    # Conversion des types
    for col in X.columns:
        if X[col].dtype == object:
            if encoders and col in encoders:
                X[col] = encoders[col].transform(X[col].astype(str))
            else:
                X[col] = X[col].astype(str)
        else:
            X[col] = pd.to_numeric(X[col], errors='coerce')
    return X
