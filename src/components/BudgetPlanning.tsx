
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PiggyBank, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Calculator, 
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign
} from 'lucide-react';

interface BudgetItem {
  id: string;
  name: string;
  category: 'income' | 'expense';
  type: string;
  amount: number;
  month: string;
  priority: 'high' | 'medium' | 'low';
  predicted?: boolean;
  predictedAmount?: number;
}

const BudgetPlanning = () => {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    {
      id: '1',
      name: 'Vente Canne à sucre',
      category: 'income',
      type: 'Récolte',
      amount: 35000,
      month: 'Août',
      priority: 'high',
      predicted: true,
      predictedAmount: 38500
    },
    {
      id: '2',
      name: 'Semences',
      category: 'expense',
      type: 'Intrants',
      amount: 2500,
      month: 'Mars',
      priority: 'high'
    },
    {
      id: '3',
      name: 'Engrais',
      category: 'expense',
      type: 'Intrants',
      amount: 3200,
      month: 'Avril',
      priority: 'medium'
    }
  ]);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'income' as 'income' | 'expense',
    type: '',
    amount: 0,
    month: 'Janvier',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const [isGeneratingPredictions, setIsGeneratingPredictions] = useState(false);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const incomeTypes = ['Récolte', 'Vente directe', 'Subvention', 'Location', 'Autre'];
  const expenseTypes = ['Intrants', 'Main-d\'œuvre', 'Équipement', 'Maintenance', 'Transport', 'Autre'];

  const addBudgetItem = () => {
    if (newItem.name && newItem.type && newItem.amount > 0) {
      const item: BudgetItem = {
        id: Date.now().toString(),
        ...newItem
      };
      setBudgetItems([...budgetItems, item]);
      setNewItem({
        name: '',
        category: 'income',
        type: '',
        amount: 0,
        month: 'Janvier',
        priority: 'medium'
      });
      toast.success(`${item.category === 'income' ? 'Revenu' : 'Dépense'} ajouté(e) avec succès`);
    }
  };

  const removeBudgetItem = (id: string) => {
    setBudgetItems(budgetItems.filter(item => item.id !== id));
    toast.success('Élément supprimé');
  };

  const generatePredictions = () => {
    setIsGeneratingPredictions(true);
    toast.info('Génération des prédictions automatiques...');

    setTimeout(() => {
      const updatedItems = budgetItems.map(item => {
        if (!item.predicted) {
          // Simulation de prédiction basée sur des facteurs agricoles
          let predictionFactor = 1.0;
          
          // Facteurs de variation selon le type
          if (item.category === 'income') {
            if (item.type === 'Récolte') predictionFactor = 0.95 + Math.random() * 0.2; // ±5-15%
            else predictionFactor = 0.98 + Math.random() * 0.08; // ±2-6%
          } else {
            if (item.type === 'Intrants') predictionFactor = 1.02 + Math.random() * 0.08; // +2-10%
            else predictionFactor = 1.0 + Math.random() * 0.06; // +0-6%
          }
          
          return {
            ...item,
            predicted: true,
            predictedAmount: Math.round(item.amount * predictionFactor)
          };
        }
        return item;
      });

      setBudgetItems(updatedItems);
      toast.success('Prédictions générées avec succès !');
      setIsGeneratingPredictions(false);
    }, 2000);
  };

  const calculateTotals = () => {
    const income = budgetItems
      .filter(item => item.category === 'income')
      .reduce((sum, item) => sum + (item.predictedAmount || item.amount), 0);
    
    const expenses = budgetItems
      .filter(item => item.category === 'expense')
      .reduce((sum, item) => sum + (item.predictedAmount || item.amount), 0);
    
    return { income, expenses, balance: income - expenses };
  };

  const totals = calculateTotals();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Priorité haute';
      case 'medium': return 'Priorité moyenne';
      case 'low': return 'Priorité basse';
      default: return 'Non défini';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* En-tête avec résumé financier */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Revenus prévus</p>
                <p className="text-2xl font-bold text-green-700">
                  {totals.income.toLocaleString()} €
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Dépenses prévues</p>
                <p className="text-2xl font-bold text-red-700">
                  {totals.expenses.toLocaleString()} €
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className={`${totals.balance >= 0 ? 'border-blue-200 bg-blue-50' : 'border-orange-200 bg-orange-50'}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${totals.balance >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                  Solde prévisionnel
                </p>
                <p className={`text-2xl font-bold ${totals.balance >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                  {totals.balance.toLocaleString()} €
                </p>
              </div>
              {totals.balance >= 0 ? (
                <CheckCircle className="h-8 w-8 text-blue-600" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={generatePredictions}
              disabled={isGeneratingPredictions}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isGeneratingPredictions ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Target className="h-4 w-4 mr-2" />
              )}
              {isGeneratingPredictions ? 'Prédiction...' : 'Prédictions auto'}
            </Button>
          </CardContent>
        </Card>
      </div>

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
              <Label htmlFor="item-amount">Montant (€)</Label>
              <Input
                id="item-amount"
                type="number"
                value={newItem.amount || ''}
                onChange={(e) => setNewItem({...newItem, amount: parseFloat(e.target.value) || 0})}
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

            <div>
              <Label htmlFor="item-priority">Priorité</Label>
              <Select 
                value={newItem.priority} 
                onValueChange={(value: 'high' | 'medium' | 'low') => setNewItem({...newItem, priority: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="low">Basse</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={addBudgetItem}
            className="mt-4 bg-blue-600 hover:bg-blue-700"
            disabled={!newItem.name || !newItem.type || newItem.amount <= 0}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter l'élément
          </Button>
        </CardContent>
      </Card>

      {/* Liste des éléments budgétaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-green-600" />
            Budget prévisionnel
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
                  className={`flex items-center justify-between p-4 border rounded-lg ${
                    item.category === 'income' 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{item.name}</h4>
                      <Badge variant="outline">{item.type}</Badge>
                      <Badge className={getPriorityColor(item.priority)}>
                        {getPriorityLabel(item.priority)}
                      </Badge>
                      {item.predicted && (
                        <Badge className="bg-purple-100 text-purple-800">
                          Prédiction auto
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {item.month} • {item.category === 'income' ? 'Revenu' : 'Dépense'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {item.predicted && item.predictedAmount !== item.amount ? (
                        <>
                          <div className="text-sm text-muted-foreground line-through">
                            {item.amount.toLocaleString()} €
                          </div>
                          <div className={`font-bold ${
                            item.category === 'income' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {item.predictedAmount?.toLocaleString()} €
                          </div>
                        </>
                      ) : (
                        <div className={`font-bold ${
                          item.category === 'income' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(item.predictedAmount || item.amount).toLocaleString()} €
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
    </motion.div>
  );
};

export default BudgetPlanning;
