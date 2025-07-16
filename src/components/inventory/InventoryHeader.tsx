import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  Plus, 
  FileDown, 
  FileUp, 
  BarChart2, 
  Grid3X3,
  List,
  Search,
  Filter
} from 'lucide-react';

interface InventoryHeaderProps {
  view: 'list' | 'grid' | 'stats';
  onViewChange: (view: 'list' | 'grid' | 'stats') => void;
  onAddItem: () => void;
  onImport: () => void;
  onExport: () => void;
  totalItems: number;
  lowStockCount: number;
  totalValue: number;
}

const InventoryHeader: React.FC<InventoryHeaderProps> = ({
  view,
  onViewChange,
  onAddItem,
  onImport,
  onExport,
  totalItems,
  lowStockCount,
  totalValue
}) => {
  return (
    <div className="border-b bg-background/50 backdrop-blur-sm p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Gestion d'Inventaire</h1>
              <p className="text-muted-foreground">
                {totalItems} articles • {lowStockCount} alertes • {totalValue.toFixed(2)} FCFA
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-muted/50 rounded-lg p-1">
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('list')}
                className="h-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('grid')}
                className="h-8"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'stats' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('stats')}
                className="h-8"
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={onAddItem}
              className="h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un article
            </Button>
            
            <Button
              variant="outline"
              onClick={onImport}
              className="h-9"
            >
              <FileUp className="h-4 w-4 mr-2" />
              Importer
            </Button>
            
            <Button
              variant="outline"
              onClick={onExport}
              className="h-9"
            >
              <FileDown className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              En stock: {totalItems - lowStockCount}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Stock faible: {lowStockCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryHeader;