# backend/train_model_final.py
import os
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import (
    Input, Dense, Dropout, BatchNormalization, LayerNormalization
)
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import (
    EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
)
from tensorflow.keras.regularizers import l1_l2
from tensorflow.keras.initializers import HeUniform
from tensorflow.keras.losses import Huber  # Correction importante
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import (
    StandardScaler, LabelEncoder, PowerTransformer
)
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.feature_selection import mutual_info_regression
import joblib
import glob
import json
import re
import warnings
import shutil
import unicodedata
from collections import defaultdict

# Désactiver les warnings
warnings.filterwarnings('ignore')

# 1. Configuration
class Config:
    SEED = 42
    TEST_SIZE = 0.15
    VAL_SIZE = 0.15
    BATCH_SIZE = 64
    MAX_EPOCHS = 300
    PATIENCE = 20
    LEARNING_RATE = 0.001
    MIN_LR = 1e-6
    DROPOUT_RATE = 0.3
    L1_REG = 1e-5
    L2_REG = 1e-4
    EMBEDDING_SIZE = 8
    MODEL_SAVE_PATH = 'models/production_model_final.h5'
    TARGET_KEYWORDS = ['production', 'prod', 'output', 'yield', 'quantite', 'volume', 'rendement']
    NUMERIC_FALLBACKS = ['production', 'prod', 'yield']

config = Config()
np.random.seed(config.SEED)
tf.random.set_seed(config.SEED)

# Fonction pour normaliser les chaînes de caractères
def normalize_string(s):
    """Normalise une chaîne pour la comparaison"""
    if not isinstance(s, str):
        s = str(s)
    s = unicodedata.normalize('NFKD', s).encode('ASCII', 'ignore').decode('utf-8')
    s = s.lower().strip()
    s = re.sub(r'[^a-z0-9]', '', s)
    return s

# 2. Inspection des fichiers CSV
def inspect_csv_files():
    """Inspecte tous les fichiers CSV pour identifier les colonnes disponibles"""
    data_dir = "data"
    all_files = glob.glob(os.path.join(data_dir, "*.csv"))
    
    if not all_files:
        raise FileNotFoundError(f"Aucun fichier CSV trouvé dans {data_dir}")
    
    column_report = defaultdict(list)
    
    print("\n" + "="*80)
    print("INSPECTION DES FICHIERS CSV")
    print("="*80)
    
    for file in all_files:
        try:
            # Lire juste l'en-tête
            with open(file, 'r', encoding='utf-8', errors='replace') as f:
                header = f.readline().strip()
            
            columns = header.split(',')
            filename = os.path.basename(file)
            
            print(f"\nFichier: {filename}")
            print(f"Colonnes: {columns}")
            
            for col in columns:
                column_report[col].append(filename)
                
        except Exception as e:
            print(f"Erreur avec {file}: {str(e)}")
    
    return column_report

# 3. Chargement des fichiers CSV
def load_all_data():
    """Charge tous les fichiers CSV disponibles sans cible spécifique"""
    data_dir = "data"
    all_files = glob.glob(os.path.join(data_dir, "*.csv"))
    
    if not all_files:
        raise FileNotFoundError(f"Aucun fichier CSV trouvé dans {data_dir}")
    
    dfs = []
    for file in all_files:
        try:
            # Essayer plusieurs encodages
            for encoding in ['utf-8', 'latin1', 'ISO-8859-1']:
                try:
                    df = pd.read_csv(file, encoding=encoding, on_bad_lines='skip')
                    print(f"Chargé: {file} (encodage: {encoding})")
                    break
                except UnicodeDecodeError:
                    continue
                except Exception as e:
                    print(f"Erreur avec {file} ({encoding}): {str(e)}")
            
            # Ajouter le nom du fichier comme colonne
            df['source_file'] = os.path.basename(file)
            dfs.append(df)
        except Exception as e:
            print(f"Erreur avec {file}: {str(e)}")
    
    # Combiner tous les DataFrames
    if not dfs:
        raise ValueError("Aucun DataFrame valide n'a pu être chargé")
    
    combined_df = pd.concat(dfs, ignore_index=True, sort=False)
    print(f"\nTotal des données combinées: {len(combined_df)} lignes, {len(combined_df.columns)} colonnes")
    
    return combined_df

# 4. Sélection de la colonne cible
def select_target_column(df):
    """Sélectionne automatiquement une colonne cible numérique"""
    # Identifier les colonnes numériques
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    
    # 1. Chercher les colonnes avec mots-clés pertinents
    for col in df.columns:
        normalized_col = normalize_string(col)
        for keyword in config.TARGET_KEYWORDS:
            if keyword in normalized_col and col in numeric_cols:
                print(f"Sélection cible par mot-clé: '{col}'")
                return col
    
    # 2. Chercher les colonnes avec des noms de produits numériques
    production_like_cols = [col for col in numeric_cols 
                            if any(kw in normalize_string(col) 
                            for kw in ['production', 'prod', 'yield'])]
    
    if production_like_cols:
        print(f"Sélection cible par similarité: '{production_like_cols[0]}'")
        return production_like_cols[0]
    
    # 3. Fallback: Première colonne numérique
    if numeric_cols:
        print(f"Sélection cible par défaut: '{numeric_cols[0]}'")
        return numeric_cols[0]
    
    # 4. Dernier recours: Convertir une colonne
    for col in df.columns:
        try:
            # Tenter la conversion numérique
            df[col] = pd.to_numeric(df[col], errors='coerce')
            if not df[col].isnull().all():
                print(f"Conversion numérique réussie pour: '{col}'")
                return col
        except:
            continue
    
    raise ValueError("Aucune colonne numérique valide trouvée pour la cible")

# 5. Nettoyage des données
def clean_data(df, target_col):
    """Nettoie et prépare le DataFrame avec validation de la cible"""
    # Supprimer les colonnes vides
    df = df.dropna(axis=1, how='all')
    
    # Standardiser les noms de colonnes
    df.columns = [normalize_string(col) for col in df.columns]
    target_col = normalize_string(target_col)
    
    # Vérifier la présence de la colonne cible
    if target_col not in df.columns:
        available_cols = "\n".join(df.columns)
        raise ValueError(f"Colonne cible '{target_col}' non trouvée après nettoyage. Colonnes disponibles:\n{available_cols}")
    
    # Vérifier le type de la cible
    if not np.issubdtype(df[target_col].dtype, np.number):
        print(f"Conversion de la cible en numérique: '{target_col}'")
        try:
            # Tenter la conversion numérique
            df[target_col] = pd.to_numeric(df[target_col], errors='coerce')
            
            # Vérifier si la conversion a réussi
            if df[target_col].isnull().all():
                raise ValueError(f"Échec de conversion numérique pour '{target_col}'")
        except Exception as e:
            print(f"Erreur de conversion: {str(e)}")
            # Changer de cible si possible
            numeric_cols = df.select_dtypes(include=np.number).columns
            if target_col in numeric_cols:
                numeric_cols = numeric_cols.drop(target_col)
            if len(numeric_cols) > 0:
                new_target = numeric_cols[0]
                print(f"Changement de cible: '{target_col}' → '{new_target}'")
                target_col = new_target
            else:
                raise ValueError("Aucune colonne numérique disponible pour la cible")
    
    # Identifier les colonnes numériques et catégorielles
    numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = df.select_dtypes(exclude=np.number).columns.tolist()
    
    # Exclure la colonne cible des caractéristiques
    if target_col in numeric_cols:
        numeric_cols.remove(target_col)
    if target_col in categorical_cols:
        categorical_cols.remove(target_col)
    
    print("\nNettoyage des données:")
    print(f"Colonnes numériques: {len(numeric_cols)}")
    print(f"Colonnes catégorielles: {len(categorical_cols)}")
    print(f"Colonne cible: '{target_col}'")
    
    # Gestion des valeurs manquantes
    imputer_num = SimpleImputer(strategy='median')
    imputer_cat = SimpleImputer(strategy='most_frequent')
    
    if numeric_cols:
        df[numeric_cols] = imputer_num.fit_transform(df[numeric_cols])
    if categorical_cols:
        df[categorical_cols] = imputer_cat.fit_transform(df[categorical_cols])
    
    # Remplacer les valeurs manquantes dans la cible par la médiane
    if df[target_col].isnull().any():
        median_target = df[target_col].median()
        df[target_col].fillna(median_target, inplace=True)
        print(f"Valeurs manquantes dans la cible remplacées par la médiane: {median_target}")
    
    # Supprimer les colonnes avec peu de variance
    cols_to_drop = []
    for col in numeric_cols:
        if col in df.columns and df[col].nunique() <= 1:
            cols_to_drop.append(col)
    
    for col in categorical_cols:
        if col in df.columns and (df[col].nunique() == len(df) or df[col].nunique() == 1):
            cols_to_drop.append(col)
    
    if cols_to_drop:
        print(f"Suppression des colonnes à faible variance: {cols_to_drop}")
        df = df.drop(columns=cols_to_drop)
    
    # Mettre à jour les listes de colonnes
    numeric_cols = [col for col in numeric_cols if col in df.columns]
    categorical_cols = [col for col in categorical_cols if col in df.columns]
    
    # Supprimer les doublons
    initial_count = len(df)
    df = df.drop_duplicates()
    final_count = len(df)
    print(f"Doublons supprimés: {initial_count - final_count}")
    
    return df, target_col

# 6. Feature Engineering
def feature_engineering(df, target_col):
    """Crée de nouvelles caractéristiques et sélectionne les meilleures"""
    # Créer des caractéristiques temporelles
    time_cols = [col for col in df.columns if 'annee' in col or 'year' in col or 'date' in col]
    if time_cols:
        time_col = time_cols[0]
        df['time_norm'] = (df[time_col] - df[time_col].min()) / (df[time_col].max() - df[time_col].min())
    
    # Interactions entre caractéristiques
    area_cols = [col for col in df.columns if 'superficie' in col or 'area' in col or 'surface' in col]
    price_cols = [col for col in df.columns if 'prix' in col or 'price' in col or 'cost' in col]
    
    if area_cols and price_cols:
        area_col = area_cols[0]
        price_col = price_cols[0]
        df['area_price_ratio'] = df[area_col] * df[price_col]
    
    # Sélection de caractéristiques basée sur l'information mutuelle
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Encoder les variables catégorielles pour MI
    X_encoded = X.copy()
    for col in X_encoded.select_dtypes(include='object').columns:
        le = LabelEncoder()
        X_encoded[col] = le.fit_transform(X_encoded[col].astype(str))
    
    # Calculer les scores MI
    mi_scores = mutual_info_regression(X_encoded, y, random_state=config.SEED)
    mi_scores = pd.Series(mi_scores, index=X_encoded.columns)
    mi_scores = mi_scores.sort_values(ascending=False)
    
    # Sélectionner les top caractéristiques
    top_n = min(20, len(mi_scores))
    top_features = mi_scores.head(top_n).index.tolist()
    df = df[top_features + [target_col]]
    
    # Sauvegarder l'importance des caractéristiques
    os.makedirs('results', exist_ok=True)
    mi_scores.to_csv('results/feature_importance.csv')
    
    print(f"\nTop {top_n} caractéristiques sélectionnées:")
    print(top_features)
    
    return df, target_col

# 7. Préparation des données
def prepare_data(df, target_col):
    """Prépare les données pour l'entraînement"""
    # Séparer les caractéristiques et la cible
    X = df.drop(columns=[target_col])
    y = df[target_col]
    
    # Séparer les types de caractéristiques
    numeric_cols = X.select_dtypes(include=np.number).columns.tolist()
    categorical_cols = X.select_dtypes(exclude=np.number).columns.tolist()
    
    # Encodage des variables catégorielles
    label_encoders = {}
    for col in categorical_cols:
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        label_encoders[col] = le
        os.makedirs('models', exist_ok=True)
        joblib.dump(le, f'models/{col}_encoder.pkl')
    
    # Transformation numérique
    scaler = PowerTransformer()
    if numeric_cols:
        X[numeric_cols] = scaler.fit_transform(X[numeric_cols])
    joblib.dump(scaler, 'models/scaler.pkl')
    
    # Division des données
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=config.TEST_SIZE, random_state=config.SEED
    )
    
    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=config.VAL_SIZE, random_state=config.SEED
    )
    
    print(f"\nFormes des données:")
    print(f"Entraînement: {X_train.shape}")
    print(f"Validation: {X_val.shape}")
    print(f"Test: {X_test.shape}")
    
    return X_train, X_val, X_test, y_train, y_val, y_test

# 8. Architecture du Modèle
def create_advanced_model(input_shape):
    """Crée un modèle de deep learning avancé"""
    # Entrée pour les caractéristiques
    input_layer = Input(shape=(input_shape,))
    x = input_layer
    
    # Couches denses avec régularisation
    x = Dense(256, activation='swish', 
              kernel_initializer=HeUniform(),
              kernel_regularizer=l1_l2(config.L1_REG, config.L2_REG))(x)
    x = BatchNormalization()(x)
    x = Dropout(config.DROPOUT_RATE)(x)
    
    x = Dense(192, activation='swish',
              kernel_initializer=HeUniform(),
              kernel_regularizer=l1_l2(config.L1_REG, config.L2_REG))(x)
    x = LayerNormalization()(x)
    x = Dropout(config.DROPOUT_RATE * 0.8)(x)
    
    x = Dense(128, activation='swish',
              kernel_initializer=HeUniform(),
              kernel_regularizer=l1_l2(config.L1_REG, config.L2_REG))(x)
    
    # Mécanisme d'attention
    attention = Dense(128, activation='softmax')(x)
    x = tf.keras.layers.multiply([x, attention])
    
    # Couche de sortie
    output = Dense(1, activation='linear')(x)
    
    model = Model(inputs=input_layer, outputs=output)
    
    # Optimiseur
    optimizer = Adam(
        learning_rate=config.LEARNING_RATE,
        beta_1=0.9,
        beta_2=0.999,
        epsilon=1e-7
    )
    
    # CORRECTION: Utilisation explicite de la classe Huber
    model.compile(
        optimizer=optimizer,
        loss=Huber(),  # Utilisation directe de la classe de perte
        metrics=['mae', tf.keras.metrics.RootMeanSquaredError(name='rmse')]
    )
    
    return model

# 9. Entraînement du modèle
def train_model(model, X_train, y_train, X_val, y_val):
    """Entraîne le modèle avec des callbacks avancés"""
    callbacks = [
        EarlyStopping(
            monitor='val_loss',
            patience=config.PATIENCE,
            restore_best_weights=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=7,
            min_lr=config.MIN_LR,
            verbose=1
        ),
        ModelCheckpoint(
            config.MODEL_SAVE_PATH,
            save_best_only=True,
            monitor='val_loss',
            verbose=1
        )
    ]
    
    print("\nDébut de l'entraînement du modèle...")
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=config.MAX_EPOCHS,
        batch_size=config.BATCH_SIZE,
        callbacks=callbacks,
        verbose=1
    )
    
    return history

# 10. Évaluation et visualisation
def evaluate_model(model, X_test, y_test, history):
    """Évalue le modèle et génère des visualisations"""
    # Prédictions
    print("\nÉvaluation sur l'ensemble de test...")
    y_pred = model.predict(X_test).flatten()
    
    # Métriques
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    r2 = r2_score(y_test, y_pred)
    mae = np.mean(np.abs(y_test - y_pred))
    
    print(f"\nPerformance finale:")
    print(f"MSE: {mse:.4f}")
    print(f"RMSE: {rmse:.4f}")
    print(f"MAE: {mae:.4f}")
    print(f"R²: {r2:.4f}")
    
    # Courbe d'apprentissage
    plt.figure(figsize=(12, 6))
    plt.plot(history.history['loss'], label='Entraînement')
    plt.plot(history.history['val_loss'], label='Validation')
    plt.title('Courbe d\'apprentissage')
    plt.xlabel('Époques')
    plt.ylabel('Perte')
    plt.legend()
    plt.savefig('results/learning_curve.png')
    plt.close()
    print("Courbe d'apprentissage sauvegardée")
    
    # Prédictions vs Réalité
    plt.figure(figsize=(10, 8))
    plt.scatter(y_test, y_pred, alpha=0.6)
    plt.plot([y_test.min(), y_test.max()], 
             [y_test.min(), y_test.max()], 'r--')
    plt.xlabel('Valeurs Réelles')
    plt.ylabel('Prédictions')
    plt.title('Prédictions vs Réalité')
    plt.grid(True)
    plt.savefig('results/predictions_vs_actual.png')
    plt.close()
    print("Graphique prédictions vs réalité sauvegardé")
    
    # Distribution des erreurs
    errors = y_test - y_pred
    plt.figure(figsize=(10, 6))
    sns.histplot(errors, kde=True)
    plt.title('Distribution des Erreurs de Prédiction')
    plt.xlabel('Erreur')
    plt.savefig('results/error_distribution.png')
    plt.close()
    print("Distribution des erreurs sauvegardée")
    
    # Sauvegarder les métriques
    metrics = {
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'best_epoch': len(history.history['loss']) - config.PATIENCE
    }
    
    with open('results/model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
    
    return metrics

# 11. Sauvegarde complète du modèle
def save_full_model(model, target_col, X_train):
    """Sauvegarde le modèle et tous ses artefacts dans un format prêt pour la production"""
    # 1. Sauvegarde au format HDF5 (pour Keras)
    model.save(config.MODEL_SAVE_PATH)
    print(f"Modèle sauvegardé (HDF5): {config.MODEL_SAVE_PATH}")
    
    # 2. Sauvegarde au format SavedModel (pour TF Serving)
    saved_model_path = "models/saved_model"
    tf.saved_model.save(model, saved_model_path)
    print(f"Modèle sauvegardé (SavedModel): {saved_model_path}")
    
    # 3. Sauvegarde des métadonnées
    feature_names = X_train.columns.tolist()
    
    metadata = {
        'target_column': target_col,
        'feature_names': feature_names,
        'model_type': 'regression',
        'input_shape': model.input_shape[1:],
        'output_shape': model.output_shape[1:]
    }
    
    with open('models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)
    
    print("Métadonnées du modèle sauvegardées")
    
    # 4. Création d'un package zip pour le déploiement
    shutil.make_archive('production_model', 'zip', 'models')
    print("Package de déploiement créé: production_model.zip")
    
    return feature_names

# 12. Pipeline principal
def main():
    print("="*80)
    print("🚀 DÉMARRAGE DU PIPELINE DE DEEP LEARNING AVANCÉ")
    print("="*80)
    
    # Créer les répertoires nécessaires
    os.makedirs("models", exist_ok=True)
    os.makedirs("results", exist_ok=True)
    os.makedirs("data", exist_ok=True)
    
    try:
        # Étape 1: Inspection des fichiers
        print("\n" + "="*80)
        print("ÉTAPE 1: INSPECTION DES FICHIERS CSV")
        print("="*80)
        column_report = inspect_csv_files()
        
        # Étape 2: Chargement des données
        print("\n" + "="*80)
        print("ÉTAPE 2: CHARGEMENT DES DONNÉES")
        print("="*80)
        df = load_all_data()
        
        # Étape 3: Sélection de la cible
        print("\n" + "="*80)
        print("ÉTAPE 3: SÉLECTION DE LA COLONNE CIBLE")
        print("="*80)
        target_col = select_target_column(df)
        print(f"Colonne cible sélectionnée: '{target_col}'")
        
        # Étape 4: Nettoyage des données
        print("\n" + "="*80)
        print("ÉTAPE 4: NETTOYAGE DES DONNÉES")
        print("="*80)
        df_clean, target_col = clean_data(df, target_col)
        print("\nAperçu des données nettoyées:")
        print(df_clean.head())
        
        # Étape 5: Feature Engineering
        print("\n" + "="*80)
        print("ÉTAPE 5: FEATURE ENGINEERING")
        print("="*80)
        df_fe, target_col = feature_engineering(df_clean, target_col)
        print("\nAperçu des données transformées:")
        print(df_fe.head())
        
        # Étape 6: Préparation des données
        print("\n" + "="*80)
        print("ÉTAPE 6: PRÉPARATION DES DONNÉES")
        print("="*80)
        X_train, X_val, X_test, y_train, y_val, y_test = prepare_data(df_fe, target_col)
        
        # Étape 7: Construction du modèle
        print("\n" + "="*80)
        print("ÉTAPE 7: CONSTRUCTION DU MODÈLE")
        print("="*80)
        model = create_advanced_model(X_train.shape[1])
        model.summary()
        
        # Étape 8: Entraînement
        print("\n" + "="*80)
        print("ÉTAPE 8: ENTRAÎNEMENT DU MODÈLE")
        print("="*80)
        history = train_model(model, X_train, y_train, X_val, y_val)
        
        # Étape 9: Évaluation
        print("\n" + "="*80)
        print("ÉTAPE 9: ÉVALUATION DU MODÈLE")
        print("="*80)
        metrics = evaluate_model(model, X_test, y_test, history)
        
        # Étape 10: Sauvegarde finale
        print("\n" + "="*80)
        print("ÉTAPE 10: SAUVEGARDE FINALE")
        print("="*80)
        feature_names = save_full_model(model, target_col, X_train)
        
        print("\n" + "="*80)
        print("✅ PIPELINE TERMINÉ AVEC SUCCÈS!")
        print("="*80)
        print(f"Le modèle est prêt à être utilisé dans le dossier: {os.path.abspath('models')}")
        print(f"Caractéristiques utilisées: {feature_names}")
        
    except Exception as e:
        print(f"\n❌ ERREUR CRITIQUE: {str(e)}")
        print("="*80)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()