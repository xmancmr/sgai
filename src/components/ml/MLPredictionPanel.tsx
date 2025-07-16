
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMLPredictions } from '@/hooks/use-ml-predictions';
import { Brain, Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MLPredictionPanel = () => {
  const {
    isLoading,
    isModelLoaded,
    modelInfo,
    checkHealth,
    loadModel,
    predict,
  } = useMLPredictions();

  const [predictionForm, setPredictionForm] = useState<Record<string, string>>({
    cultures: 'Maïs',
    annee: '2024',
    superficie: '10',
    region: 'CENTRE',
  });

  const [lastPrediction, setLastPrediction] = useState<number | null>(null);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  const handleInputChange = (field: string, value: string) => {
    setPredictionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    const inputData = {
      cultures: predictionForm.cultures,
      annee: parseInt(predictionForm.annee),
      superficie: parseFloat(predictionForm.superficie),
      region: predictionForm.region,
    };

    const result = await predict(inputData);
    if (result.success && result.prediction) {
      setLastPrediction(result.prediction);
    }
  };

  if (!isModelLoaded) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Intelligence Artificielle - Prédiction de Production
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Le modèle d'IA n'est pas encore chargé. Cliquez sur le bouton ci-dessous pour l'initialiser.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4">
            <Button 
              onClick={loadModel} 
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Chargement du modèle...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Charger le modèle d'IA
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Prédiction de Production par IA
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Modèle chargé
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulaire de prédiction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cultures">Culture</Label>
            <Input
              id="cultures"
              value={predictionForm.cultures}
              onChange={(e) => handleInputChange('cultures', e.target.value)}
              placeholder="Ex: Maïs, Arachide, Riz..."
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="annee">Année</Label>
            <Input
              id="annee"
              type="number"
              value={predictionForm.annee}
              onChange={(e) => handleInputChange('annee', e.target.value)}
              min="2020"
              max="2030"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="superficie">Superficie (ha)</Label>
            <Input
              id="superficie"
              type="number"
              value={predictionForm.superficie}
              onChange={(e) => handleInputChange('superficie', e.target.value)}
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="region">Région</Label>
            <Input
              id="region"
              value={predictionForm.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              placeholder="Ex: CENTRE, NORD, SUD..."
            />
          </div>
        </div>

        {/* Bouton de prédiction */}
        <Button 
          onClick={handlePredict} 
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Prédire la production
            </>
          )}
        </Button>

        {/* Résultat de la prédiction */}
        {lastPrediction !== null && (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Prédiction IA</h3>
                <p className="text-sm text-muted-foreground">
                  Basée sur les données historiques et l'apprentissage automatique
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  {lastPrediction.toFixed(2)} tonnes
                </div>
                <div className="text-sm text-muted-foreground">
                  Production estimée
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Informations sur le modèle */}
        {modelInfo && (
          <div className="text-xs text-muted-foreground border-t pt-4">
            <p>
              Modèle: {modelInfo.metadata.model_type} | 
              Caractéristiques: {modelInfo.feature_names.length} | 
              Cible: {modelInfo.metadata.target_column}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MLPredictionPanel;
