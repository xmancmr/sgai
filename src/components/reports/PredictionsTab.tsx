
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, BarChart3, TrendingUp, Zap } from 'lucide-react';
import SimplePredictionPanel from '@/components/predictions/SimplePredictionPanel';
import ParcelPredictionCard from '@/components/predictions/ParcelPredictionCard';
import PredictionComparisonChart from '@/components/predictions/PredictionComparisonChart';
import SimpleScenarioSimulator from '@/components/predictions/SimpleScenarioSimulator';

const mockParcels = [
  { id: '1', name: 'Parcelle Nord', crop: 'Canne à sucre', surface: 12.5, region: 'CENTRE', lastYield: 78 },
  { id: '2', name: 'Parcelle Est', crop: 'Banane', surface: 8.3, region: 'EST', lastYield: 30 },
  { id: '3', name: 'Parcelle Sud', crop: 'Ananas', surface: 15.7, region: 'SUD', lastYield: 47 },
  { id: '4', name: 'Parcelle Ouest', crop: 'Igname', surface: 10.2, region: 'OUEST', lastYield: 16 },
];

const PredictionsTab: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState('general');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
          <Target className="h-6 w-6 text-green-600" />
          Prédictions de Production
        </h2>
        <p className="text-muted-foreground">
          Prévisions automatiques pour optimiser vos rendements et planifier votre production
        </p>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Prédiction Rapide
          </TabsTrigger>
          <TabsTrigger value="parcels" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Par Parcelle
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="scenarios" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Scénarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <SimplePredictionPanel />
        </TabsContent>

        <TabsContent value="parcels" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Prédictions par Parcelle</h3>
              <p className="text-muted-foreground mb-6">
                Prévisions automatiques pour chaque parcelle selon leurs caractéristiques.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockParcels.map((parcel) => (
                <ParcelPredictionCard key={parcel.id} parcel={parcel} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Historique et Tendances</h3>
              <p className="text-muted-foreground mb-6">
                Comparez vos résultats actuels avec les prévisions pour améliorer la précision.
              </p>
            </div>
            <PredictionComparisonChart />
          </div>
        </TabsContent>

        <TabsContent value="scenarios" className="mt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-4">Simulation de Scénarios</h3>
              <p className="text-muted-foreground mb-6">
                Testez différentes stratégies et découvrez leurs impacts sur votre production.
              </p>
            </div>
            <SimpleScenarioSimulator />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PredictionsTab;
