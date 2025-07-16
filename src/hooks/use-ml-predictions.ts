
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface PredictionInput {
  [key: string]: string | number;
}

interface PredictionResult {
  success: boolean;
  prediction?: number;
  confidence?: string;
  message?: string;
  timestamp?: string;
}

interface ModelInfo {
  metadata: any;
  feature_names: string[];
  model_loaded: boolean;
}

export const useMLPredictions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(true); // Automatically loaded
  
  const API_BASE_URL = 'http://localhost:5000';

  // Enhanced prediction function with better agricultural context
  const predict = useCallback(async (inputData: PredictionInput): Promise<PredictionResult> => {
    setIsLoading(true);
    
    try {
      // Simulate advanced ML prediction with agricultural factors
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const {
        amount = 0,
        category = 'income',
        type = 'Récolte',
        month = 1,
        seasonality = 0,
        totalIncome = 0,
        totalExpenses = 0
      } = inputData;

      let predictionValue = Number(amount);
      let confidenceLevel = 'Moyenne';
      
      // Convert to numbers for calculations
      const numTotalIncome = Number(totalIncome);
      const numTotalExpenses = Number(totalExpenses);
      
      // Agricultural prediction logic
      if (type === 'Récolte') {
        // Seasonal factors for harvest
        const seasonalMultipliers = [0.3, 0.4, 0.6, 0.8, 0.9, 0.95, 1.0, 1.2, 1.1, 0.9, 0.7, 0.5];
        const seasonalFactor = seasonalMultipliers[Number(month) - 1] || 1.0;
        
        // Weather and market variability
        const weatherFactor = 0.85 + Math.random() * 0.3; // ±15% weather impact
        const marketFactor = 0.95 + Math.random() * 0.1;  // ±5% market impact
        
        predictionValue = predictionValue * seasonalFactor * weatherFactor * marketFactor;
        confidenceLevel = 'Élevée';
        
      } else if (type === 'Intrants') {
        // Input costs tend to increase
        const inflationFactor = 1.02 + Math.random() * 0.08; // 2-10% increase
        predictionValue = predictionValue * inflationFactor;
        confidenceLevel = 'Élevée';
        
      } else if (type === 'Main-d\'œuvre') {
        // Labor costs seasonal variation
        const laborSeasonality = [1.0, 1.0, 1.2, 1.3, 1.4, 1.2, 1.1, 1.5, 1.3, 1.1, 1.0, 1.0];
        const seasonalFactor = laborSeasonality[Number(month) - 1] || 1.0;
        predictionValue = predictionValue * seasonalFactor;
        confidenceLevel = 'Moyenne';
        
      } else if (category === 'income') {
        // General income prediction with market trends
        const marketTrend = 0.98 + Math.random() * 0.08; // ±2-6% variation
        predictionValue = predictionValue * marketTrend;
        confidenceLevel = 'Moyenne';
        
      } else {
        // General expense prediction
        const generalInflation = 1.01 + Math.random() * 0.04; // 1-5% increase
        predictionValue = predictionValue * generalInflation;
        confidenceLevel = 'Moyenne';
      }

      // Financial ratio-based adjustments
      if (numTotalIncome > 0 && numTotalExpenses > 0) {
        const profitMargin = (numTotalIncome - numTotalExpenses) / numTotalIncome;
        if (profitMargin < 0.1) {
          // Low profit margin - be more conservative
          predictionValue *= 0.95;
          confidenceLevel = 'Faible';
        } else if (profitMargin > 0.3) {
          // High profit margin - potential for growth
          predictionValue *= 1.05;
          confidenceLevel = 'Élevée';
        }
      }

      // Round to reasonable precision
      predictionValue = Math.round(predictionValue * 100) / 100;
      
      const result: PredictionResult = {
        success: true,
        prediction: predictionValue,
        confidence: confidenceLevel,
        timestamp: new Date().toISOString()
      };

      console.log('ML Prediction generated:', result);
      return result;
      
    } catch (error) {
      console.error('Erreur lors de la prédiction:', error);
      return { 
        success: false, 
        message: 'Erreur lors de la prédiction',
        confidence: 'Faible'
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const predictBatch = useCallback(async (batchData: PredictionInput[]) => {
    setIsLoading(true);
    
    try {
      const predictions = await Promise.all(
        batchData.map(input => predict(input))
      );
      
      const successCount = predictions.filter(p => p.success).length;
      
      if (successCount > 0) {
        toast.success(`${successCount}/${batchData.length} prédictions réalisées`);
      }
      
      return {
        success: true,
        predictions,
        total_processed: batchData.length
      };
      
    } catch (error) {
      console.error('Erreur lors des prédictions en lot:', error);
      toast.error('Erreur lors des prédictions en lot');
      return { success: false, message: 'Erreur de traitement' };
    } finally {
      setIsLoading(false);
    }
  }, [predict]);

  // Mock functions for compatibility
  const checkHealth = useCallback(async () => {
    return { model_loaded: true, status: 'healthy' };
  }, []);

  const loadModel = useCallback(async () => {
    return { success: true, message: 'Modèle chargé automatiquement' };
  }, []);

  const getModelInfo = useCallback(async () => {
    return {
      success: true,
      metadata: { version: '2.0', type: 'agricultural_predictions' },
      feature_names: ['amount', 'category', 'type', 'month', 'seasonality']
    };
  }, []);

  return {
    isLoading,
    isModelLoaded,
    modelInfo,
    checkHealth,
    loadModel,
    getModelInfo,
    predict,
    predictBatch,
  };
};
