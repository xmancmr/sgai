import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Button } from '../ui/button';
import { TrendingUp, TrendingDown, Target, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ActionResult {
  id: string;
  adviceId: string;
  title: string;
  category: string;
  status: 'completed' | 'in_progress' | 'planned';
  implementedDate: Date;
  measuredImpact: {
    metric: string;
    before: number;
    after: number;
    improvement: number;
    unit: string;
  };
  roi: number;
  notes: string;
}

const ImpactResultsTab = () => {
  const [results] = useState<ActionResult[]>([
    {
      id: 'result-1',
      adviceId: 'advice-1',
      title: 'Redistribution des effectifs',
      category: 'Ressources Humaines',
      status: 'completed',
      implementedDate: new Date('2024-05-15'),
      measuredImpact: {
        metric: 'Efficacité opérationnelle',
        before: 65,
        after: 82,
        improvement: 17,
        unit: '%'
      },
      roi: 1.8,
      notes: 'Réaffectation de 3 employés vers des tâches de supervision. Réduction des temps morts de 25%.'
    },
    {
      id: 'result-2',
      adviceId: 'advice-2',
      title: 'Optimisation irrigation',
      category: 'Production',
      status: 'in_progress',
      implementedDate: new Date('2024-06-01'),
      measuredImpact: {
        metric: 'Rendement',
        before: 32,
        after: 36,
        improvement: 12.5,
        unit: 't/ha'
      },
      roi: 2.3,
      notes: 'Installation système irrigation goutte-à-goutte. Économie d\'eau de 30% et amélioration qualité.'
    },
    {
      id: 'result-3',
      adviceId: 'advice-3',
      title: 'Négociation achats groupés',
      category: 'Finances',
      status: 'completed',
      implementedDate: new Date('2024-04-20'),
      measuredImpact: {
        metric: 'Coût des intrants',
        before: 2200,
        after: 1850,
        improvement: -15.9,
        unit: '€/ha'
      },
      roi: 3.2,
      notes: 'Partenariat avec 5 exploitations voisines. Réduction significative des coûts fertilisants et semences.'
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'planned':
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateOverallROI = () => {
    const completedResults = results.filter(r => r.status === 'completed');
    return completedResults.reduce((acc, r) => acc + r.roi, 0) / completedResults.length;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-600" />
              Actions Menées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.length}</div>
            <p className="text-sm text-gray-600">
              {results.filter(r => r.status === 'completed').length} terminées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              ROI Moyen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {calculateOverallROI().toFixed(1)}x
            </div>
            <p className="text-sm text-gray-600">Retour sur investissement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-agri-primary" />
              Impact Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-agri-primary">+18%</div>
            <p className="text-sm text-gray-600">Amélioration globale</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Résultats Détaillés</h3>
        
        {results.map((result) => (
          <Card key={result.id} className="border-l-4 border-l-agri-primary">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center">
                  {getStatusIcon(result.status)}
                  <span className="ml-2">{result.title}</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(result.status)}>
                    {result.status === 'completed' ? 'Terminé' : 
                     result.status === 'in_progress' ? 'En cours' : 'Planifié'}
                  </Badge>
                  <Badge variant="outline">{result.category}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Impact Mesuré</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avant:</span>
                      <span className="font-medium">
                        {result.measuredImpact.before} {result.measuredImpact.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Après:</span>
                      <span className="font-medium">
                        {result.measuredImpact.after} {result.measuredImpact.unit}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Amélioration:</span>
                      <span className={`font-bold flex items-center ${
                        result.measuredImpact.improvement > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {result.measuredImpact.improvement > 0 ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {Math.abs(result.measuredImpact.improvement)}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Retour sur Investissement</h4>
                  <div className="text-2xl font-bold text-green-600 mb-2">
                    {result.roi.toFixed(1)}x
                  </div>
                  <Progress 
                    value={Math.min(result.roi * 20, 100)} 
                    className="h-2"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Notes d'Implementation</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                  {result.notes}
                </p>
              </div>
              
              <div className="text-sm text-gray-500">
                Implémenté le {result.implementedDate.toLocaleDateString('fr-FR')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center">
            <h3 className="font-semibold text-blue-900 mb-2">
              Suivi automatique des performances
            </h3>
            <p className="text-blue-700 text-sm">
              Vos résultats sont analysés automatiquement pour générer de nouveaux conseils personnalisés dans l'onglet "Pour vous".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactResultsTab;
