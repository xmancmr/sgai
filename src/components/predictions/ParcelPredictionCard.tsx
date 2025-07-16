
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMLPredictions } from '@/hooks/use-ml-predictions';
import { MapPin, TrendingUp, Calendar, Loader2 } from 'lucide-react';

interface ParcelPredictionCardProps {
  parcel: {
    id: string;
    name: string;
    crop: string;
    surface: number;
    region: string;
    lastYield?: number;
  };
}

const ParcelPredictionCard: React.FC<ParcelPredictionCardProps> = ({ parcel }) => {
  const { predict, isLoading } = useMLPredictions();
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<string>('');

  const handlePredict = async () => {
    const inputData = {
      cultures: parcel.crop,
      annee: new Date().getFullYear(),
      superficie: parcel.surface,
      region: parcel.region,
    };

    const result = await predict(inputData);
    if (result.success && result.prediction) {
      setPrediction(result.prediction);
      // Calculer un niveau de confiance basé sur les données historiques
      const confidenceLevel = parcel.lastYield 
        ? Math.abs(result.prediction - parcel.lastYield) < (parcel.lastYield * 0.2) ? 'Élevée' : 'Moyenne'
        : 'Moyenne';
      setConfidence(confidenceLevel);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-green-600" />
            {parcel.name}
          </div>
          <Badge variant="outline">{parcel.crop}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Surface:</span>
            <p className="font-medium">{parcel.surface} ha</p>
          </div>
          <div>
            <span className="text-muted-foreground">Région:</span>
            <p className="font-medium">{parcel.region}</p>
          </div>
        </div>

        {parcel.lastYield && (
          <div className="text-sm">
            <span className="text-muted-foreground">Dernier rendement:</span>
            <p className="font-medium">{parcel.lastYield.toFixed(1)} t/ha</p>
          </div>
        )}

        <Button 
          onClick={handlePredict} 
          disabled={isLoading}
          className="w-full"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Prédiction...
            </>
          ) : (
            <>
              <TrendingUp className="mr-2 h-4 w-4" />
              Prédire la production
            </>
          )}
        </Button>

        {prediction !== null && (
          <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">Prédiction IA</p>
                <p className="text-xs text-muted-foreground">
                  Confiance: {confidence}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {prediction.toFixed(1)} t
                </div>
                <div className="text-xs text-muted-foreground">
                  {(prediction / parcel.surface).toFixed(1)} t/ha
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParcelPredictionCard;
