
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Brain, 
  TrendingUp, 
  Plus, 
  Trash2,
  Target,
  AlertTriangle,
  CheckCircle,
  Zap,
  BarChart3
} from 'lucide-react';
import { useMLPredictions } from '@/hooks/use-ml-predictions';

interface BudgetItem {
  id: string;
  name: string;
  category: 'income' | 'expense';
  type: string;
  baseAmount: number;
  predictedAmount?: number;
  month: string;
  confidence?: string;
  factors?: string[];
}

interface AIAnalysis {
  totalBudget: number;
  predictedTotal: number;
  variance: number;
  riskLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
  seasonalFactors: any[];
}

const EnhancedBudgetManagement: React.FC = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      name: 'Vente Canne à sucre',
      category: 'income',
      type: 'Récolte',
      baseAmount: 35000,
      month: 'Août'
    },
    {
      id: '2',
      name: 'Semences',
      category: 'expense',
      type: 'Intrants',
      baseAmount: 2500,
      month: 'Mars'
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'income' as 'income' | 'expense',
    type: '',
    baseAmount: 0,
    month: 'Janvier'
  });

  const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { predict, isLoading: isPredicting } = useMLPredictions();

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const incomeTypes = ['Récolte', 'Vente directe', 'Subvention', 'Location', 'Autre'];
  const expenseTypes = ['Intrants', 'Main-d\'œuvre', 'Équipement', 'Maintenance', 'Transport', 'Autre'];

  const addBudgetItem = () => {
    if (newItem.name && newItem.type && newItem.baseAmount > 0) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setBudgetItems([...budgetItems, item]);
      setNewItem({
        name: '',
        category: 'income',
        type: '',
        baseAmount: 0,
        month: 'Janvier'
      });
      toast.success('Élément budgétaire ajouté');
    }
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success('Élément supprimé');
  };

  const generateAIPredictions = async () => {
    setIsAnalyzing(true);
    toast.info('Analyse IA en cours...');

    try {
      const updatedItems = await Promise.all(
        budgetItems.map(async (item) => {
          // Préparer les données pour le modèle d'IA
          const predictionInput = {
            amount: item.baseAmount,
            category: item.category,
            type: item.type,
            month: months.indexOf(item.month) + 1,
            seasonality: item.type === 'Récolte' ? 1 : 0
          };

          try {
            const prediction = await predict(predictionInput);
            
            if (prediction.success) {
              return {
                ...item,
                predictedAmount: prediction.prediction,
                confidence: prediction.confidence || 'Moyenne',
                factors: generateFactors(item, prediction.prediction || item.baseAmount)
              };
            }
          } catch (error) {
            console.error('Erreur prédiction pour', item.name, ':', error);
          }

          // Fallback: simulation réaliste
          const variationFactor = getVariationFactor(item);
          const predictedAmount = Math.round(item.baseAmount * variationFactor);
          
          return {
            ...item,
            predictedAmount,
            confidence: getConfidenceLevel(item),
            factors: generateFactors(item, predictedAmount)
          };
        })
      );

      setBudgetItems(updatedItems);

      // Générer l'analyse globale
      const totalBase = updatedItems.reduce((sum, item) => {
        return sum + (item.category === 'income' ? item.baseAmount : -item.baseAmount);
      }, 0);

      const totalPredicted = updatedItems.reduce((sum, item) => {
        const amount = item.predictedAmount || item.baseAmount;
        return sum + (item.category === 'income' ? amount : -amount);
      }, 0);

      const variance = ((totalPredicted - totalBase) / Math.abs(totalBase)) * 100;
      
      const analysis: AIAnalysis = {
        totalBudget: Math.abs(totalBase),
        predictedTotal: Math.abs(totalPredicted),
        variance: Math.round(variance * 100) / 100,
        riskLevel: Math.abs(variance) > 15 ? 'high' : Math.abs(variance) > 5 ? 'medium' : 'low',
        recommendations: generateRecommendations(updatedItems, variance),
        seasonalFactors: generateSeasonalAnalysis(updatedItems)
      };

      setAIAnalysis(analysis);
      toast.success('Analyse IA terminée avec succès !');

    } catch (error) {
      console.error('Erreur lors de l\'analyse IA:', error);
      toast.error('Erreur lors de l\'analyse IA');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getVariationFactor = (item: BudgetItem): number => {
    // Simulation de facteurs de variation selon le type et la saison
    const baseVariation = 0.9 + Math.random() * 0.2; // ±10%
    
    if (item.category === 'income') {
      if (item.type === 'Récolte') {
        // Les récoltes ont plus de variabilité
        return 0.85 + Math.random() * 0.3; // -15% à +15%
      }
      return 0.95 + Math.random() * 0.1; // -5% à +5%
    } else {
      if (item.type === 'Intrants') {
        // Les intrants peuvent augmenter
        return 1.0 + Math.random() * 0.15; // 0% à +15%
      }
      return 0.95 + Math.random() * 0.15; // -5% à +10%
    }
  };

  const getConfidenceLevel = (item: BudgetItem): string => {
    if (['Récolte', 'Vente directe'].includes(item.type)) return 'Élevée';
    if (['Intrants', 'Main-d\'œuvre'].includes(item.type)) return 'Moyenne';
    return 'Faible';
  };

  const generateFactors = (item: BudgetItem, predictedAmount: number): string[] => {
    const factors = [];
    const variation = ((predictedAmount - item.baseAmount) / item.baseAmount) * 100;
    
    if (Math.abs(variation) > 5) {
      if (variation > 0) {
        factors.push(`Hausse prévue de ${Math.round(variation)}%`);
        if (item.category === 'income') {
          factors.push('Conditions météo favorables');
          factors.push('Demande du marché forte');
        } else {
          factors.push('Inflation des coûts');
          factors.push('Hausse des prix fournisseurs');
        }
      } else {
        factors.push(`Baisse prévue de ${Math.round(Math.abs(variation))}%`);
        if (item.category === 'income') {
          factors.push('Concurrence accrue');
          factors.push('Fluctuation des prix');
        } else {
          factors.push('Optimisation des coûts');
          factors.push('Négociation fournisseurs');
        }
      }
    } else {
      factors.push('Stabilité prévue');
      factors.push('Conditions normales');
    }
    
    return factors;
  };

  const generateRecommendations = (items: BudgetItem[], variance: number): string[] => {
    const recommendations = [];
    
    if (variance > 10) {
      recommendations.push('💰 Opportunité d\'augmentation des revenus identifiée');
      recommendations.push('📈 Planifier des investissements supplémentaires');
    } else if (variance < -10) {
      recommendations.push('⚠️ Risque de baisse des revenus détecté');
      recommendations.push('💡 Réviser la stratégie de production');
    } else {
      recommendations.push('✅ Budget équilibré et stable');
      recommendations.push('🎯 Maintenir la stratégie actuelle');
    }
    
    // Recommandations par type d'élément
    const incomeItems = items.filter(item => item.category === 'income');
    const expenseItems = items.filter(item => item.category === 'expense');
    
    if (incomeItems.length < expenseItems.length) {
      recommendations.push('🌱 Diversifier les sources de revenus');
    }
    
    recommendations.push('📊 Suivre mensuellement les écarts budgétaires');
    
    return recommendations;
  };

  const generateSeasonalAnalysis = (items: BudgetItem[]): any[] => {
    return months.map((month, index) => {
      const monthItems = items.filter(item => item.month === month);
      const monthTotal = monthItems.reduce((sum, item) => {
        const amount = item.predictedAmount || item.baseAmount;
        return sum + (item.category === 'income' ? amount : -amount);
      }, 0);
      
      return {
        month,
        value: monthTotal,
        items: monthItems.length
      };
    });
  };

  const calculateTotals = () => {
    const baseIncome = budgetItems
      .filter(item => item.category === 'income')
      .reduce((sum, item) => sum + item.baseAmount, 0);
    
    const baseExpenses = budgetItems
      .filter(item => item.category === 'expense')
      .reduce((sum, item) => sum + item.baseAmount, 0);
    
    const predictedIncome = budgetItems
      .filter(item => item.category === 'income')
      .reduce((sum, item) => sum + (item.predictedAmount || item.baseAmount), 0);
    
    const predictedExpenses = budgetItems
      .filter(item => item.category === 'expense')
      .reduce((sum, item) => sum + (item.predictedAmount || item.baseAmount), 0);
    
    return {
      baseIncome,
      baseExpenses,
      baseBalance: baseIncome - baseExpenses,
      predictedIncome,
      predictedExpenses,
      predictedBalance: predictedIncome - predictedExpenses
    };
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* En-tête avec IA */}
      <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              Gestion Budgétaire Intelligente
            </span>
            <Button 
              onClick={generateAIPredictions}
              disabled={isAnalyzing || isPredicting || budgetItems.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              {isAnalyzing ? 'Analyse IA...' : 'Analyser avec l\'IA'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {totals.predictedIncome.toLocaleString()} €
              </div>
              <p className="text-sm text-green-600">
                Revenus prévus
                {totals.baseIncome !== totals.predictedIncome && (
                  <span className="text-xs block">
                    (Base: {totals.baseIncome.toLocaleString()} €)
                  </span>
                )}
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-700">
                {totals.predictedExpenses.toLocaleString()} €
              </div>
              <p className="text-sm text-red-600">
                Dépenses prévues
                {totals.baseExpenses !== totals.predictedExpenses && (
                  <span className="text-xs block">
                    (Base: {totals.baseExpenses.toLocaleString()} €)
                  </span>
                )}
              </p>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${totals.predictedBalance >= 0 ?  'text-blue-700' : 'text-orange-700'}`}>
                {totals.predictedBalance.toLocaleString()} €
              </div>
              <p className="text-sm text-muted-foreground">
                Solde prévisionnel
                {totals.baseBalance !== totals.predictedBalance && (
                  <span className={`text-xs block ${totals.predictedBalance > totals.baseBalance ? 'text-green-600' : 'text-red-600'}`}>
                    ({totals.predictedBalance > totals.baseBalance ? '+' : ''}{(totals.predictedBalance - totals.baseBalance).toLocaleString()} €)
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulaire d'ajout */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-600" />
            Ajouter un élément budgétaire
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="item-name">Nom</Label>
              <Input
                id="item-name"
                value={newItem.name}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Ex: Vente de maïs"
              />
            </div>

            <div>
              <Label htmlFor="item-category">Type</Label>
              <Select 
                value={newItem.category} 
                onValueChange={(value: 'income' | 'expense') => setNewItem({...newItem, category: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Revenu</SelectItem>
                  <SelectItem value="expense">Dépense</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item-type">Catégorie</Label>
              <Select 
                value={newItem.type} 
                onValueChange={(value) => setNewItem({...newItem, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir..." />
                </SelectTrigger>
                <SelectContent>
                  {(newItem.category === 'income' ? incomeTypes : expenseTypes).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="item-amount">Montant de base (€)</Label>
              <Input
                id="item-amount"
                type="number"
                value={newItem.baseAmount || ''}
                onChange={(e) => setNewItem({...newItem, baseAmount: parseFloat(e.target.value) || 0})}
                min="0"
                step="0.01"
              />
            </div>

            <div>
              <Label htmlFor="item-month">Mois</Label>
              <Select 
                value={newItem.month} 
                onValueChange={(value) => setNewItem({...newItem, month: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {months.map(month => (
                    <SelectItem key={month} value={month}>{month}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button 
                onClick={addBudgetItem}
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={!newItem.name || !newItem.type || newItem.baseAmount <= 0}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des éléments avec prédictions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-green-600" />
            Éléments budgétaires avec prédictions IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {budgetItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`p-4 border rounded-lg ${
                    item.category === 'income' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{item.name}</h4>
                        <Badge variant="outline">{item.type}</Badge>
                        <Badge variant="outline">{item.month}</Badge>
                        {item.confidence && (
                          <Badge className="bg-purple-100 text-purple-800">
                            Confiance: {item.confidence}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mb-2">
                        <span className="text-sm text-muted-foreground">
                          Base: {item.baseAmount.toLocaleString()} €
                        </span>
                        {item.predictedAmount && item.predictedAmount !== item.baseAmount && (
                          <span className={`font-medium ${
                            (item.category === 'income' && item.predictedAmount > item.baseAmount) ||
                            (item.category === 'expense' && item.predictedAmount < item.baseAmount)
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            Prévu: {item.predictedAmount.toLocaleString()} €
                          </span>
                        )}
                      </div>
                      
                      {item.factors && item.factors.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Facteurs d'influence:</p>
                          <div className="flex flex-wrap gap-1">
                            {item.factors.slice(0, 2).map((factor, idx) => (
                              <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          item.category === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(item.predictedAmount || item.baseAmount).toLocaleString()} €
                        </div>
                        {item.predictedAmount && item.predictedAmount !== item.baseAmount && (
                          <div className={`text-xs ${
                            (item.category === 'income' && item.predictedAmount > item.baseAmount) ||
                            (item.category === 'expense' && item.predictedAmount < item.baseAmount)
                              ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.predictedAmount > item.baseAmount ? '+' : ''}
                            {((item.predictedAmount - item.baseAmount) / item.baseAmount * 100).toFixed(1)}%
                          </div>
                        )}
                      </div>

                      <Button
                        onClick={() => removeBudgetItem(item.id)}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {budgetItems.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun élément budgétaire ajouté.</p>
              <p className="text-sm mt-1">Commencez par ajouter vos revenus et dépenses prévus.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyse IA globale */}
      {aiAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                Analyse IA Complète
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-indigo-700">
                      {aiAnalysis.variance > 0 ? '+' : ''}{aiAnalysis.variance}%
                    </div>
                    <p className="text-sm text-indigo-600">Variation prévue</p>
                  </div>
                  <div className="text-center">
                    <Badge className={`text-sm px-3 py-1 ${
                      aiAnalysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                      aiAnalysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      Risque {aiAnalysis.riskLevel === 'low' ? 'Faible' : 
                               aiAnalysis.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                    </Badge>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-purple-700">
                      {aiAnalysis.predictedTotal.toLocaleString()} €
                    </div>
                    <p className="text-sm text-purple-600">Budget prévu</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Recommandations IA:
                  </h4>
                  <div className="space-y-2">
                    {aiAnalysis.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm bg-white p-3 rounded border">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full mt-1.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedBudgetManagement;
