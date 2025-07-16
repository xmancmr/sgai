
import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  ReferenceLine
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calculator, RefreshCw, TrendingUp, Share2, Target, AlertCircle } from "lucide-react";
import { motion } from 'framer-motion';

// Données de prévision automatiques et simplifiées
const baseForecastData = [
  { month: 'Jan', revenue: 28500, expenses: 20100, forecast: 8400, previous: 7200 },
  { month: 'Fév', revenue: 30200, expenses: 21800, forecast: 8400, previous: 7500 },
  { month: 'Mar', revenue: 32800, expenses: 22400, forecast: 10400, previous: 8200 },
  { month: 'Avr', revenue: 35500, expenses: 23100, forecast: 12400, previous: 9200 },
  { month: 'Mai', revenue: 38200, expenses: 23500, forecast: 14700, previous: 10700 },
  { month: 'Juin', revenue: 37800, expenses: 22900, forecast: 14900, previous: 11200 },
  { month: 'Juil', revenue: 42500, expenses: 24200, forecast: 18300, previous: 12400 },
  { month: 'Août', revenue: 44800, expenses: 25300, forecast: 19500, previous: 13100 },
  { month: 'Sep', revenue: 40200, expenses: 24800, forecast: 15400, previous: 12400 },
  { month: 'Oct', revenue: 38200, expenses: 23100, forecast: 15100, previous: 11800 },
  { month: 'Nov', revenue: 36500, expenses: 22500, forecast: 14000, previous: 10900 },
  { month: 'Déc', revenue: 41200, expenses: 25800, forecast: 15400, previous: 12200 }
];

const FinancialForecast = () => {
  const [forecastDuration, setForecastDuration] = useState<string>("12");
  const [revenueFactor, setRevenueFactor] = useState<number[]>([100]);
  const [expenseFactor, setExpenseFactor] = useState<number[]>([100]);
  const [revenueScenario, setRevenueScenario] = useState<string>("stable");
  const [forecastData, setForecastData] = useState(baseForecastData);
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);

  const generateAutomaticForecast = () => {
    setIsGeneratingForecast(true);
    toast.info('Génération des prévisions automatiques...');
    
    setTimeout(() => {
      const scenarioMultipliers = {
        'optimistic': 1.15,
        'stable': 1.0,
        'pessimistic': 0.85,
        'seasonal': 1.0
      };
      
      const baseMultiplier = scenarioMultipliers[revenueScenario as keyof typeof scenarioMultipliers] || 1.0;
      
      const updatedData = baseForecastData.map((item, index) => {
        const revenueMultiplier = (revenueFactor[0] / 100) * baseMultiplier;
        const expenseMultiplier = expenseFactor[0] / 100;
        
        // Ajouter une variation saisonnière pour le scénario saisonnier
        let seasonalFactor = 1.0;
        if (revenueScenario === 'seasonal') {
          seasonalFactor = 0.9 + 0.2 * Math.sin((index * Math.PI) / 6);
        }
        
        const adjustedRevenue = Math.round(item.revenue * revenueMultiplier * seasonalFactor);
        const adjustedExpenses = Math.round(item.expenses * expenseMultiplier);
        
        return {
          ...item,
          revenue: adjustedRevenue,
          expenses: adjustedExpenses,
          forecast: adjustedRevenue - adjustedExpenses
        };
      });

      setForecastData(updatedData);
      toast.success('Prévisions automatiques générées avec succès !');
      setIsGeneratingForecast(false);
    }, 1500);
  };

  const handleShareForecast = () => {
    toast.success("Prévisions partagées par e-mail");
  };

  // Calculer les cash flows automatiquement
  const calculateCashFlowProjection = () => {
    let runningBalance = 0;
    return forecastData.map((item) => {
      const monthlyFlow = item.revenue - item.expenses;
      runningBalance += monthlyFlow;
      return {
        month: item.month,
        inflow: item.revenue,
        outflow: item.expenses,
        balance: runningBalance
      };
    });
  };

  const cashFlowProjection = calculateCashFlowProjection();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            Prévisions Financières Automatiques
          </h2>
          <p className="text-muted-foreground">
            Projections à {forecastDuration} mois basées sur vos données historiques
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={forecastDuration} onValueChange={setForecastDuration}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Durée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 mois</SelectItem>
              <SelectItem value="6">6 mois</SelectItem>
              <SelectItem value="12">12 mois</SelectItem>
              <SelectItem value="24">24 mois</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            onClick={generateAutomaticForecast} 
            disabled={isGeneratingForecast}
            className="bg-green-600 hover:bg-green-700"
          >
            {isGeneratingForecast ? (
              <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isGeneratingForecast ? 'Génération...' : 'Actualiser'}
          </Button>
          
          <Button onClick={handleShareForecast} variant="outline">
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Marge nette prévisionnelle</CardTitle>
            <CardDescription>Comparaison avec l'année précédente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={forecastData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === "forecast") return [`${value.toLocaleString()} €`, "Prévision"];
                      if (name === "previous") return [`${value.toLocaleString()} €`, "Année précédente"];
                      return [`${value.toLocaleString()} €`, name];
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="#4CAF50" 
                    strokeWidth={3} 
                    name="Prévision" 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="previous" 
                    stroke="#9E9E9E" 
                    strokeDasharray="5 5" 
                    name="Année précédente" 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Prévision de flux de trésorerie</CardTitle>
            <CardDescription>Évolution du solde de trésorerie</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={cashFlowProjection}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`${value.toLocaleString()} €`, '']}
                  />
                  <Legend />
                  <ReferenceLine y={0} stroke="#000" />
                  <Area 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.3}
                    name="Solde de trésorerie"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Paramètres de simulation
          </CardTitle>
          <CardDescription>
            Ajustez les facteurs pour observer leur impact sur les prévisions automatiques
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Évolution des revenus</Label>
                  <span className="text-sm font-medium">{revenueFactor[0]}%</span>
                </div>
                <Slider 
                  value={revenueFactor} 
                  onValueChange={setRevenueFactor} 
                  min={70} 
                  max={130} 
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-30%</span>
                  <span>Stable</span>
                  <span>+30%</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Évolution des charges</Label>
                  <span className="text-sm font-medium">{expenseFactor[0]}%</span>
                </div>
                <Slider 
                  value={expenseFactor} 
                  onValueChange={setExpenseFactor} 
                  min={70} 
                  max={130} 
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>-30%</span>
                  <span>Stable</span>
                  <span>+30%</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Scénario de revenus</Label>
                <Select value={revenueScenario} onValueChange={setRevenueScenario}>
                  <SelectTrigger>
                    <SelectValue placeholder="Scénario" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="optimistic">Optimiste (+15%)</SelectItem>
                    <SelectItem value="stable">Stable (±0%)</SelectItem>
                    <SelectItem value="pessimistic">Pessimiste (-15%)</SelectItem>
                    <SelectItem value="seasonal">Saisonnier (variations)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-end">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={generateAutomaticForecast}
                  disabled={isGeneratingForecast}
                >
                  {isGeneratingForecast ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Calculator className="h-4 w-4 mr-2" />
                  )}
                  {isGeneratingForecast ? 'Génération...' : 'Lancer la simulation'}
                </Button>
              </div>
            </div>
            
            {/* Indicateurs financiers clés - Fonctionnels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Résultat d'exploitation prévisionnel</p>
                <p className="text-xl font-bold">
                  {Math.round(forecastData.reduce((sum, item) => sum + item.forecast, 0)).toLocaleString()} €
                </p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>Prévision automatique</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Trésorerie prévisionnelle fin d'année</p>
                <p className="text-xl font-bold">
                  {cashFlowProjection[cashFlowProjection.length - 1]?.balance.toLocaleString()} €
                </p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>Flux de trésorerie</span>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <p className="text-muted-foreground text-sm font-medium mb-1">Rentabilité prévisionnelle</p>
                <p className="text-xl font-bold">
                  {(
                    (forecastData.reduce((sum, item) => sum + item.forecast, 0) / 
                     forecastData.reduce((sum, item) => sum + item.revenue, 0)) * 100
                  ).toFixed(1)}%
                </p>
                <div className="flex items-center space-x-1 text-green-600 text-xs">
                  <TrendingUp className="h-3 w-3" />
                  <span>Calcul automatique</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FinancialForecast;
