
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { DollarSign, TrendingUp, Eye, Wheat, Leaf, Droplets, AlertTriangle, Target, Filter } from 'lucide-react';

export const RevenueBreakdown: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6mois');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const revenueData = [
    { 
      name: 'Ventes Céréales', 
      value: 18698000, 
      percentage: 40, 
      icon: Wheat, 
      color: '#10b981',
      details: {
        volume: '142 tonnes',
        prixMoyen: '131 797 FCFA/t',
        evolution: '+12.3%',
        principauxAcheteurs: ['Coopérative Locale', 'Négoce Export']
      }
    },
    { 
      name: 'Ventes Légumes', 
      value: 11931600, 
      percentage: 25, 
      icon: Leaf, 
      color: '#059669',
      details: {
        volume: '89 tonnes',
        prixMoyen: '133 765 FCFA/t',
        evolution: '+8.7%',
        principauxAcheteurs: ['Marchés Locaux', 'GMS Régionale']
      }
    },
    { 
      name: 'Ventes Fruits', 
      value: 10364400, 
      percentage: 22, 
      icon: Droplets, 
      color: '#047857',
      details: {
        volume: '67 tonnes',
        prixMoyen: '154 766 FCFA/t',
        evolution: '-2.1%',
        principauxAcheteurs: ['Vente Directe', 'Restauration']
      }
    },
    { 
      name: 'Subventions PAC', 
      value: 5974520, 
      percentage: 13, 
      icon: DollarSign, 
      color: '#065f46',
      details: {
        volume: 'N/A',
        prixMoyen: 'N/A',
        evolution: '+15.2%',
        principauxAcheteurs: ['Aide Découplée', 'Mesures Agro-environnementales']
      }
    }
  ];

  const expenseCategories = [
    { 
      name: 'Semences & Intrants', 
      amount: 9967344, 
      trend: 'up', 
      impact: 'élevé',
      pourcentage: 29.4,
      details: 'Augmentation due aux prix des engrais (+18%)'
    },
    { 
      name: 'Carburant & Énergie', 
      amount: 8396416, 
      trend: 'up', 
      impact: 'élevé',
      pourcentage: 24.8,
      details: 'Impact inflation énergétique (+22%)'
    },
    { 
      name: 'Main d\'œuvre', 
      amount: 7806883, 
      trend: 'stable', 
      impact: 'moyen',
      pourcentage: 23.1,
      details: 'Coûts stabilisés avec optimisation équipes'
    },
    { 
      name: 'Maintenance Matériel', 
      amount: 5378854, 
      trend: 'down', 
      impact: 'faible',
      pourcentage: 15.9,
      details: 'Réduction grâce à maintenance préventive (-8%)'
    },
    { 
      name: 'Assurances', 
      amount: 2343267, 
      trend: 'stable', 
      impact: 'faible',
      pourcentage: 6.9,
      details: 'Primes stables, couverture optimisée'
    }
  ];

  const monthlyComparison = [
    { mois: 'Jan', objectif: 7873440, realise: 9840000, ecart: 1966560 },
    { mois: 'Fév', objectif: 9840000, realise: 12136000, ecart: 2296000 },
    { mois: 'Mar', objectif: 11808000, realise: 14432000, ecart: 2624000 },
    { mois: 'Avr', objectif: 10496000, realise: 12792000, ecart: 2296000 },
    { mois: 'Mai', objectif: 13120000, realise: 16400000, ecart: 3280000 },
    { mois: 'Jun', objectif: 14432000, realise: 18368000, ecart: 3936000 }
  ];

  const handleShowDetails = (sourceName: string) => {
    setShowDetails(showDetails === sourceName ? null : sourceName);
  };

  return (
    <div className="space-y-8">
      {/* Contrôles et filtres */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-green-700" />
          <span className="font-medium text-green-800">Période d'analyse:</span>
          <div className="flex gap-2">
            {['3mois', '6mois', '12mois'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className={selectedPeriod === period ? 
                  "bg-green-600 hover:bg-green-700" : 
                  "border-green-300 text-green-700 hover:bg-green-50"
                }
              >
                {period === '3mois' ? '3 mois' : period === '6mois' ? '6 mois' : '1 an'}
              </Button>
            ))}
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 px-3 py-1">
          <Target className="h-4 w-4 mr-1" />
          Objectifs dépassés de +18.5%
        </Badge>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Répartition des revenus avec détails */}
        <Card className="xl:col-span-2 shadow-xl border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-green-800">
              <DollarSign className="h-6 w-6" />
              Sources de Revenus Détaillées
            </CardTitle>
            <div className="flex flex-wrap gap-2 mt-3">
            <Badge className="bg-green-100 text-green-800">
              Total: {revenueData.reduce((sum, item) => sum + item.value, 0).toLocaleString()} FCFA
            </Badge>
              <Badge className="bg-blue-100 text-blue-800">
                Diversification Optimale
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percentage }) => `${percentage}%`}
                      labelLine={false}
                    >
                      {revenueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="white" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [`${value.toLocaleString()} FCFA`, 'Revenus']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '2px solid #10b981',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
                        fontSize: '14px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-4">
                {revenueData.map((item, index) => (
                  <div key={item.name}>
                    <div 
                      className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 cursor-pointer hover:shadow-md transition-all duration-200"
                      onClick={() => handleShowDetails(item.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="p-2 rounded-full"
                            style={{ backgroundColor: `${item.color}20` }}
                          >
                            <item.icon 
                              className="h-5 w-5" 
                              style={{ color: item.color }}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">{item.percentage}% du total</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <div>
                            <p className="font-bold text-lg text-green-700">{item.value.toLocaleString()} FCFA</p>
                            <p className="text-xs text-green-600">{item.details.evolution}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-green-600 hover:text-green-800">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {showDetails === item.name && (
                      <div className="mt-2 p-4 bg-white rounded-lg border-l-4 border-green-500 shadow-sm">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Volume:</span>
                            <span className="ml-2 text-gray-900">{item.details.volume}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Prix moyen:</span>
                            <span className="ml-2 text-gray-900">{item.details.prixMoyen}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="font-medium text-gray-700">Principaux acheteurs:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {item.details.principauxAcheteurs.map((acheteur, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {acheteur}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analyse des dépenses détaillée */}
        <Card className="shadow-xl border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-orange-800">
              <TrendingUp className="h-6 w-6" />
              Analyse Détaillée des Coûts
            </CardTitle>
            <p className="text-orange-700 text-sm mt-1">
              Répartition et évolution des postes de dépenses
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenseCategories.map((expense, index) => (
                <div key={expense.name} className="p-4 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{expense.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{expense.details}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {expense.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {expense.trend === 'down' && <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />}
                      {expense.trend === 'stable' && <div className="w-4 h-0.5 bg-gray-400 rounded" />}
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          expense.impact === 'élevé' ? 'border-red-300 text-red-700 bg-red-50' :
                          expense.impact === 'moyen'? 'border-yellow-300 text-yellow-700 bg-yellow-50' :
                          'border-green-300 text-green-700 bg-green-50'
                        }`}
                      >
                        {expense.impact}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg text-gray-900">{expense.amount.toLocaleString()} FCFA</span>
                      <div className="text-xs text-gray-500">
                        {expense.pourcentage}% du total
                      </div>
                    </div>
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          expense.impact === 'élevé' ? 'bg-red-500' :
                          expense.impact === 'moyen' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${expense.pourcentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparaison Objectifs vs Réalisé */}
      <Card className="shadow-xl border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl text-blue-800">
            <Target className="h-6 w-6" />
            Performance vs Objectifs
          </CardTitle>
          <p className="text-blue-700 text-sm mt-1">
            Comparaison mensuelle entre objectifs fixés et résultats obtenus
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                <XAxis 
                  dataKey="mois" 
                  stroke="#1e40af"
                  fontSize={14}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#1e40af"
                  fontSize={12}
                  tickFormatter={(value) => `${Math.round(value/1000000)}M FCFA`}
                />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value.toLocaleString()} FCFA`, 
                      name === 'objectif' ? 'Objectif' : name === 'realise' ? 'Réalisé' : 'Écart'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #3b82f6',
                      borderRadius: '8px',
                      boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)'
                    }}
                  />
                <Legend />
                <Bar 
                  dataKey="objectif" 
                  fill="#93c5fd" 
                  name="Objectif Fixé"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="realise" 
                  fill="#3b82f6" 
                  name="Résultat Obtenu"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="ecart" 
                  fill="#10b981" 
                  name="Dépassement"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
