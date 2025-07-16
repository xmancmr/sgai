
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Target, Lightbulb } from 'lucide-react';

interface ReportAnalysisSectionProps {
  reportData: any;
}

export const ReportAnalysisSection: React.FC<ReportAnalysisSectionProps> = ({ reportData }) => {
  const performanceAnalysis = {
    strengths: [
      {
        title: "Rentabilité excellente",
        description: "Votre marge bénéficiaire de 27.8% dépasse largement la moyenne du secteur agricole (15-20%)",
        impact: "Fort",
        icon: CheckCircle,
        color: "text-green-600"
      },
      {
        title: "Diversification des revenus",
        description: "Bonne répartition entre ventes directes (64%) et subventions (26%), réduisant les risques",
        impact: "Moyen",
        icon: Target,
        color: "text-blue-600"
      },
      {
        title: "Contrôle des coûts matériel",
        description: "Réduction de 15.2% des dépenses en matériel par rapport à l'année précédente",
        impact: "Fort",
        icon: TrendingDown,
        color: "text-green-600"
      }
    ],
    improvements: [
      {
        title: "Optimisation des intrants",
        description: "Hausse de 8.3% des coûts d'intrants. Considérez l'agriculture de précision pour réduire les gaspillages",
        priority: "Haute",
        potentialSaving: "2 500€",
        icon: AlertTriangle,
        color: "text-orange-600"
      },
      {
        title: "Gestion de la main d'œuvre",
        description: "Augmentation de 5.7% des coûts de main d'œuvre. Étudiez l'automatisation de certaines tâches",
        priority: "Moyenne",
        potentialSaving: "1 200€",
        icon: TrendingUp,
        color: "text-yellow-600"
      }
    ],
    opportunities: [
      {
        title: "Agrotourisme",
        description: "Vos 'autres revenus' ont augmenté de 28.3%. Développer le tourisme rural pourrait doubler cette source",
        potential: "+5 000€",
        timeline: "6-12 mois",
        icon: Lightbulb,
        color: "text-purple-600"
      },
      {
        title: "Vente directe premium",
        description: "Vos récoltes génèrent 45 860€. Une labellisation bio pourrait augmenter la valeur de 20-30%",
        potential: "+9 000€",
        timeline: "12-24 mois",
        icon: TrendingUp,
        color: "text-green-600"
      }
    ]
  };

  const financialHealth = {
    score: 82,
    status: "Excellent",
    indicators: [
      { name: "Liquidité", value: 85, status: "Très bon" },
      { name: "Rentabilité", value: 92, status: "Excellent" },
      { name: "Efficacité", value: 78, status: "Bon" },
      { name: "Croissance", value: 74, status: "Bon" }
    ]
  };

  const marketComparison = {
    yourPerformance: {
      margin: 27.8,
      roi: 28.9,
      growth: 12.5
    },
    sectorAverage: {
      margin: 18.5,
      roi: 22.1,
      growth: 8.2
    }
  };

  return (
    <div className="space-y-6">
      {/* Score de santé financière */}
      <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Target className="h-6 w-6" />
            Score de Santé Financière
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{financialHealth.score}/100</div>
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                {financialHealth.status}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 flex-1 ml-8">
              {financialHealth.indicators.map((indicator) => (
                <div key={indicator.name} className="bg-white p-3 rounded-lg border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{indicator.name}</span>
                    <span className="text-xs text-gray-600">{indicator.status}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${indicator.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparaison sectorielle */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-6 w-6" />
            Comparaison Sectorielle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-center">Marge Bénéficiaire</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre exploitation</span>
                  <span className="font-bold text-blue-600">{marketComparison.yourPerformance.margin}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Moyenne secteur</span>
                  <span className="text-gray-600">{marketComparison.sectorAverage.margin}%</span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  +{(marketComparison.yourPerformance.margin - marketComparison.sectorAverage.margin).toFixed(1)}% vs secteur
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-center">ROI</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre exploitation</span>
                  <span className="font-bold text-blue-600">{marketComparison.yourPerformance.roi}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Moyenne secteur</span>
                  <span className="text-gray-600">{marketComparison.sectorAverage.roi}%</span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  +{(marketComparison.yourPerformance.roi - marketComparison.sectorAverage.roi).toFixed(1)}% vs secteur
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-3 text-center">Croissance</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Votre exploitation</span>
                  <span className="font-bold text-blue-600">{marketComparison.yourPerformance.growth}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Moyenne secteur</span>
                  <span className="text-gray-600">{marketComparison.sectorAverage.growth}%</span>
                </div>
                <div className="text-xs text-green-600 font-medium">
                  +{(marketComparison.yourPerformance.growth - marketComparison.sectorAverage.growth).toFixed(1)}% vs secteur
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forces identifiées */}
      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Forces Identifiées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {performanceAnalysis.strengths.map((strength, index) => (
              <Alert key={index} className="border-green-200 bg-green-50">
                <strength.icon className={`h-4 w-4 ${strength.color}`} />
                <AlertDescription>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{strength.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      Impact {strength.impact}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{strength.description}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Points d'amélioration */}
      <Card className="border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertTriangle className="h-5 w-5" />
            Points d'Amélioration Prioritaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {performanceAnalysis.improvements.map((improvement, index) => (
              <Alert key={index} className="border-orange-200 bg-orange-50">
                <improvement.icon className={`h-4 w-4 ${improvement.color}`} />
                <AlertDescription>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{improvement.title}</h4>
                    <div className="flex gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          improvement.priority === 'Haute' ? 'border-red-300 text-red-700' : 'border-yellow-300 text-yellow-700'
                        }`}
                      >
                        {improvement.priority}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-green-700">
                        Économie: {improvement.potentialSaving}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{improvement.description}</p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Opportunités de développement */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Lightbulb className="h-5 w-5" />
            Opportunités de Développement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {performanceAnalysis.opportunities.map((opportunity, index) => (
              <Alert key={index} className="border-purple-200 bg-purple-50">
                <opportunity.icon className={`h-4 w-4 ${opportunity.color}`} />
                <AlertDescription>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{opportunity.title}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs text-green-700">
                        Potentiel: {opportunity.potential}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-blue-700">
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
  );
};
