
import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import Dashboard from '../components/Dashboard';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import GuadeloupeHarvestTracking from '../components/GuadeloupeHarvestTracking';
import GuadeloupeWeatherAlerts from '../components/GuadeloupeWeatherAlerts';
import TaskList from '../components/cultures/TaskList';
import { Button } from '@/components/ui/button';
import { PlusCircle, Download, Filter, RefreshCw, Upload, Printer } from 'lucide-react';
import { StatisticsProvider } from '../contexts/StatisticsContext';
import { useCRM } from '../contexts/CRMContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userName, setUserName] = useState('Exploitant');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Utiliser le contexte CRM
  const { 
    lastSync,
    isRefreshing,
    syncDataAcrossCRM,
    exportModuleData,
    importModuleData,
    printModuleData
  } = useCRM();

  // Actions based on the active tab
  const getTabActions = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={syncDataAcrossCRM}
            >
              <RefreshCw className={`h-4 w-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              Synchroniser
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleExportData('dashboard')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exporter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handleImportData()}
            >
              <Upload className="h-4 w-4 text-gray-600" />
              Importer
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50 transition-colors"
              onClick={() => handlePrintData('dashboard')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimer
            </Button>
          </div>
        );
      case 'harvest':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('harvest')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exporter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('harvest')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimer
            </Button>
          </div>
        );
      case 'weather':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('weather')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exporter
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              Configurer
            </Button>
          </div>
        );
      case 'tasks':
        return (
          <div className="flex flex-wrap gap-3">
            <Button 
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Ajouter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handleExportData('tasks')}
            >
              <Download className="h-4 w-4 text-gray-600" />
              Exporter
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white border-gray-200 hover:bg-gray-50"
              onClick={() => handlePrintData('tasks')}
            >
              <Printer className="h-4 w-4 text-gray-600" />
              Imprimer
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    console.log(`Changement d'onglet vers: ${value}`);
  };

  // Manipulations des données
  const handleExportData = async (tab: string) => {
    const moduleMapping: {[key: string]: string} = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[tab] || 'statistiques';
    const format = tab === 'dashboard' ? 'excel' : 'csv';
    
    try {
      await exportModuleData(module, format as 'csv' | 'excel' | 'pdf');
      console.log(`Export des données ${module} au format ${format} lancé`);
    } catch (error) {
      console.error(`Error exporting ${module}:`, error);
    }
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };

  const handleImportConfirm = async () => {
    if (!selectedFile) {
      console.error("Aucun fichier sélectionné");
      return;
    }
    
    const moduleMapping = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[activeTab] || 'statistiques';
    
    try {
      await importModuleData(module, selectedFile);
      console.log(`Importation du fichier ${selectedFile.name} réussie`);
    } catch (error) {
      console.error(`Error importing ${module}:`, error);
    }
    
    setImportDialogOpen(false);
    setSelectedFile(null);
  };

  const handlePrintData = async (tab: string) => {
    const moduleMapping = {
      'dashboard': 'statistiques',
      'harvest': 'cultures',
      'weather': 'statistiques',
      'tasks': 'cultures'
    };
    
    const module = moduleMapping[tab] || 'statistiques';
    
    try {
      await printModuleData(module);
      console.log(`Impression des données ${module} lancée`);
    } catch (error) {
      console.error(`Error printing ${module}:`, error);
    }
  };

  const tabs: TabItem[] = [
    {
      value: 'dashboard',
      label: 'Tableau de Bord',
      content: <Dashboard />
    },
    {
      value: 'harvest',
      label: 'Suivi des Récoltes',
      content: <GuadeloupeHarvestTracking />
    },
    {
      value: 'weather',
      label: 'Alertes Météo',
      content: <GuadeloupeWeatherAlerts />
    },
    {
      value: 'tasks',
      label: 'Tâches',
      content: <TaskList />
    }
  ];

  return (
    <StatisticsProvider>
      <PageLayout>
        <div className="p-3 sm:p-6 animate-enter">
          {/* Hero Section - Application Introduction */}
          <div className="mb-8 p-6 sm:p-8 bg-gradient-to-br from-primary/10 via-background to-accent/5 rounded-2xl border border-primary/20">
            <div className="text-center space-y-4">
              <h1 className="text-2xl sm:text-4xl font-bold text-primary mb-2">
                🌾 Agri Dom - Gestion Agricole Intelligente
              </h1>
              <p className="text-sm sm:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Système complet de gestion agricole conçu pour optimiser votre exploitation. 
                Gérez vos parcelles, cultures, inventaire et finances en toute simplicité.
              </p>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mt-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-xs sm:text-sm">
                  <span className="text-primary">📈</span>
                  <span>Suivi en temps réel</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-accent/10 rounded-full text-xs sm:text-sm">
                  <span className="text-accent-foreground">💡</span>
                  <span>Conseils intelligents</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-full text-xs sm:text-sm">
                  <span className="text-secondary">🔄</span>
                  <span>Synchronisation automatique</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Tableau de Bord</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Bienvenue, {userName} | Dernière synchronisation: {lastSync.toLocaleTimeString()}
              </p>
            </div>
            <div className="w-full sm:w-auto overflow-x-auto">
              {getTabActions()}
            </div>
          </div>
          
          <TabContainer 
            tabs={tabs}
            defaultValue={activeTab}
            onValueChange={handleTabChange}
          />
          
          <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Importer des données</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Fichier CSV</Label>
                  <input 
                    type="file" 
                    id="file" 
                    accept=".csv" 
                    onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full border border-input bg-background px-3 py-2 text-sm rounded-md"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Les données seront importées dans le module courant. 
                  Assurez-vous que le fichier est au format CSV.
                </p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setImportDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleImportConfirm}>Importer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </PageLayout>
    </StatisticsProvider>
  );
};

export default Index;
