def merge_and_train(csv_paths, target_col, merge_on, model_name=None):
    # Fusionne plusieurs CSV sur une ou plusieurs colonnes, puis entraîne un modèle
    dfs = [pd.read_csv(p) for p in csv_paths]
    df_merged = dfs[0]
    for df in dfs[1:]:
        df_merged = pd.merge(df_merged, df, on=merge_on, how='inner')
    print(f"\n[INFO] Fusion de {len(csv_paths)} fichiers sur {merge_on} pour la cible '{target_col}'")
    return train_rf_model(None, target_col, model_name=model_name, df=df_merged)

import os
import sys
import argparse
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PowerTransformer, LabelEncoder
from sklearn.metrics import mean_squared_error, r2_score


def train_rf_model(abs_csv_path, target_col, model_name=None, df=None):
    if df is None:
        df = pd.read_csv(abs_csv_path)
        name_hint = os.path.basename(abs_csv_path)
    else:
        name_hint = model_name or 'merged_dataset'
    if target_col not in df.columns:
        print(f"Colonne cible '{target_col}' introuvable dans {name_hint}.")
        print(f"Colonnes disponibles : {list(df.columns)}")
        return False
    # Imputation des NaN dans la cible (par défaut : moyenne)
    impute_strategy = 'mean'  # 'mean' ou 'median' (à rendre paramétrable si besoin)
    if df[target_col].isnull().any():
        if impute_strategy == 'mean':
            fill_value = df[target_col].mean()
        elif impute_strategy == 'median':
            fill_value = df[target_col].median()
        else:
            print(f"Stratégie d'imputation inconnue: {impute_strategy}. Utilisation de la moyenne.")
            fill_value = df[target_col].mean()
        print(f"[INFO] Imputation des NaN dans '{target_col}' par la {impute_strategy} ({fill_value:.3f}) pour {name_hint}.")
        df[target_col] = df[target_col].fillna(fill_value)
    X = df.drop(columns=[target_col])
    y = df[target_col]
    if len(df) == 0:
        print(f"Aucune donnée pour la cible '{target_col}' dans {name_hint}. Modèle non entraîné.")
        return False
    # Imputation des NaN dans les features X (par la moyenne)
    if X.isnull().any().any():
        for col in X.columns:
            if X[col].isnull().any():
                fill_value = X[col].mean()
                print(f"[INFO] Imputation des NaN dans la feature '{col}' par la moyenne ({fill_value:.3f}) pour {name_hint}.")
                X[col] = X[col].fillna(fill_value)
    # Encodage simple + sauvegarde des encoders
    encoders = {}
    for col in X.select_dtypes(include='object').columns:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        encoders[col] = le
    scaler = PowerTransformer()
    X_scaled = scaler.fit_transform(X)
    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    model = RandomForestRegressor(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    print(f"\nModèle pour {name_hint} (cible: {target_col})")
    print('MSE:', mean_squared_error(y_test, y_pred))
    print('R2:', r2_score(y_test, y_pred))
    os.makedirs('models', exist_ok=True)
    if not model_name:
        model_name = f"rf_model_{name_hint}_{target_col}.pkl"
    scaler_name = model_name.replace('rf_model_', 'scaler_')
    meta_name = model_name.replace('rf_model_', 'meta_').replace('.pkl', '.joblib')
    # Sauvegarde du modèle, scaler, encoders, colonnes/features
    joblib.dump(model, os.path.join('models', model_name))
    joblib.dump(scaler, os.path.join('models', scaler_name))
    meta = {
        'features': list(X.columns),
        'encoders': encoders,
    }
    joblib.dump(meta, os.path.join('models', meta_name))
    print(f'Modèle sauvegardé : models/{model_name}')
    print(f'Scaler sauvegardé : models/{scaler_name}')
    print(f'Métadonnées sauvegardées : models/{meta_name}')
    return True


def list_csv_files(data_dir):
    return [f for f in os.listdir(data_dir) if f.endswith('.csv')]


if __name__ == '__main__':
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_dir = os.path.normpath(os.path.join(base_dir, '..', 'data'))
    csv_files = list_csv_files(data_dir)
    if not csv_files:
        print(f"Aucun fichier CSV trouvé dans {data_dir}.")
        sys.exit(1)

    # Mapping automatique fichier -> colonnes cibles potentielles (à adapter selon besoins)
    csv_targets = {
        # fichier : [liste de colonnes cibles]
        'Production des principales cultures (2015-2018).csv': ['2015', '2016', '2017', '2018'],
        'Superficie des cultures (2014-2018).csv': ['2014', '2015', '2016', '2017', '2018'],
        'Prix moyens (2014-2016).csv': ['2014', '2015', '2016', '2017'],
        # Ajouter d'autres mappings selon la structure des fichiers
    }

    for csv_file in csv_files:
        abs_csv_path = os.path.join(data_dir, csv_file)
        # Détection automatique des colonnes cibles si connues, sinon skip
        targets = csv_targets.get(csv_file, None)
        if not targets:
            print(f"[INFO] Fichier ignoré (pas de mapping automatique de colonne cible) : {csv_file}")
            continue
        for target_col in targets:
            print(f"\n--- Entraînement modèle pour {csv_file} (cible: {target_col}) ---")
            train_rf_model(abs_csv_path, target_col)

    # --- FUSIONS INNOVANTES ---
    prod_path = os.path.join(data_dir, 'Production des principales cultures (2015-2018).csv')
    surf_path = os.path.join(data_dir, 'Superficie des cultures (2014-2018).csv')
    prix_path = os.path.join(data_dir, 'Prix moyens (2014-2016).csv')

    # 1. Superficie + Production (déjà présent)
    if os.path.exists(prod_path) and os.path.exists(surf_path):
        prod = pd.read_csv(prod_path)
        surf = pd.read_csv(surf_path)
        prod_melt = prod.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Production')
        surf_melt = surf.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Superficie')
        merged = pd.merge(prod_melt, surf_melt, on=['Groupes','Cultures','Année'])
        print("\n--- Entraînement modèle fusionné (Superficie -> Production) ---")
        train_rf_model(None, 'Production', model_name='rf_model_superficie_production.pkl', df=merged)

    # 2. Production + Prix moyens (prédire la production en fonction du prix)
    if os.path.exists(prod_path) and os.path.exists(prix_path):
        prod = pd.read_csv(prod_path)
        prix = pd.read_csv(prix_path)
        prod_melt = prod.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Production')
        prix_melt = prix.melt(id_vars=['Groupes de produits','Cultures'], var_name='Année', value_name='Prix')
        # Harmoniser les noms de colonnes pour la fusion
        prix_melt = prix_melt.rename(columns={'Groupes de produits':'Groupes'})
        merged = pd.merge(prod_melt, prix_melt, on=['Groupes','Cultures','Année'])
        print("\n--- Entraînement modèle fusionné (Prix -> Production) ---")
        train_rf_model(None, 'Production', model_name='rf_model_prix_production.pkl', df=merged)

    # 3. Superficie + Prix moyens (prédire la superficie en fonction du prix)
    if os.path.exists(surf_path) and os.path.exists(prix_path):
        surf = pd.read_csv(surf_path)
        prix = pd.read_csv(prix_path)
        surf_melt = surf.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Superficie')
        prix_melt = prix.melt(id_vars=['Groupes de produits','Cultures'], var_name='Année', value_name='Prix')
        prix_melt = prix_melt.rename(columns={'Groupes de produits':'Groupes'})
        merged = pd.merge(surf_melt, prix_melt, on=['Groupes','Cultures','Année'])
        print("\n--- Entraînement modèle fusionné (Prix -> Superficie) ---")
        train_rf_model(None, 'Superficie', model_name='rf_model_prix_superficie.pkl', df=merged)

    # 4. Superficie + Production + Prix moyens (prédire la production à partir de la superficie et du prix)
    if os.path.exists(prod_path) and os.path.exists(surf_path) and os.path.exists(prix_path):
        prod = pd.read_csv(prod_path)
        surf = pd.read_csv(surf_path)
        prix = pd.read_csv(prix_path)
        prod_melt = prod.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Production')
        surf_melt = surf.melt(id_vars=['Groupes','Cultures'], var_name='Année', value_name='Superficie')
        prix_melt = prix.melt(id_vars=['Groupes de produits','Cultures'], var_name='Année', value_name='Prix')
        prix_melt = prix_melt.rename(columns={'Groupes de produits':'Groupes'})
        merged = prod_melt.merge(surf_melt, on=['Groupes','Cultures','Année'])
        merged = merged.merge(prix_melt, on=['Groupes','Cultures','Année'])
        print("\n--- Entraînement modèle fusionné (Superficie + Prix -> Production) ---")
        train_rf_model(None, 'Production', model_name='rf_model_superficie_prix_production.pkl', df=merged)
