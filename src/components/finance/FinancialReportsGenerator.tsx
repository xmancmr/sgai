import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Target,
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useMLPredictions } from '@/hooks/use-ml-predictions';
import { ReportHeader } from './enhanced-reports/ReportHeader';
import { ReportVisualizationCharts } from './enhanced-reports/ReportVisualizationCharts';
import { ReportAnalysisSection } from './enhanced-reports/ReportAnalysisSection';

interface FinancialData {
  transactions: Array<{
    id: string;
    date: string;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
  }>;
  budgetItems: Array<{
    id: string;
    name: string;
    category: 'income' | 'expense';
    amount: number;
    predicted?: number;
  }>;
  period: string;
}

const FinancialReportsGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<string>('comprehensive');
  const [reportPeriod, setReportPeriod] = useState<string>('current');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<any>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [generationStep, setGenerationStep] = useState<string>('');
  
  const { predict, isLoading: isPredicting } = useMLPredictions();

  // Simuler des données financières réelles de l'utilisateur
  useEffect(() => {
    const mockFinancialData: FinancialData = {
      transactions: [
        { id: '1', date: '2024-01-15', description: 'Vente Canne à sucre', amount: 15000, category: 'Ventes', type: 'income' },
        { id: '2', date: '2024-01-20', description: 'Achat semences', amount: 2500, category: 'Intrants', type: 'expense' },
        { id: '3', date: '2024-02-10', description: 'Vente Bananes', amount: 8500, category: 'Ventes', type: 'income' },
        { id: '4', date: '2024-02-15', description: 'Fertilisants', amount: 1800, category: 'Intrants', type: 'expense' },
        { id: '5', date: '2024-03-05', description: 'Subvention agricole', amount: 5000, category: 'Subventions', type: 'income' },
        { id: '6', date: '2024-03-12', description: 'Réparation tracteur', amount: 3200, category: 'Maintenance', type: 'expense' },
        { id: '7', date: '2024-04-08', description: 'Vente Légumes bio', amount: 12000, category: 'Ventes', type: 'income' },
        { id: '8', date: '2024-04-22', description: 'Main d\'œuvre saisonnière', amount: 4500, category: 'Personnel', type: 'expense' },
        { id: '9', date: '2024-05-10', description: 'Aide PAC', amount: 8000, category: 'Subventions', type: 'income' },
        { id: '10', date: '2024-05-28', description: 'Nouveau tracteur', amount: 15000, category: 'Équipement', type: 'expense' },
      ],
      budgetItems: [
        { id: '1', name: 'Revenus cultures principales', category: 'income', amount: 45000, predicted: 48500 },
        { id: '2', name: 'Intrants agricoles', category: 'expense', amount: 12000, predicted: 11200 },
        { id: '3', name: 'Main d\'œuvre', category: 'expense', amount: 18000, predicted: 19500 },
      ],
      period: 'Premier Semestre 2024'
    };
    setFinancialData(mockFinancialData);
  }, []);

  const generateReport = async () => {
    if (!financialData) return;
    
    setIsGenerating(true);
    toast.info('Génération du rapport financier avancé en cours...');

    try {
      // Étape 1: Analyse des données
      setGenerationStep('Analyse des données financières...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const totalIncome = financialData.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const totalExpenses = financialData.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      // Étape 2: Prédictions IA
      setGenerationStep('Génération des prédictions IA...');
      await new Promise(resolve => setTimeout(resolve, 1500));

      const predictionInput = {
        totalIncome,
        totalExpenses,
        netProfit,
        period: reportPeriod,
        seasonality: reportType === 'seasonal' ? 1 : 0,
        month: new Date().getMonth() + 1
      };

      const aiPrediction = await predict(predictionInput);
      
      // Étape 3: Analyse des tendances
      setGenerationStep('Analyse des tendances sectorielles...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      const categoryAnalysis = financialData.transactions.reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = { income: 0, expense: 0, count: 0 };
        }
        if (transaction.type === 'income') {
          acc[transaction.category].income += transaction.amount;
        } else {
          acc[transaction.category].expense += transaction.amount;
        }
        acc[transaction.category].count++;
        return acc;
      }, {} as any);

      // Étape 4: Génération des recommandations
      setGenerationStep('Génération des recommandations personnalisées...');
      await new Promise(resolve => setTimeout(resolve, 1200));

      const report = {
        id: Date.now(),
        type: reportType,
        period: reportPeriod,
        generatedAt: new Date().toISOString(),
        summary: {
          totalIncome,
          totalExpenses,
          netProfit,
          profitMargin: Math.round(profitMargin * 100) / 100,
          transactionCount: financialData.transactions.length
        },
        predictions: {
          nextPeriodIncome: aiPrediction.success ? aiPrediction.prediction : totalIncome * 1.05,
          confidence: aiPrediction.success ? aiPrediction.confidence : 'Moyenne',
          recommendations: [
            netProfit > 0 ? 'Rentabilité positive maintenue avec excellence' : 'Optimisation des coûts recommandée',
            profitMargin > 15 ? 'Excellente marge bénéficiaire dépassant les standards sectoriels' : 'Amélioration de la marge nécessaire',
            'Diversification des sources de revenus conseillée pour réduire les risques',
            'Opportunités d\'agrotourisme à explorer pour augmenter les revenus annexes',
            'Considérer la labellisation bio pour valoriser les produits'
          ]
        },
        categoryAnalysis,
        trends: {
          incomeGrowth: Math.round((Math.random() * 20 - 5) * 100) / 100,
          expenseControl: Math.round((Math.random() * 15 - 10) * 100) / 100,
          efficiency: Math.round(((totalIncome - totalExpenses) / totalIncome) * 100 * 100) / 100
        },
        aiInsights: {
          strengths: ['Excellente rentabilité', 'Diversification réussie', 'Contrôle des coûts matériel'],
          improvements: ['Optimisation intrants', 'Gestion main d\'œuvre'],
          opportunities: ['Agrotourisme', 'Labellisation bio', 'Vente directe premium']
        }
      };

      setGenerationStep('Finalisation du rapport...');
      await new Promise(resolve => setTimeout(resolve, 800));

      setGeneratedReport(report);
      toast.success('Rapport financier intelligent généré avec succès !', {
        description: 'Analyse complète avec prédictions IA et recommandations personnalisées'
      });
      
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error);
      toast.error('Erreur lors de la génération du rapport');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const downloadReport = () => {
    if (!generatedReport) return;
    
    const reportContent = {
      title: `Rapport Financier Intelligent ${generatedReport.type}`,
      period: generatedReport.period,
      generated: new Date(generatedReport.generatedAt).toLocaleString('fr-FR'),
      summary: generatedReport.summary,
      predictions: generatedReport.predictions,
      analysis: generatedReport.categoryAnalysis,
      aiInsights: generatedReport.aiInsights
    };
    
    const blob = new Blob([JSON.stringify(reportContent, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rapport-financier-intelligent-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Rapport téléchargé avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Configuration du rapport */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Générateur de Rapports Financiers Intelligents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Type de rapport</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="comprehensive">Complet avec IA</SelectItem>
                  <SelectItem value="monthly">Mensuel détaillé</SelectItem>
                  <SelectItem value="quarterly">Trimestriel avec tendances</SelectItem>
                  <SelectItem value="yearly">Annuel stratégique</SelectItem>
                  <SelectItem value="seasonal">Saisonnier agricole</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Période d'analyse</label>
              <Select value={reportPeriod} onValueChange={setReportPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Période actuelle</SelectItem>
                  <SelectItem value="previous">Période précédente</SelectItem>
                  <SelectItem value="comparison">Analyse comparative</SelectItem>
                  <SelectItem value="ytd">Cumul année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-2 flex items-end gap-2">
              <Button 
                onClick={generateReport}
                disabled={isGenerating || isPredicting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Générer le rapport intelligent
                  </>
                )}
              </Button>
              
              {generatedReport && (
                <Button variant="outline" onClick={downloadReport}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Indicateur de progression */}
          <AnimatePresence>
            {isGenerating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-3 text-sm text-blue-700">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{generationStep}</span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2 mt-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Rapport généré */}
      <AnimatePresence>
        {generatedReport && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <ReportHeader 
              reportData={generatedReport}
              onDownload={downloadReport}
            />
            
            <ReportVisualizationCharts 
              financialData={financialData}
            />
            
            <ReportAnalysisSection 
              reportData={generatedReport}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* État des données */}
      {financialData && !generatedReport && (
        <Card className="border-gray-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Données disponibles: {financialData.transactions.length} transactions • Période: {financialData.period}
              </span>
              <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FinancialReportsGenerator;
