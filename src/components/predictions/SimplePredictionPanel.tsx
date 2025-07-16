
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const SimplePredictionPanel = () => {
  const [predictionForm, setPredictionForm] = useState({
    culture: 'Canne à sucre',
    superficie: '10',
    region: 'CENTRE',
  });

  const [prediction, setPrediction] = useState<{
    production: number;
    revenue: number;
    confidence: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const cultures = [
    { name: 'Canne à sucre', yield: 82, price: 45 },
    { name: 'Banane', yield: 32, price: 180 },
    { name: 'Ananas', yield: 47, price: 210 },
    { name: 'Igname', yield: 16, price: 516 },
    { name: 'Manioc', yield: 25, price: 169 },
    { name: 'Maïs', yield: 4.5, price: 185 }
  ];

  const regions = [
    { name: 'CENTRE', multiplier: 1.0 },
    { name: 'NORD', multiplier: 0.95 },
    { name: 'SUD', multiplier: 1.05 },
    { name: 'EST', multiplier: 0.98 },
    { name: 'OUEST', multiplier: 1.02 }
  ];

  const handleInputChange = (field: string, value: string) => {
    setPredictionForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePrediction = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const selectedCulture = cultures.find(c => c.name === predictionForm.culture);
      const selectedRegion = regions.find(r => r.name === predictionForm.region);
      const superficie = parseFloat(predictionForm.superficie);
      
      if (selectedCulture && selectedRegion) {
        // Simulation de prédiction avec variations réalistes
        const baseYield = selectedCulture.yield * selectedRegion.multiplier;
        const variationFactor = 0.9 + Math.random() * 0.2; // ±10% de variation
        const predictedYield = baseYield * variationFactor;
        const totalProduction = predictedYield * superficie;
        const estimatedRevenue = totalProduction * selectedCulture.price;
        
        // Calcul de la confiance basé sur la culture et la région
        let confidenceScore = 85;
        if (['Canne à sucre', 'Banane'].includes(predictionForm.culture)) confidenceScore += 10;
        if (superficie >= 5 && superficie <= 20) confidenceScore += 5;
        
        const confidenceLevel = confidenceScore >= 90 ? 'Très élevée' : 
                               confidenceScore >= 80 ? 'Élevée' : 'Moyenne';
        
        setPrediction({
          production: Math.round(totalProduction * 10) / 10,
          revenue: Math.round(estimatedRevenue),
          confidence: confidenceLevel
        });
        
        toast.success(`Prédiction générée pour ${predictionForm.culture}`);
      }
      
      setIsLoading(false);
    }, 1500);
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'Très élevée': return 'bg-green-100 text-green-800';
      case 'Élevée': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Prédiction de Production
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Formulaire simplifié */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="culture" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Culture
              </Label>
              <Select value={predictionForm.culture} onValueChange={(value) => handleInputChange('culture', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map(culture => (
                    <SelectItem key={culture.name} value={culture.name}>
                      {culture.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="superficie">Superficie (hectares)</Label>
              <Input
                id="superficie"
                type="number"
                value={predictionForm.superficie}
                onChange={(e) => handleInputChange('superficie', e.target.value)}
                min="0.1"
                step="0.1"
                placeholder="Ex: 10"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Région
              </Label>
              <Select value={predictionForm.region} onValueChange={(value) => handleInputChange('region', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.name} value={region.name}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bouton de prédiction */}
          <Button 
            onClick={generatePrediction} 
            disabled={isLoading}
            className="w-full bg-green-600 hover:bg-green-700"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Calcul en cours...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Générer la prédiction
              </>
            )}
          </Button>

          {/* Résultats */}
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
            >
              <Card className="border-green-200 bg-green-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {prediction.production} tonnes
                    </div>
                    <p className="text-sm text-green-600 mt-1">Production prévue</p>
                    <p className="text-xs text-green-500 mt-1">
                      {(prediction.production / parseFloat(predictionForm.superficie)).toFixed(1)} t/ha
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {prediction.revenue.toLocaleString()} €
                    </div>
                    <p className="text-sm text-blue-600 mt-1">Revenus estimés</p>
                    <p className="text-xs text-blue-500 mt-1">
                      Estimation de marché
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Badge className={getConfidenceColor(prediction.confidence)}>
                      {prediction.confidence}
                    </Badge>
                    <p className="text-sm text-purple-600 mt-2">Fiabilité</p>
                    <p className="text-xs text-purple-500 mt-1">
                      Niveau de confiance
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Conseils automatiques */}
          {prediction && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg"
            >
              <h4 className="font-medium text-amber-800 mb-2">💡 Conseils personnalisés</h4>
              <ul className="text-amber-700 text-sm space-y-1">
                <li>• Prévoir la récolte pour {new Date(Date.now() + 90*24*60*60*1000).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</li>
                <li>• Optimiser l'irrigation 2 semaines avant la récolte</li>
                <li>• Surveiller les conditions météorologiques</li>
              </ul>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SimplePredictionPanel;
