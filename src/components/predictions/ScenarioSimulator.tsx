import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMLPredictions } from '@/hooks/use-ml-predictions';
import { Play, RotateCcw, Trash2, Brain, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  id: string;
  name: string;
  culture: string;
  superficie: number;
  region: string;
  prediction?: number;
  confidence?: string;
  isLoading?: boolean;
}

const ScenarioSimulator: React.FC = () => {
  const { predict, isLoading: mlLoading, isModelLoaded } = useMLPredictions();
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { 
      id: '1', 
      name: 'Scénario de base', 
      culture: 'Canne à sucre', 
      superficie: 10, 
      region: 'CENTRE',
      prediction: 82.5,
      confidence: 'Élevée'
    },
  ]);
  const [currentScenario, setCurrentScenario] = useState<Partial<Scenario>>({
    name: '',
    culture: 'Canne à sucre',
    superficie: 10,
    region: 'CENTRE',
  });

  const cultures = ['Canne à sucre', 'Banane', 'Ananas', 'Igname', 'Madère', 'Maïs', 'Arachide'];
  const regions = ['CENTRE', 'NORD', 'SUD', 'EST', 'OUEST'];

  const handleAddScenario = () => {
    if (currentScenario.name && currentScenario.name.trim()) {
      const newScenario: Scenario = {
        id: Date.now().toString(),
        name: currentScenario.name,
        culture: currentScenario.culture || 'Canne à sucre',
        superficie: currentScenario.superficie || 10,
        region: currentScenario.region || 'CENTRE',
      };
      setScenarios([...scenarios, newScenario]);
      setCurrentScenario({ name: '', culture: 'Canne à sucre', superficie: 10, region: 'CENTRE' });
      toast.success(`Scénario "${newScenario.name}" ajouté avec succès`);
    } else {
      toast.error('Veuillez saisir un nom pour le scénario');
    }
  };

  const handleRunScenario = async (scenario: Scenario) => {
    console.log(`Simulation du scénario: ${scenario.name} avec le modèle ML`);
    
    // Marquer le scénario comme en cours de chargement
    setScenarios(prev => prev.map(s => 
      s.id === scenario.id ? { ...s, isLoading: true } : s
    ));
    
    toast.info(`Simulation IA en cours pour ${scenario.name}...`);
    
    try {
      if (!isModelLoaded) {
        toast.warning('Modèle ML non chargé, utilisation du modèle de fallback');
        // Fallback simulation
        const baseYield = getBaseYieldForCulture(scenario.culture);
        const regionMultiplier = getRegionMultiplier(scenario.region);
        const surfaceEffect = Math.min(1.1, 1 + (scenario.superficie - 10) * 0.005);
        
        const prediction = baseYield * regionMultiplier * surfaceEffect * (0.9 + Math.random() * 0.2);
        const totalProduction = prediction * scenario.superficie;
        const confidence = calculateConfidence(scenario.culture, scenario.region, scenario.superficie);
        
        setScenarios(prev => prev.map(s => 
          s.id === scenario.id 
            ? { ...s, prediction: totalProduction, confidence, isLoading: false }
            : s
        ));
        
        toast.success(`Prédiction réalisée: ${totalProduction.toFixed(1)} tonnes`);
        return;
      }

      // Utiliser le vrai modèle ML
      const inputData = {
        culture: scenario.culture,
        superficie: scenario.superficie,
        region: scenario.region,
        // Ajouter d'autres paramètres selon le modèle
        mois: new Date().getMonth() + 1,
        annee: new Date().getFullYear()
      };

      const result = await predict(inputData);
      
      if (result.success && result.prediction) {
        const totalProduction = result.prediction * scenario.superficie;
        const confidence = result.confidence || calculateConfidence(scenario.culture, scenario.region, scenario.superficie);
        
        setScenarios(prev => prev.map(s => 
          s.id === scenario.id 
            ? { ...s, prediction: totalProduction, confidence, isLoading: false }
            : s
        ));

        console.log(`Prédiction ML pour ${scenario.name}: ${totalProduction.toFixed(1)} tonnes`);
        toast.success(`Prédiction IA réalisée: ${totalProduction.toFixed(1)} tonnes`);
      } else {
        throw new Error(result.message || 'Erreur de prédiction');
      }
      
    } catch (error) {
      console.error(`Erreur lors de la simulation ML de ${scenario.name}:`, error);
      
      // Fallback en cas d'erreur ML
      const baseYield = getBaseYieldForCulture(scenario.culture);
      const regionMultiplier = getRegionMultiplier(scenario.region);
      const surfaceEffect = Math.min(1.1, 1 + (scenario.superficie - 10) * 0.005);
      
      const prediction = baseYield * regionMultiplier * surfaceEffect * (0.9 + Math.random() * 0.2);
      const totalProduction = prediction * scenario.superficie;
      const confidence = 'Moyenne (Fallback)';
      
      setScenarios(prev => prev.map(s => 
        s.id === scenario.id 
          ? { ...s, prediction: totalProduction, confidence, isLoading: false }
          : s
      ));
      
      toast.warning(`Prédiction de fallback utilisée: ${totalProduction.toFixed(1)} tonnes`);
    }
  };

  const getBaseYieldForCulture = (culture: string): number => {
    const yields: Record<string, number> = {
      'Canne à sucre': 82,
      'Banane': 32,
      'Ananas': 47,
      'Igname': 16,
      'Madère': 22,
      'Maïs': 4.5,
      'Arachide': 1.8
    };
    return yields[culture] || 50;
  };

  const getRegionMultiplier = (region: string): number => {
    const multipliers: Record<string, number> = {
      'CENTRE': 1.0,
      'NORD': 0.95,
      'SUD': 1.05,
      'EST': 0.98,
      'OUEST': 1.02
    };
    return multipliers[region] || 1.0;
  };

  const calculateConfidence = (culture: string, region: string, superficie: number): string => {
    let score = 80;
    
    if (['Canne à sucre', 'Banane'].includes(culture)) score += 10;
    if (culture === 'Igname') score -= 5;
    
    if (superficie >= 5 && superficie <= 20) score += 5;
    if (superficie > 50) score -= 10;
    
    if (score >= 90) return 'Très élevée';
    if (score >= 75) return 'Élevée';
    if (score >= 60) return 'Moyenne';
    return 'Faible';
  };

  const handleReset = () => {
    setScenarios(prev => prev.map(s => ({ 
      ...s, 
      prediction: undefined, 
      confidence: undefined 
    })));
    toast.info('Toutes les prédictions ont été réinitialisées');
  };

  const handleDeleteScenario = (scenarioId: string) => {
    const scenarioToDelete = scenarios.find(s => s.id === scenarioId);
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (scenarioToDelete) {
      toast.success(`Scénario "${scenarioToDelete.name}" supprimé`);
    }
  };

  const bestScenario = scenarios
    .filter(s => s.prediction !== undefined)
    .sort((a, b) => (b.prediction || 0) - (a.prediction || 0))[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-600" />
              Simulateur de Scénarios IA
            </span>
            <div className="flex gap-2">
              {!isModelLoaded && (
                <div className="flex items-center gap-1 text-orange-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Modèle non chargé
                </div>
              )}
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Création de nouveaux scénarios */}
          <motion.div 
            className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Créer un nouveau scénario
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="scenario-name">Nom du scénario</Label>
                <Input
                  id="scenario-name"
                  value={currentScenario.name || ''}
                  onChange={(e) => setCurrentScenario(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Augmentation superficie"
                />
              </div>
              <div>
                <Label htmlFor="scenario-culture">Culture</Label>
                <Select 
                  value={currentScenario.culture} 
                  onValueChange={(value) => setCurrentScenario(prev => ({ ...prev, culture: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {cultures.map(culture => (
                      <SelectItem key={culture} value={culture}>{culture}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="scenario-superficie">Superficie (ha)</Label>
                <Input
                  id="scenario-superficie"
                  type="number"
                  value={currentScenario.superficie || ''}
                  onChange={(e) => setCurrentScenario(prev => ({ ...prev, superficie: parseFloat(e.target.value) }))}
                  min="0.1"
                  step="0.1"
                />
              </div>
              <div>
                <Label htmlFor="scenario-region">Région</Label>
                <Select 
                  value={currentScenario.region} 
                  onValueChange={(value) => setCurrentScenario(prev => ({ ...prev, region: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button 
              onClick={handleAddScenario} 
              className="mt-4" 
              disabled={!currentScenario.name || !currentScenario.name.trim()}
            >
              Ajouter le scénario
            </Button>
          </motion.div>

          {/* Liste des scénarios avec animations */}
          <div className="space-y-3">
            <AnimatePresence>
              {scenarios.map((scenario, index) => (
                <motion.div 
                  key={scenario.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{scenario.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {scenario.culture} • {scenario.superficie} ha • {scenario.region}
                    </p>
                    {scenario.confidence && (
                      <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        Confiance: {scenario.confidence}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    {scenario.prediction !== undefined && !scenario.isLoading && (
                      <motion.div 
                        className="text-right"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="font-bold text-green-600">
                          {scenario.prediction.toFixed(1)} tonnes
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(scenario.prediction / scenario.superficie).toFixed(1)} t/ha
                        </div>
                      </motion.div>
                    )}
                    {scenario.isLoading && (
                      <div className="text-right">
                        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1"></div>
                        <div className="animate-pulse bg-gray-200 h-4 w-12 rounded"></div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleRunScenario(scenario)} 
                        disabled={mlLoading || scenario.isLoading}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {scenario.isLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {scenario.isLoading ? 'Simulation...' : 'Simuler IA'}
                      </Button>
                      {scenario.id !== '1' && (
                        <Button 
                          onClick={() => handleDeleteScenario(scenario.id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Meilleur scénario avec animation */}
          <AnimatePresence>
            {bestScenario && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg"
              >
                <h3 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                  🏆 <Brain className="h-4 w-4" /> Meilleur scénario IA
                </h3>
                <p className="text-green-700">
                  <strong>{bestScenario.name}</strong> avec une production prédite de{' '}
                  <strong>{bestScenario.prediction?.toFixed(1)} tonnes</strong>
                  {bestScenario.confidence && (
                    <span className="ml-2 text-sm">
                      (Confiance: {bestScenario.confidence})
                    </span>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {scenarios.filter(s => s.prediction !== undefined).length === 0 && (
            <motion.div 
              className="text-center py-8 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-12 w-12 mx-auto mb-4 text-blue-300" />
              <p>Aucune simulation IA n'a encore été exécutée.</p>
              <p className="text-sm mt-1">Cliquez sur "Simuler IA" pour commencer l'analyse prédictive.</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ScenarioSimulator;
