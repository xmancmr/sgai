import React, { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, subDays } from 'date-fns';
import PageLayout from '../components/layout/PageLayout';
import ParcelManagement from '../components/ParcelManagement';
import PageHeader from '../components/layout/PageHeader';
import usePageMetadata from '../hooks/use-page-metadata';
import ParcelFilters from '../components/parcels/ParcelFilters';
import ParcelActionButtons from '../components/parcels/ParcelActionButtons';
import ParcelMapDialog from '../components/parcels/ParcelMapDialog';
import ParcelImportDialog from '../components/parcels/ParcelImportDialog';
import GuadeloupeParcelManagement from '../components/GuadeloupeParcelManagement';
import TabContainer from '../components/layout/TabContainer';
import { useCRM } from '../contexts/CRMContext';
import { FileSpreadsheet, FileBarChart2, MapPin, BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ParcelsPage = () => {
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Gestion des Parcelles',
    defaultDescription: 'Gérez, organisez et optimisez toutes vos parcelles agricoles'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [mapPreviewOpen, setMapPreviewOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [statsDialogOpen, setStatsDialogOpen] = useState(false);
  const [layersDialogOpen, setLayersDialogOpen] = useState(false);
  const [weatherAlertsOpen, setWeatherAlertsOpen] = useState(false);
  const [showGuadeloupeView, setShowGuadeloupeView] = useState(true);
  const [lastSyncDate, setLastSyncDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const { syncDataAcrossCRM } = useCRM();
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 50]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  
  const [activeParcelAlerts, setActiveParcelAlerts] = useState([
    { id: 1, parcel: 'Parcelle A12', type: 'Pluie intense', severity: 'Haute' },
    { id: 2, parcel: 'Parcelle B05', type: 'Sécheresse', severity: 'Moyenne' }
  ]);

  const [parcelStats, setParcelStats] = useState({
    totalSurface: 128.5,
    activeParcels: 42,
    averageYield: 7.2,
    mainCrops: ['Maïs', 'Blé', 'Colza'],
    monthlyProduction: [
      { month: 'Jan', production: 45 },
      { month: 'Fév', production: 52 },
      { month: 'Mar', production: 48 },
      { month: 'Avr', production: 61 },
      { month: 'Mai', production: 55 },
      { month: 'Jun', production: 67 }
    ],
    cropDistribution: [
      { crop: 'Maïs', percentage: 35, surface: 45.0 },
      { crop: 'Blé', percentage: 28, surface: 36.0 },
      { crop: 'Colza', percentage: 22, surface: 28.3 },
      { crop: 'Tournesol', percentage: 15, surface: 19.2 }
    ],
    recentActivities: [
      { date: '2023-11-15', activity: 'Récolte parcelle Nord', status: 'Terminé' },
      { date: '2023-11-10', activity: 'Semis parcelle Est', status: 'En cours' },
      { date: '2023-11-08', activity: 'Traitement parcelle Sud', status: 'Planifié' }
    ]
  });

  useEffect(() => {
    const syncWithOtherModules = () => {
      console.log("Synchronisation des données avec les modules de cultures et de statistiques");
      
      const timer = setTimeout(() => {
        setLastSyncDate(new Date());
        syncDataAcrossCRM();
        console.log("Les données des parcelles sont maintenant synchronisées avec tous les modules");
      }, 1500);
      
      return () => clearTimeout(timer);
    };
    
    syncWithOtherModules();
  }, [syncDataAcrossCRM]);

  const handleExportData = () => {
    const parcelData = {
      parcelles: parcelStats.activeParcels,
      surface: parcelStats.totalSurface,
      rendement: parcelStats.averageYield,
      cultures: parcelStats.cropDistribution,
      production: parcelStats.monthlyProduction,
      activites: parcelStats.recentActivities
    };
    
    const dataStr = JSON.stringify(parcelData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parcelles_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log("Données des parcelles exportées avec succès");
  };

  const handleImportData = () => {
    setImportDialogOpen(true);
  };
  
  const handleImportConfirm = (importType: string) => {
    setImportDialogOpen(false);
    console.log(`Les données ${importType} ont été importées avec succès`);
    console.log("Les modules Cultures et Statistiques ont été mis à jour avec les nouvelles données");
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      // Simuler une recherche dans les parcelles
      const mockParcels = [
        { id: 'P001', nom: 'Parcelle Nord A', culture: 'Maïs', surface: 5.2 },
        { id: 'P002', nom: 'Parcelle Sud B', culture: 'Blé', surface: 3.8 },
        { id: 'P003', nom: 'Parcelle Est C', culture: 'Colza', surface: 4.1 },
        { id: 'P004', nom: 'Parcelle Ouest D', culture: 'Tournesol', surface: 2.9 }
      ];
      
      const searchResults = mockParcels.filter(parcelle => 
        parcelle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcelle.culture.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcelle.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`Recherche effectuée pour "${searchTerm}":`, searchResults);
      console.log(`${searchResults.length} parcelle(s) trouvée(s)`);
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Basse':
        return 'bg-green-100 text-green-800';
      case 'Moyenne':
        return 'bg-yellow-100 text-yellow-800';
      case 'Haute':
        return 'bg-orange-100 text-orange-800';
      case 'Extrême':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleView = () => {
    setShowGuadeloupeView(!showGuadeloupeView);
    console.log(`Vue ${showGuadeloupeView ? 'Standard' : 'Guadeloupe'} activée`);
    console.log(`Les données affichées dans les modules Cultures et Finances ont été adaptées`);
  };

  const handleGenerateStatistics = () => {
    // Calculer des statistiques en temps réel
    const totalSurface = parcelStats.totalSurface;
    const productionTotale = parcelStats.monthlyProduction.reduce((sum, month) => sum + month.production, 0);
    const rendementMoyen = productionTotale / totalSurface;
    
    const statsReport = {
      date: new Date().toLocaleDateString('fr-FR'),
      statistiques: {
        surfaceTotale: totalSurface + ' ha',
        parcellesActives: parcelStats.activeParcels,
        productionTotale: productionTotale + ' tonnes',
        rendementMoyen: rendementMoyen.toFixed(2) + ' t/ha',
        culturesOptimales: parcelStats.mainCrops,
        repartitionCultures: parcelStats.cropDistribution
      }
    };
    
    console.log("Statistiques générées:", statsReport);
    setStatsDialogOpen(true);
  };

  const handleOpenLayerManager = () => {
    const availableLayers = [
      { id: 'satellite', name: 'Vue satellite', active: true },
      { id: 'topographic', name: 'Topographique', active: false },
      { id: 'soil', name: 'Type de sol', active: true },
      { id: 'irrigation', name: 'Système d\'irrigation', active: false },
      { id: 'weather', name: 'Données météo', active: true }
    ];
    
    console.log("Couches disponibles:", availableLayers);
    console.log("Gestionnaire de couches ouvert - Vous pouvez maintenant activer/désactiver les couches de visualisation");
    setLayersDialogOpen(true);
  };

  const handleAddParcel = () => {
    console.log("Formulaire de création de parcelle ouvert");
  };

  const handleTabChange = (value: string) => {
    console.log(`Changement d'onglet vers: ${value}`);
    setActiveTab(value);
  };

  const StatisticsOverview = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 p-6 bg-white rounded-xl border border-muted shadow-sm"
    >
      <div className="flex items-center mb-6">
        <BarChart3 className="h-6 w-6 mr-3 text-agri-primary" />
        <h2 className="text-xl font-semibold">Aperçu des statistiques parcellaires</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Surface totale</p>
              <p className="text-2xl font-bold text-blue-800">{parcelStats.totalSurface} ha</p>
            </div>
            <MapPin className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Parcelles actives</p>
              <p className="text-2xl font-bold text-green-800">{parcelStats.activeParcels}</p>
            </div>
            <FileSpreadsheet className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Rendement moyen</p>
              <p className="text-2xl font-bold text-yellow-800">{parcelStats.averageYield} t/ha</p>
            </div>
            <TrendingUp className="h-8 w-8 text-yellow-600" />
          </div>
        </motion.div>
        
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Cultures principales</p>
              <p className="text-lg font-semibold text-purple-800">{parcelStats.mainCrops.join(', ')}</p>
            </div>
            <FileBarChart2 className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-4">Répartition des cultures</h3>
          <div className="space-y-3">
            {parcelStats.cropDistribution.map((crop, index) => (
              <div key={crop.crop} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-500' : 
                    index === 1 ? 'bg-green-500' : 
                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`} />
                  <span className="font-medium">{crop.crop}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{crop.percentage}%</div>
                  <div className="text-sm text-muted-foreground">{crop.surface} ha</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Activités récentes</h3>
          <div className="space-y-3">
            {parcelStats.recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{activity.activity}</div>
                    <div className="text-sm text-muted-foreground">{activity.date}</div>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activity.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                  activity.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    {
      value: 'overview',
      label: 'Vue d\'ensemble',
      content: (
        <div>
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border">
            <p className="text-sm text-blue-600">Onglet actif: Vue d'ensemble</p>
          </div>
          <StatisticsOverview />
          {showGuadeloupeView ? (
            <GuadeloupeParcelManagement />
          ) : (
            <ParcelManagement />
          )}
        </div>
      )
    },
    {
      value: 'management',
      label: 'Gestion',
      content: (
        <div>
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Gestion des parcelles</h3>
            <p className="text-blue-600">Interface de gestion complète de toutes vos parcelles agricoles.</p>
          </div>
          {showGuadeloupeView ? (
            <GuadeloupeParcelManagement />
          ) : (
            <ParcelManagement />
          )}
        </div>
      )
    },
    {
      value: 'analytics',
      label: 'Analytiques', 
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Analyses détaillées</h3>
            <p className="text-muted-foreground">Analysez les performances de vos parcelles avec des métriques avancées.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg border">
              <h4 className="font-semibold mb-4">Évolution mensuelle</h4>
              <div className="space-y-2">
                {parcelStats.monthlyProduction.map((month) => (
                  <div key={month.month} className="flex justify-between items-center">
                    <span className="text-sm">{month.month}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ width: `${(month.production / 70) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{month.production}t</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-6 bg-white rounded-lg border">
              <h4 className="font-semibold mb-4">Indicateurs clés</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Taux d'utilisation</span>
                  <span className="font-semibold text-green-600">87%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Efficacité irrigation</span>
                  <span className="font-semibold text-blue-600">92%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Score santé sol</span>
                  <span className="font-semibold text-yellow-600">8.2/10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">ROI moyen</span>
                  <span className="font-semibold text-purple-600">15.3%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      value: 'reports',
      label: 'Rapports',
      content: (
        <div className="space-y-6">
          <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Génération de rapports</h3>
            <p className="text-muted-foreground">Créez et exportez des rapports détaillés sur vos parcelles.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border">
              <FileSpreadsheet className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">Rapport de production</h4>
              <p className="text-sm text-muted-foreground mb-3">Analyse détaillée des rendements par parcelle</p>
              <button className="w-full px-3 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700">
                Générer
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <BarChart3 className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Rapport financier</h4>
              <p className="text-sm text-muted-foreground mb-3">Analyse des coûts et revenus par parcelle</p>
              <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
                Générer
              </button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border">
              <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
              <h4 className="font-semibold mb-2">Rapport d'évolution</h4>
              <p className="text-sm text-muted-foreground mb-3">Tendances et projections futures</p>
              <button className="w-full px-3 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700">
                Générer
              </button>
            </div>
          </div>
          
          <div className="p-6 bg-white rounded-lg border">
            <h4 className="font-semibold mb-4">Rapports récents</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Rapport mensuel - Novembre 2023</div>
                    <div className="text-sm text-muted-foreground">Généré le 15/11/2023</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                  Télécharger
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Analyse trimestrielle Q3 2023</div>
                    <div className="text-sm text-muted-foreground">Généré le 01/11/2023</div>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300">
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <PageLayout>
      <div className="p-6 animate-enter">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div>
            <PageHeader 
              title={title}
              description={description}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Dernière synchronisation avec les autres modules: {lastSyncDate.toLocaleString()}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <ParcelFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              filterType={filterType}
              setFilterType={setFilterType}
              onSearch={handleSearch}
              dateRange={dateRange}
              setDateRange={setDateRange}
              areaRange={areaRange}
              setAreaRange={setAreaRange}
            />
            
            <ParcelActionButtons 
              onExportData={handleExportData}
              onImportData={handleImportData}
              onOpenMap={() => setMapPreviewOpen(true)}
              onAddParcel={handleAddParcel}
              onGenerateStatistics={handleGenerateStatistics}
              onOpenLayerManager={handleOpenLayerManager}
              activeParcelAlerts={activeParcelAlerts}
              weatherAlertsOpen={weatherAlertsOpen}
              setWeatherAlertsOpen={setWeatherAlertsOpen}
              getSeverityColor={getSeverityColor}
            />
            
            <button 
              className="inline-flex items-center px-4 py-2 border border-input bg-white rounded-lg hover:bg-muted/30 transition-colors"
              onClick={toggleView}
            >
              {showGuadeloupeView ? 'Vue Standard' : 'Vue Guadeloupe'}
            </button>
          </div>
        </div>

        <TabContainer
          tabs={tabs}
          defaultValue={activeTab}
          onValueChange={handleTabChange}
        />
        
        <ParcelMapDialog 
          isOpen={mapPreviewOpen} 
          onOpenChange={setMapPreviewOpen} 
        />
        
        <ParcelImportDialog 
          isOpen={importDialogOpen} 
          onOpenChange={setImportDialogOpen}
          onImportConfirm={handleImportConfirm}
        />
      </div>
    </PageLayout>
  );
};

export default ParcelsPage;
