
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Lightbulb, 
  BarChart3,
  Leaf,
  DollarSign,
  Calendar,
  ArrowRight
} from 'lucide-react';

export const FinancialInsights: React.FC = () => {
  const performanceScore = 85;
  const sectorComparison = {
    marge: { vous: 27.8, secteur: 18.5 },
    roi: { vous: 28.9, secteur: 22.1 },
    croissance: { vous: 12.5, secteur: 8.2 }
  };

  const insights = {
    strengths: [
      {
        title: "Excellente rentabilité",
        description: "Votre marge bénéficiaire dépasse la moyenne du secteur de 50%",
        impact: "Majeur"
      },
      {
        title: "Diversification réussie",
        description: "4 sources de revenus équilibrées réduisent les risques financiers",
        impact: "Important"
      },
      {
        title: "Croissance soutenue",
        description: "Progression de 12.5% sur les 6 derniers mois",
        impact: "Important"
      }
    ],
    opportunities: [
      {
        title: "Agriculture de précision",
        description: "Réduction potentielle de 15% des coûts d'intrants avec GPS et capteurs",
        potential: "1 495 200 FCFA",
        timeline: "6 mois"
      },
      {
        title: "Vente directe premium",
        description: "Labellisation bio pour augmenter la valeur ajoutée de 25-30%",
        potential: "4 672 425 FCFA",
        timeline: "12-18 mois"
      },
      {
        title: "Agrotourisme",
        description: "Développement d'activités touristiques sur l'exploitation",
        potential: "2 951 865 FCFA",
        timeline: "8-12 mois"
      }
    ],
    recommendations: [
      {
        priority: "Haute",
        action: "Optimiser les achats d'intrants",
        description: "Négocier des contrats groupés pour réduire les coûts de 8-12%",
        savings: "996 755 FCFA"
      },
      {
        priority: "Moyenne",
        action: "Automatisation partielle",
        description: "Investir dans des outils d'aide à la décision pour optimiser les rendements",
        savings: "557 564 FCFA"
      }
    ]
  };

  return (
    <div className="space-y-8">
      {/* Score de performance global */}
      <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-xl border-0">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold mb-2">Score de Performance</h2>
              <p className="text-green-100">Évaluation globale de votre exploitation</p>
            </div>
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">{performanceScore}</div>
              <div className="text-xl">/ 100</div>
              <Badge className="mt-2 bg-white text-green-800">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparaison sectorielle */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <BarChart3 className="h-5 w-5" />
            Comparaison avec le Secteur Agricole
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                label: 'Marge Bénéficiaire', 
                vous: sectorComparison.marge.vous, 
                secteur: sectorComparison.marge.secteur, 
                unit: '%' 
              },
              { 
                label: 'ROI', 
                vous: sectorComparison.roi.vous, 
                secteur: sectorComparison.roi.secteur, 
                unit: '%' 
              },
              { 
                label: 'Croissance', 
                vous: sectorComparison.croissance.vous, 
                secteur: sectorComparison.croissance.secteur, 
                unit: '%' 
              }
            ].map((metric, index) => (
              <div key={metric.label} className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-4 text-center">{metric.label}</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Votre exploitation</span>
                    <span className="font-bold text-green-800">{metric.vous}{metric.unit}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Moyenne secteur</span>
                    <span className="text-gray-600">{metric.secteur}{metric.unit}</span>
                  </div>
                  <div className="pt-2 border-t border-green-200">
                    <div className="text-center">
                      <Badge className="bg-green-100 text-green-800">
                        +{(metric.vous - metric.secteur).toFixed(1)}{metric.unit} vs secteur
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Forces et opportunités */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Forces */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Points Forts Identifiés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.strengths.map((strength, index) => (
                <Alert key={index} className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-green-800">{strength.title}</h4>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        {strength.impact}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{strength.description}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Opportunités */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Lightbulb className="h-5 w-5" />
              Opportunités de Développement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {insights.opportunities.map((opportunity, index) => (
                <Alert key={index} className="border-blue-200 bg-blue-50">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                  <AlertDescription>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-blue-800">{opportunity.title}</h4>
                      <div className="flex gap-1">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">
                          +{opportunity.potential}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {opportunity.timeline}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{opportunity.description}</p>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommandations prioritaires */}
      <Card className="bg-white shadow-lg border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Target className="h-5 w-5" />
            Recommandations Prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.recommendations.map((rec, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-orange-800">{rec.action}</h4>
                  <Badge className={`${
                    rec.priority === 'Haute' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {rec.priority}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-4">{rec.description}</p>
                <div className="flex items-center justify-between">
                  <Badge className="bg-green-100 text-green-800">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Économie: {rec.savings}
                  </Badge>
                  <Button variant="outline" size="sm" className="text-green-700 border-green-300 hover:bg-green-50">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Détails
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
