
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Wheat, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  PieChart,
  BarChart3,
  Leaf,
  Sun,
  CloudRain,
  Target,
  Calendar,
  ArrowRight,
  Settings,
  FileText
} from 'lucide-react';
import { FinancialOverviewCharts } from './FinancialOverviewCharts';
import { FinancialInsights } from './FinancialInsights';
import { RevenueBreakdown } from './RevenueBreakdown';
import { FinancialActions } from './FinancialActions';
import { formatFCFA } from '@/utils/currency';
import { getCurrentSeason } from '@/utils/dates';

const FinancialDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<'overview' | 'analysis' | 'actions'>('overview');

  const farmMetrics = {
    totalRevenue: 47110000, // Converted from EUR to FCFA
    totalExpenses: 33952000, // Converted from EUR to FCFA
    netProfit: 13158000,      // Converted from EUR to FCFA
    profitMargin: 27.8,
    roi: 28.9,
    growthRate: 12.5
  };

  const seasonalData = getCurrentSeason();

  const handleExportData = () => {
    console.log('Exporting financial data...');
    toast.success("Données financières exportées avec succès !");
  };

  const handleImportData = () => {
    console.log('Importing financial data...');
    toast.success("Données importées et traitées !");
  };

  const handleGenerateReport = () => {
    console.log('Generating comprehensive report...');
    toast.success("Rapport détaillé généré !");
  };

  const handleCalculateBudget = () => {
    console.log('Calculating budget projections...');
    toast.success("Budget prévisionnel calculé !");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* En-tête principal */}
      <div className="bg-card border-b">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Wheat className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Gestion Financière</h1>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Sun className="h-4 w-4" />
                    {seasonalData.season} • Favorable
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4" />
                  <span>{seasonalData.daysUntilNext} jours avant {seasonalData.nextPhase}</span>
                </div>
                <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full">
                  <Target className="h-4 w-4" />
                  <span>ROI {farmMetrics.roi}%</span>
                </div>
              </div>
            </div>

            {/* Navigation rapide */}
            <div className="flex gap-2">
              {[
                { key: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                { key: 'analysis', label: 'Analyse', icon: PieChart },
                { key: 'actions', label: 'Actions', icon: Settings }
              ].map((tab) => (
                <Button
                  key={tab.key}
                  variant={activeView === tab.key ? "default" : "outline"}
                  onClick={() => setActiveView(tab.key as any)}
                  className="flex items-center gap-2"
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="container -mt-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Revenus Totaux",
              value: formatFCFA(farmMetrics.totalRevenue),
              change: `+${farmMetrics.growthRate}%`,
              icon: DollarSign,
              trend: "up",
              description: "Ventes et subventions"
            },
            {
              title: "Dépenses",
              value: formatFCFA(farmMetrics.totalExpenses),
              change: "+5.2%",
              icon: TrendingDown,
              trend: "up",
              description: "Coûts opérationnels"
            },
            {
              title: "Bénéfice Net",
              value: formatFCFA(farmMetrics.netProfit),
              change: "+28.3%",
              icon: TrendingUp,
              trend: "up",
              description: "Profit après charges"
            },
            {
              title: "Marge",
              value: `${farmMetrics.profitMargin}%`,
              change: "+3.1%",
              icon: Target,
              trend: "up",
              description: "Rentabilité globale"
            }
          ].map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                    <div className="p-2 rounded-full bg-muted">
                      <metric.icon className="h-5 w-5 text-foreground" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Badge variant="outline" className="text-foreground border-border">
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs période précédente</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container py-8">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <FinancialOverviewCharts />
              <RevenueBreakdown />
            </motion.div>
          )}
          
          {activeView === 'analysis' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <FinancialInsights />
            </motion.div>
          )}
          
          {activeView === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <FinancialActions
                onExportData={handleExportData}
                onImportData={handleImportData}
                onGenerateReport={handleGenerateReport}
                onCalculateBudget={handleCalculateBudget}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinancialDashboard;
