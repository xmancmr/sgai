
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Share2, Calendar, Building2 } from 'lucide-react';

interface ReportHeaderProps {
  reportData: any;
  onDownload: () => void;
  onShare?: () => void;
}

export const ReportHeader: React.FC<ReportHeaderProps> = ({ reportData, onDownload, onShare }) => {
  const currentDate = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const reportPeriod = "Premier Semestre 2024";
  const exploitationName = "Exploitation Agricole - Guadeloupe";

  return (
    <div className="space-y-4">
      {/* En-tête principal */}
      <Card className="bg-gradient-to-r from-slate-900 to-blue-900 text-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Building2 className="h-4 w-4" />
                {exploitationName}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Rapport Financier Intelligent
              </h1>
              <div className="flex items-center gap-2 text-blue-200 text-sm">
                <Calendar className="h-4 w-4" />
                Période analysée: {reportPeriod}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={onDownload}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
              {onShare && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onShare}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résumé exécutif */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <FileText className="h-5 w-5" />
            Résumé Exécutif
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">71 610 €</div>
              <div className="text-sm text-gray-600 mb-2">Revenus Totaux</div>
              <Badge className="bg-green-100 text-green-800 text-xs">+12.5%</Badge>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-red-200 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">51 670 €</div>
              <div className="text-sm text-gray-600 mb-2">Dépenses Totales</div>
              <Badge className="bg-red-100 text-red-800 text-xs">+5.2%</Badge>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">19 940 €</div>
              <div className="text-sm text-gray-600 mb-2">Bénéfice Net</div>
              <Badge className="bg-blue-100 text-blue-800 text-xs">+28.3%</Badge>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">27.8%</div>
              <div className="text-sm text-gray-600 mb-2">Marge Bénéficiaire</div>
              <Badge className="bg-purple-100 text-purple-800 text-xs">Excellent</Badge>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="font-semibold mb-3 text-gray-800">Points Clés de la Période</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Forte croissance des revenus de récolte (+12.5%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>ROI exceptionnel à 28.9% (vs 22% secteur)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Diversification réussie des sources de revenus</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Optimisation nécessaire des coûts d'intrants</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <span>Opportunités d'agrotourisme identifiées</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <span>Potentiel de labellisation bio évalué</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informations du rapport */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <div className="flex items-center gap-4">
          <span>Généré le: {currentDate}</span>
          <span>•</span>
          <span>Analyse IA intégrée</span>
          <span>•</span>
          <span>Données temps réel</span>
        </div>
        <Badge variant="outline" className="text-xs">
          Version 2.1 - Enhanced
        </Badge>
      </div>
    </div>
  );
};
