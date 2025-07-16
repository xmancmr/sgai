
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, RotateCcw, Trash2, TrendingUp, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Scenario {
  id: string;
  name: string;
  culture: string;
  superficie: number;
  region: string;
  production?: number;
  revenue?: number;
  isLoading?: boolean;
}

const SimpleScenarioSimulator: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([
    { 
      id: '1', 
      name: 'Scénario actuel', 
      culture: 'Canne à sucre', 
      superficie: 10, 
      region: 'CENTRE',
      production: 820,
      revenue: 36900
    },
  ]);
  
  const [newScenario, setNewScenario] = useState<Partial<Scenario>>({
    name: '',
    culture: 'Canne à sucre',
    superficie: 10,
    region: 'CENTRE',
  });

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

  const addScenario = () => {
    if (newScenario.name && newScenario.name.trim()) {
      const scenario: Scenario = {
        id: Date.now().toString(),
        name: newScenario.name,
        culture: newScenario.culture || 'Canne à sucre',
        superficie: newScenario.superficie || 10,
        region: newScenario.region || 'CENTRE',
      };
      setScenarios([...scenarios, scenario]);
      setNewScenario({ name: '', culture: 'Canne à sucre', superficie: 10, region: 'CENTRE' });
      toast.success(`Scénario "${scenario.name}" ajouté`);
    } else {
      toast.error('Veuillez saisir un nom pour le scénario');
    }
  };

  const simulateScenario = (scenario: Scenario) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenario.id ? { ...s, isLoading: true } : s
    ));
    
    toast.info(`Simulation en cours pour ${scenario.name}...`);
    
    setTimeout(() => {
      const selectedCulture = cultures.find(c => c.name === scenario.culture);
      const selectedRegion = regions.find(r => r.name === scenario.region);
      
      if (selectedCulture && selectedRegion) {
        const baseYield = selectedCulture.yield * selectedRegion.multiplier;
        const variationFactor = 0.9 + Math.random() * 0.2;
        const predictedYield = baseYield * variationFactor;
        const totalProduction = Math.round(predictedYield * scenario.superficie);
        const estimatedRevenue = Math.round(totalProduction * selectedCulture.price);
        
        setScenarios(prev => prev.map(s => 
          s.id === scenario.id 
            ? { ...s, production: totalProduction, revenue: estimatedRevenue, isLoading: false }
            : s
        ));
        
        toast.success(`Simulation terminée: ${totalProduction} tonnes prévues`);
      }
    }, 2000);
  };

  const deleteScenario = (scenarioId: string) => {
    const scenario = scenarios.find(s => s.id === scenarioId);
    setScenarios(prev => prev.filter(s => s.id !== scenarioId));
    if (scenario) {
      toast.success(`Scénario "${scenario.name}" supprimé`);
    }
  };

  const resetScenarios = () => {
    setScenarios(prev => prev.map(s => ({ 
      ...s, 
      production: undefined, 
      revenue: undefined 
    })));
    toast.info('Toutes les simulations ont été réinitialisées');
  };

  const bestScenario = scenarios
    .filter(s => s.production !== undefined)
    .sort((a, b) => (b.production || 0) - (a.production || 0))[0];

  return (
    <div className="space-y-6">
      {/* Création de nouveaux scénarios */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Créer un nouveau scénario
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="scenario-name">Nom du scénario</Label>
              <Input
                id="scenario-name"
                value={newScenario.name || ''}
                onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Doubler la superficie"
              />
            </div>
            <div>
              <Label htmlFor="scenario-culture">Culture</Label>
              <Select 
                value={newScenario.culture} 
                onValueChange={(value) => setNewScenario(prev => ({ ...prev, culture: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cultures.map(culture => (
                    <SelectItem key={culture.name} value={culture.name}>{culture.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="scenario-superficie">Superficie (ha)</Label>
              <Input
                id="scenario-superficie"
                type="number"
                value={newScenario.superficie || ''}
                onChange={(e) => setNewScenario(prev => ({ ...prev, superficie: parseFloat(e.target.value) }))}
                min="0.1"
                step="0.1"
              />
            </div>
            <div>
              <Label htmlFor="scenario-region">Région</Label>
              <Select 
                value={newScenario.region} 
                onValueChange={(value) => setNewScenario(prev => ({ ...prev, region: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.name} value={region.name}>{region.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={addScenario} 
              disabled={!newScenario.name || !newScenario.name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter le scénario
            </Button>
            <Button onClick={resetScenarios} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Réinitialiser tout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des scénarios */}
      <Card>
        <CardHeader>
          <CardTitle>Vos Scénarios</CardTitle>
        </CardHeader>
        <CardContent>
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
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {scenario.production !== undefined && scenario.revenue !== undefined && !scenario.isLoading && (
                      <motion.div 
                        className="text-right"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="font-bold text-green-600">
                          {scenario.production} tonnes
                        </div>
                        <div className="text-sm text-blue-600">
                          {scenario.revenue.toLocaleString()} €
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(scenario.production / scenario.superficie).toFixed(1)} t/ha
                        </div>
                      </motion.div>
                    )}
                    
                    {scenario.isLoading && (
                      <div className="text-right">
                        <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mb-1"></div>
                        <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mb-1"></div>
                        <div className="animate-pulse bg-gray-200 h-3 w-10 rounded"></div>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => simulateScenario(scenario)} 
                        disabled={scenario.isLoading}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {scenario.isLoading ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Play className="h-4 w-4 mr-2" />
                        )}
                        {scenario.isLoading ? 'Calcul...' : 'Simuler'}
                      </Button>
                      
                      {scenario.id !== '1' && (
                        <Button 
                          onClick={() => deleteScenario(scenario.id)}
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
        </CardContent>
      </Card>

      {/* Meilleur scénario */}
      <AnimatePresence>
        {bestScenario && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <h3 className="font-medium text-green-800">Meilleur scénario</h3>
                    <p className="text-green-700">
                      <strong>{bestScenario.name}</strong> avec{' '}
                      <strong>{bestScenario.production} tonnes</strong> et{' '}
                      <strong>{bestScenario.revenue?.toLocaleString()} €</strong> de revenus
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {scenarios.filter(s => s.production !== undefined).length === 0 && (
        <motion.div 
          className="text-center py-8 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>Aucune simulation n'a encore été exécutée.</p>
          <p className="text-sm mt-1">Cliquez sur "Simuler" pour commencer l'analyse.</p>
        </motion.div>
      )}
    </div>
  );
};

export default SimpleScenarioSimulator;
