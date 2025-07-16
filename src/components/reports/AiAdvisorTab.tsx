
import React, { useEffect, useState } from "react";
import { Sparkles, Lightbulb, RefreshCw, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useAIAdvisor } from "../../hooks/use-ai-advisor";
import { toast } from "sonner";

// Simulation de données utilisateur - à remplacer par de vraies données
const getUserData = () => ({
  employees: 10,
  simpleTasks: 2,
  sowMonth: "Juin",
  crop: "Bananes",
  averageHarvestMonth: "Novembre",
  salesPeriod: "Décembre",
  comparisonFarmersBenefit: true,
  unusedFields: true,
  currentYield: 32,
  previousYield: 30,
  profitability: 1250,
  expenses: 2200
});

const AiAdvisorTab = () => {
  const { advice, isGenerating, error, generateAdvice } = useAIAdvisor();
  const [userData] = useState(getUserData());

  useEffect(() => {
    // Générer automatiquement les conseils au chargement
    handleGenerateAdvice();
  }, []);

  const handleGenerateAdvice = async () => {
    try {
      await generateAdvice(userData);
      toast.success("Nouveaux conseils générés avec succès !");
    } catch (err) {
      toast.error("Erreur lors de la génération des conseils");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'Priorité Haute';
      case 'medium':
        return 'Priorité Moyenne';
      case 'low':
        return 'Priorité Basse';
      default:
        return 'Non défini';
    }
  };

  if (error) {
    return (
      <section className="w-full max-w-4xl mx-auto pt-6 px-2">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center">
              <Sparkles className="mr-2 text-agri-primary" />
              Conseils personnalisés par l'IA
            </h2>
            <p className="text-gray-600">
              Notre agent IA analyse vos données pour vous proposer des conseils personnalisés
            </p>
          </div>
          <Button onClick={handleGenerateAdvice} disabled={isGenerating}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser les conseils
          </Button>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-700">
              <Lightbulb className="h-5 w-5" />
              <span className="font-medium">Erreur de génération</span>
            </div>
            <p className="text-red-600 mt-2">{error}</p>
            <Button 
              onClick={handleGenerateAdvice} 
              className="mt-4 bg-red-600 hover:bg-red-700"
              disabled={isGenerating}
            >
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="w-full max-w-4xl mx-auto pt-6 px-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2 flex items-center">
            <Sparkles className="mr-2 text-agri-primary" />
            Conseils personnalisés par l'IA
          </h2>
          <p className="text-gray-600">
            Notre agent IA analyse vos données pour vous proposer des conseils personnalisés
          </p>
        </div>
        <Button onClick={handleGenerateAdvice} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          {isGenerating ? 'Génération...' : 'Actualiser les conseils'}
        </Button>
      </div>

      {isGenerating && advice.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-agri-primary" />
            <p className="text-gray-600">L'agent IA analyse vos données...</p>
            <p className="text-sm text-gray-500 mt-2">
              Génération de conseils personnalisés en cours
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {advice.map((item) => (
            <Card key={item.id} className="transition-all hover:shadow-lg border-l-4 border-l-agri-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Lightbulb className="mr-2 text-agri-primary" />
                    {item.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(item.priority)}>
                      {getPriorityLabel(item.priority)}
                    </Badge>
                    <Badge variant="outline">{item.category}</Badge>
                  </div>
                </div>
                <CardDescription className="flex items-center space-x-4">
                  <span>Impact estimé: {item.estimatedImpact}</span>
                  <span className="text-xs text-gray-500">
                    Généré le {item.createdAt.toLocaleDateString('fr-FR')}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{item.advice}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <Button size="sm" variant="outline">
                    Marquer comme appliqué
                  </Button>
                  <span className="text-sm text-gray-500">
                    Conseil #{item.id.split('-')[1]}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {advice.length === 0 && !isGenerating && (
            <Card className="border-dashed border-2 border-gray-300">
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucun conseil disponible
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Cliquez sur "Actualiser les conseils" pour générer de nouvelles recommandations
                  </p>
                  <Button onClick={handleGenerateAdvice}>
                    Générer des conseils
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </section>
  );
};

export default AiAdvisorTab;
