import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from './ImportExportFunctions';
import { 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown,
  MapPin,
  Calendar
} from 'lucide-react';

interface InventoryGridProps {
  items: InventoryItem[];
  onItemSelect: (item: InventoryItem) => void;
  onItemEdit: (item: InventoryItem) => void;
  onItemDelete: (id: number) => void;
  onTransaction: (item: InventoryItem, type: 'in' | 'out') => void;
}

const InventoryGrid: React.FC<InventoryGridProps> = ({
  items,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onTransaction
}) => {
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return { status: 'empty', color: 'destructive', icon: AlertTriangle };
    }
    if (item.quantity < item.minQuantity * 0.5) {
      return { status: 'critical', color: 'destructive', icon: AlertTriangle };
    }
    if (item.quantity <= item.minQuantity) {
      return { status: 'low', color: 'secondary', icon: AlertTriangle };
    }
    return { status: 'normal', color: 'default', icon: CheckCircle };
  };

  const getStockPercentage = (item: InventoryItem) => {
    if (item.minQuantity === 0) return 100;
    return Math.min(100, (item.quantity / (item.minQuantity * 2)) * 100);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
        <p className="text-muted-foreground mb-4">
          Aucun article ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
      {items.map((item) => {
        const stockStatus = getStockStatus(item);
        const stockPercentage = getStockPercentage(item);
        const StatusIcon = stockStatus.icon;

        return (
          <Card
            key={item.id}
            className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
            onClick={() => onItemSelect(item)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{item.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{item.category}</p>
                  </div>
                </div>
                <Badge 
                  variant={stockStatus.color as any}
                  className="ml-2 flex items-center gap-1"
                >
                  <StatusIcon className="h-3 w-3" />
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Stock</span>
                  <span className="font-semibold">
                    {item.quantity} {item.unit}
                  </span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      stockStatus.status === 'critical' ? 'bg-destructive' :
                      stockStatus.status === 'low' ? 'bg-yellow-500' :
                      'bg-emerald-500'
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Min: {item.minQuantity}</span>
                  <span>{item.price.toFixed(2)} FCFA/{item.unit}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{item.location || 'Non spécifié'}</span>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTransaction(item, 'in');
                  }}
                  className="flex-1 h-8"
                >
                  <ArrowDown className="h-3 w-3 mr-1" />
                  Entrée
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onTransaction(item, 'out');
                  }}
                  className="flex-1 h-8"
                >
                  <ArrowUp className="h-3 w-3 mr-1" />
                  Sortie
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemEdit(item);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onItemDelete(item.id);
                  }}
                  className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default InventoryGrid;