
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import ParcelMap from '@/components/ParcelMap';
import { Search, Maximize2, Download, Layers, Ruler, Locate } from 'lucide-react';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from '@/components/ui/checkbox';

interface Layer {
  id: string;
  name: string;
  enabled: boolean;
  type: 'base' | 'overlay';
}

interface ParcelMapDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const ParcelMapDialog = ({ isOpen, onOpenChange }: ParcelMapDialogProps) => {
  const [coordinates, setCoordinates] = useState({ lat: 45.4631, lng: 4.3873 });
  const [searchQuery, setSearchQuery] = useState('');
  const [measureMode, setMeasureMode] = useState(false);
  const [measureResult, setMeasureResult] = useState<string | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [mapLayers, setMapLayers] = useState<Layer[]>([
    { id: 'satellite', name: 'Vue satellite', enabled: false, type: 'base' },
    { id: 'terrain', name: 'Terrain', enabled: true, type: 'base' },
    { id: 'parcels', name: 'Limites parcellaires', enabled: true, type: 'overlay' },
    { id: 'crops', name: 'Cultures actuelles', enabled: true, type: 'overlay' },
    { id: 'soil', name: 'Types de sol', enabled: false, type: 'overlay' },
    { id: 'irrigation', name: 'Irrigation', enabled: false, type: 'overlay' },
  ]);
  
  const handleResetView = () => {
    setCoordinates({ lat: 45.4631, lng: 4.3873 });
  };
  
  const handleExportMap = () => {
    toast.success("Export de la carte", {
      description: "La carte des parcelles a été exportée au format PDF"
    });
  };

  const toggleMeasureMode = () => {
    const newMode = !measureMode;
    setMeasureMode(newMode);
    
    if (newMode) {
      toast.info("Mode mesure activé", {
        description: "Cliquez sur la carte pour placer des points et mesurer la distance"
      });
    } else {
      setMeasureResult(null);
    }
  };

  const handleLayerChange = (layerId: string, enabled: boolean) => {
    setMapLayers(mapLayers.map(layer => 
      layer.id === layerId ? { ...layer, enabled } : layer
    ));
    
    // Si c'est une couche de base qui est activée, désactiver les autres couches de base
    if (enabled) {
      const layer = mapLayers.find(l => l.id === layerId);
      if (layer?.type === 'base') {
        setMapLayers(mapLayers.map(l => 
          l.type === 'base' ? { ...l, enabled: l.id === layerId } : l
        ));
      }
    }
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // Simuler une recherche de parcelle sur la carte
    toast.info("Recherche en cours", {
      description: `Recherche de la parcelle: ${searchQuery}`
    });

    // Simuler un résultat trouvé
    setTimeout(() => {
      setCoordinates({ lat: 45.4831, lng: 4.3973 });
      toast.success("Parcelle trouvée", {
        description: "La carte a été centrée sur la parcelle recherchée"
      });
    }, 1000);
  };

  const simulateMeasurement = () => {
    if (measureMode) {
      setMeasureResult("Distance: 245.3 mètres");
    }
  };

  // Activer la mesure sur la carte
  useEffect(() => {
    if (isOpen && measureMode) {
      const timer = setTimeout(simulateMeasurement, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, measureMode]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Position sur la carte</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col space-y-4 min-h-0">
          {/* Barre d'outils - hauteur fixe */}
          <div className="flex-shrink-0 flex justify-between items-center flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
            <form onSubmit={handleSearch} className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text"
                  placeholder="Rechercher une parcelle..."
                  className="pl-9 pr-4 py-2 w-full border rounded-md text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleResetView}>
                <Maximize2 className="h-4 w-4" />
              </Button>
              
              <Popover open={layersOpen} onOpenChange={setLayersOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Layers className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 z-[60]" side="bottom" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium text-sm">Couches de base</h4>
                    <div className="space-y-2">
                      {mapLayers.filter(l => l.type === 'base').map(layer => (
                        <div key={layer.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`layer-${layer.id}`} 
                            checked={layer.enabled}
                            onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                          />
                          <label 
                            htmlFor={`layer-${layer.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {layer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-medium text-sm">Couches supplémentaires</h4>
                    <div className="space-y-2">
                      {mapLayers.filter(l => l.type === 'overlay').map(layer => (
                        <div key={layer.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`layer-${layer.id}`} 
                            checked={layer.enabled}
                            onCheckedChange={(checked) => handleLayerChange(layer.id, checked === true)}
                          />
                          <label 
                            htmlFor={`layer-${layer.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {layer.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant={measureMode ? "default" : "outline"} 
                size="sm" 
                onClick={toggleMeasureMode}
                className={measureMode ? "bg-agri-primary text-white" : ""}
              >
                <Ruler className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={handleExportMap}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Carte - prend tout l'espace restant */}
          <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative min-h-[400px]">
            <ParcelMap 
              coordinates={coordinates}
              parcelName="Vue d'ensemble"
              isEditing={false}
              onCoordinatesChange={setCoordinates}
            />
            
            {/* Indicateurs de mode mesure - positionnés de manière non intrusive */}
            {measureMode && (
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border z-[45] max-w-xs">
                <div className="flex items-center text-sm">
                  <Ruler className="h-4 w-4 mr-2 text-agri-primary" />
                  <span className="font-medium">Mode mesure activé</span>
                </div>
                {measureResult && (
                  <div className="text-sm mt-1 font-bold text-agri-primary">{measureResult}</div>
                )}
              </div>
            )}
            
            {/* Légende des couches - positionnée de manière non intrusive */}
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md border z-[45] max-w-xs">
              <div className="text-xs font-medium mb-2">Couches actives:</div>
              <div className="flex flex-wrap gap-1">
                {mapLayers.filter(layer => layer.enabled).map(layer => (
                  <span 
                    key={layer.id}
                    className="text-xs px-2 py-1 bg-agri-primary/10 text-agri-primary rounded-full whitespace-nowrap"
                  >
                    {layer.name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Coordonnées - positionnées de manière non intrusive */}
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-2 text-xs rounded-lg shadow-md border z-[45]">
              Lat: {coordinates.lat.toFixed(4)} | Lng: {coordinates.lng.toFixed(4)}
            </div>
          </div>
          
          {/* Actions du bas - hauteur fixe */}
          <div className="flex-shrink-0 flex justify-between items-center pt-2">
            <Button 
              variant="outline" 
              onClick={() => {
                navigator.geolocation.getCurrentPosition((position) => {
                  const { latitude, longitude } = position.coords;
                  setCoordinates({ lat: latitude, lng: longitude });
                  toast.success("Localisation", {
                    description: "Carte centrée sur votre position"
                  });
                }, () => {
                  toast.error("Localisation", {
                    description: "Impossible d'obtenir votre position"
                  });
                });
              }}
              className="gap-2"
            >
              <Locate className="h-4 w-4" />
              Ma position
            </Button>
            
            <div className="text-sm text-muted-foreground text-center flex-1 mx-4">
              Cette vue d'ensemble montre l'emplacement de toutes vos parcelles. 
              Cliquez sur une parcelle spécifique pour voir plus de détails.
            </div>
            
            <Button onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ParcelMapDialog;
