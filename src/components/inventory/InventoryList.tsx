import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from './ImportExportFunctions';
import { 
  Edit, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  AlertTriangle, 
  CheckCircle,
  Eye
} from 'lucide-react';

interface InventoryListProps {
  items: InventoryItem[];
  onItemSelect: (item: InventoryItem) => void;
  onItemEdit: (item: InventoryItem) => void;
  onItemDelete: (id: number) => void;
  onTransaction: (item: InventoryItem, type: 'in' | 'out') => void;
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const InventoryList: React.FC<InventoryListProps> = ({
  items,
  onItemSelect,
  onItemEdit,
  onItemDelete,
  onTransaction,
  onSort,
  sortBy,
  sortOrder
}) => {
  const getStockStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return { status: 'Rupture', color: 'destructive', icon: AlertTriangle };
    }
    if (item.quantity < item.minQuantity * 0.5) {
      return { status: 'Critique', color: 'destructive', icon: AlertTriangle };
    }
    if (item.quantity <= item.minQuantity) {
      return { status: 'Faible', color: 'secondary', icon: AlertTriangle };
    }
    return { status: 'Normal', color: 'default', icon: CheckCircle };
  };

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="p-4 bg-muted/50 rounded-full mb-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">Aucun article trouvé</h3>
        <p className="text-muted-foreground">
          Aucun article ne correspond à vos critères de recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort('name')}
            >
              Article {getSortIcon('name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort('category')}
            >
              Catégorie {getSortIcon('category')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors text-right"
              onClick={() => onSort('quantity')}
            >
              Stock {getSortIcon('quantity')}
            </TableHead>
            <TableHead className="text-center">Statut</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors text-right"
              onClick={() => onSort('price')}
            >
              Prix unitaire {getSortIcon('price')}
            </TableHead>
            <TableHead className="text-right">Valeur totale</TableHead>
            <TableHead>Emplacement</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/70 transition-colors"
              onClick={() => onSort('lastUpdated')}
            >
              Dernière MAJ {getSortIcon('lastUpdated')}
            </TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => {
            const stockStatus = getStockStatus(item);
            const StatusIcon = stockStatus.icon;
            const totalValue = item.quantity * item.price;

            return (
              <TableRow 
                key={item.id} 
                className="hover:bg-muted/30 transition-colors cursor-pointer"
                onClick={() => onItemSelect(item)}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-semibold">
                      {item.quantity} {item.unit}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Min: {item.minQuantity}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant={stockStatus.color as any}
                    className="flex items-center gap-1 w-fit mx-auto"
                  >
                    <StatusIcon className="h-3 w-3" />
                    {stockStatus.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {item.price.toFixed(2)} FCFA
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {totalValue.toFixed(2)} FCFA
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.location || 'Non spécifié'}
                </TableCell>
                <TableCell>
                  {new Date(item.lastUpdated).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemSelect(item);
                      }}
                      className="h-8 w-8 p-0"
                      title="Voir détails"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransaction(item, 'in');
                      }}
                      className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                      title="Entrée de stock"
                    >
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTransaction(item, 'out');
                      }}
                      className="h-8 w-8 p-0 text-amber-600 hover:text-amber-700"
                      title="Sortie de stock"
                    >
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemEdit(item);
                      }}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
                      title="Modifier"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onItemDelete(item.id);
                      }}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InventoryList;