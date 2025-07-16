
import { useState, useCallback } from 'react';

interface UserData {
  employees: number;
  simpleTasks: number;
  sowMonth: string;
  crop: string;
  averageHarvestMonth: string;
  salesPeriod: string;
  comparisonFarmersBenefit: boolean;
  unusedFields: boolean;
  currentYield: number;
  previousYield: number;
  profitability: number;
  expenses: number;
}

interface AIAdvice {
  id: string;
  category: string;
  title: string;
  advice: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: string;
  createdAt: Date;
}

// Templates de conseils intelligents basés sur les données
const generateSmartAdvice = (userData: UserData): AIAdvice[] => {
  const advice: AIAdvice[] = [];
  const timestamp = Date.now();

  // Analyse RH - Ratio employés/tâches
  const employeeEfficiency = userData.simpleTasks / userData.employees;
  if (employeeEfficiency < 0.3) {
    advice.push({
      id: `advice-${timestamp}-1`,
      category: 'Ressources Humaines',
      title: 'Optimisation des effectifs sur les tâches simples',
      advice: `Avec ${userData.employees} employés pour ${userData.simpleTasks} tâches simples, vous avez un ratio de ${employeeEfficiency.toFixed(2)} tâche par employé. Considérez la formation polyvalente de 2-3 employés pour gérer ces tâches, libérant ainsi les autres pour des activités à plus forte valeur ajoutée comme la supervision qualité ou la maintenance préventive.`,
      priority: employeeEfficiency < 0.2 ? 'high' : 'medium',
      estimatedImpact: '+20% efficacité',
      createdAt: new Date()
    });
  }

  // Analyse Production - Évolution des rendements
  const yieldImprovement = ((userData.currentYield - userData.previousYield) / userData.previousYield) * 100;
  if (yieldImprovement < 10) {
    const targetYield = userData.currentYield * 1.15;
    advice.push({
      id: `advice-${timestamp}-2`,
      category: 'Production',
      title: `Amélioration du rendement ${userData.crop}`,
      advice: `Votre rendement actuel de ${userData.currentYield}t/ha pour la culture de ${userData.crop} peut être optimisé. Avec un semis en ${userData.sowMonth} et une récolte en ${userData.averageHarvestMonth}, une analyse des sols et l'ajustement de votre programme de fertilisation pourraient vous permettre d'atteindre ${targetYield.toFixed(1)}t/ha. ${userData.unusedFields ? 'Profitez de vos parcelles non utilisées pour des tests.' : ''}`,
      priority: yieldImprovement < 0 ? 'high' : 'medium',
      estimatedImpact: '+15% rendement',
      createdAt: new Date()
    });
  }

  // Analyse Financière - Ratio profitabilité/dépenses
  const profitabilityRatio = userData.profitability / userData.expenses;
  if (profitabilityRatio < 0.8) {
    advice.push({
      id: `advice-${timestamp}-3`,
      category: 'Finances',
      title: 'Optimisation de la rentabilité financière',
      advice: `Votre ratio profitabilité/dépenses de ${profitabilityRatio.toFixed(2)} indique une marge d'amélioration. Avec ${userData.expenses}€ de dépenses pour ${userData.profitability}€ de profit par hectare, focalisez-vous sur la réduction des coûts d'intrants de 15% via des achats groupés et l'optimisation de votre période de vente en ${userData.salesPeriod}.`,
      priority: profitabilityRatio < 0.5 ? 'high' : 'medium',
      estimatedImpact: '+25% profit',
      createdAt: new Date()
    });
  }

  // Conseil stratégique basé sur la comparaison avec d'autres agriculteurs
  if (userData.comparisonFarmersBenefit) {
    advice.push({
      id: `advice-${timestamp}-4`,
      category: 'Stratégie',
      title: 'Collaboration et partage d\'expériences',
      advice: `Vous bénéficiez déjà des échanges avec d'autres agriculteurs. Formalisez ces collaborations : créez un groupement d'achat pour réduire les coûts de 10-15%, partagez les équipements coûteux et organisez des formations croisées sur les bonnes pratiques spécifiques à la culture de ${userData.crop}.`,
      priority: 'medium',
      estimatedImpact: '+10% économies',
      createdAt: new Date()
    });
  }

  return advice;
};

export const useAIAdvisor = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [advice, setAdvice] = useState<AIAdvice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateAdvice = useCallback(async (userData: UserData) => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulation d'un délai de traitement pour l'effet "IA"
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const smartAdvice = generateSmartAdvice(userData);
      setAdvice(smartAdvice);
    } catch (error) {
      console.error('Erreur génération conseils:', error);
      setError('Erreur lors de la génération des conseils');
    } finally {
      setIsGenerating(false);
    }
  }, []);

  return {
    advice,
    isGenerating,
    error,
    generateAdvice
  };
};
