import React, { useState, useRef, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { toast } from 'sonner';
import { InventoryItem, exportInventoryToCSV, importInventoryFromCSV, downloadInventoryTemplate } from './ImportExportFunctions';
import InventoryHeader from './InventoryHeader';
import InventorySearch from './InventorySearch';
import InventoryGrid from './InventoryGrid';
import InventoryList from './InventoryList';
import InventoryStats from './InventoryStats';
import InventoryAlerts from './InventoryAlerts';
import InventoryDetailPanel from './InventoryDetailPanel';
import ConfirmDialog from './ConfirmDialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Save, X } from 'lucide-react';

const initialInventoryData: InventoryItem[] = [
  { 
    id: 1, 
    name: 'Semences de blé', 
    category: 'Semences', 
    quantity: 500, 
    unit: 'kg', 
    minQuantity: 100, 
    price: 1250,
    location: 'Hangar principal',
    lastUpdated: '2024-01-15',
    supplier: 'Agro-Semences SARL',
    sku: 'SEM-BLE-001',
    expiryDate: '2024-12-31',
    notes: 'Semences certifiées pour la saison 2024'
  },
  { 
    id: 2, 
    name: 'Engrais NPK 15-15-15', 
    category: 'Engrais', 
    quantity: 800, 
    unit: 'kg', 
    minQuantity: 200, 
    price: 650,
    location: 'Hangar principal',
    lastUpdated: '2024-01-10',
    supplier: 'Fertil-Agri',
    sku: 'ENG-NPK-001',
    expiryDate: '2025-06-30',
    notes: 'Engrais complet pour céréales'
  },
  { 
    id: 3, 
    name: 'Herbicide glyphosate', 
    category: 'Produits phytosanitaires', 
    quantity: 45, 
    unit: 'L', 
    minQuantity: 20, 
    price: 8500,
    location: 'Local sécurisé',
    lastUpdated: '2024-01-12',
    supplier: 'Phyto-Protection',
    sku: 'HER-GLY-001',
    expiryDate: '2025-03-15',
    notes: 'Stockage en local ventilé obligatoire'
  },
  { 
    id: 4, 
    name: 'Gasoil agricole', 
    category: 'Carburants', 
    quantity: 1200, 
    unit: 'L', 
    minQuantity: 300, 
    price: 850,
    location: 'Cuve extérieure',
    lastUpdated: '2024-01-08',
    supplier: 'Fuel-Agri',
    sku: 'GAZ-AGR-001',
    notes: 'Carburant détaxé pour usage agricole'
  },
  { 
    id: 5, 
    name: 'Semences de maïs hybride', 
    category: 'Semences', 
    quantity: 75, 
    unit: 'kg', 
    minQuantity: 100, 
    price: 3200,
    location: 'Hangar principal',
    lastUpdated: '2024-01-05',
    supplier: 'Agro-Semences SARL',
    sku: 'SEM-MAI-001',
    expiryDate: '2024-08-31',
    notes: 'Variété précoce, rendement élevé'
  }
];

const initialTransactionHistory = [
  { id: 1, itemId: 1, type: 'out' as const, quantity: 50, date: '2024-01-20', user: 'Jean Dupont', notes: 'Semis parcelle nord' },
  { id: 2, itemId: 2, type: 'out' as const, quantity: 200, date: '2024-01-18', user: 'Jean Dupont', notes: 'Épandage parcelle est' },
  { id: 3, itemId: 4, type: 'in' as const, quantity: 500, date: '2024-01-15', user: 'Marie Martin', notes: 'Livraison mensuelle' },
  { id: 4, itemId: 3, type: 'out' as const, quantity: 5, date: '2024-01-14', user: 'Jean Dupont', notes: 'Traitement parcelle sud' },
  { id: 5, itemId: 1, type: 'in' as const, quantity: 200, date: '2024-01-10', user: 'Marie Martin', notes: 'Complément stock' },
];

interface EnhancedInventoryProps {
  dateRange?: DateRange;
  searchTerm?: string;
}

const EnhancedInventory: React.FC<EnhancedInventoryProps> = ({ 
  dateRange, 
  searchTerm: externalSearchTerm 
}) => {
  // States
  const [view, setView] = useState<'list' | 'grid' | 'stats'>('grid');
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(initialInventoryData);
  const [transactionHistory, setTransactionHistory] = useState(initialTransactionHistory);
  const [searchTerm, setSearchTerm] = useState(externalSearchTerm || '');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showTransactionForm, setShowTransactionForm] = useState<{item: InventoryItem, type: 'in' | 'out'} | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minQuantity: 0,
    price: 0,
    location: '',
    supplier: '',
    sku: '',
    notes: ''
  });

  // Sync external search term
  useEffect(() => {
    if (externalSearchTerm !== undefined) {
      setSearchTerm(externalSearchTerm);
    }
  }, [externalSearchTerm]);

  // Computed values
  const categories = ['all', ...new Set(inventoryData.map(item => item.category))];
  
  const filteredItems = inventoryData
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase()));
      
      if (categoryFilter === 'all') return matchesSearch;
      return matchesSearch && item.category === categoryFilter;
    })
    .sort((a, b) => {
      let aValue: any = a[sortBy as keyof InventoryItem];
      let bValue: any = b[sortBy as keyof InventoryItem];
      
      if (sortBy === 'lastUpdated') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }
      
      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });

  const alerts = inventoryData
    .filter(item => item.quantity <= item.minQuantity)
    .map(item => ({
      id: item.id,
      name: item.name,
      current: item.quantity,
      min: item.minQuantity,
      status: item.quantity < item.minQuantity * 0.5 ? 'critical' as const : 'warning' as const
    }));

  const totalValue = inventoryData.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const lowStockCount = alerts.length;

  const categoryStats = Array.from(
    inventoryData.reduce((acc, item) => {
      const existing = acc.get(item.category) || { name: item.category, value: 0, fill: getRandomColor() };
      existing.value += item.quantity;
      acc.set(item.category, existing);
      return acc;
    }, new Map())
  ).map(([_, stats]) => stats);

  // Handlers
  const handleAddItem = () => {
    if (!newItem.name || !newItem.category || !newItem.unit) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const newId = Math.max(...inventoryData.map(item => item.id), 0) + 1;
    const itemToAdd: InventoryItem = {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      quantity: newItem.quantity || 0,
      unit: newItem.unit,
      minQuantity: newItem.minQuantity || 0,
      price: newItem.price || 0,
      location: newItem.location || '',
      lastUpdated: new Date().toISOString().split('T')[0],
      supplier: newItem.supplier,
      sku: newItem.sku,
      expiryDate: newItem.expiryDate,
      notes: newItem.notes
    };

    setInventoryData([...inventoryData, itemToAdd]);
    setShowAddForm(false);
    setNewItem({
      name: '', category: '', quantity: 0, unit: '', minQuantity: 0, 
      price: 0, location: '', supplier: '', sku: '', notes: ''
    });
    toast.success(`${itemToAdd.name} ajouté avec succès`);
  };

  const handleUpdateItem = (updates: Partial<InventoryItem>) => {
    if (!selectedItem) return;
    
    const updatedItem = { ...selectedItem, ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
    setInventoryData(inventoryData.map(item => 
      item.id === selectedItem.id ? updatedItem : item
    ));
    setSelectedItem(updatedItem);
    toast.success("Article mis à jour avec succès");
  };

  const handleDeleteItem = (id: number) => {
    setItemToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteItem = () => {
    if (itemToDelete === null) return;
    
    const item = inventoryData.find(i => i.id === itemToDelete);
    setInventoryData(inventoryData.filter(i => i.id !== itemToDelete));
    setShowDeleteConfirm(false);
    setItemToDelete(null);
    
    if (selectedItem?.id === itemToDelete) {
      setSelectedItem(null);
    }
    
    toast.success(`${item?.name} supprimé avec succès`);
  };

  const handleTransaction = (item: InventoryItem, type: 'in' | 'out') => {
    setShowTransactionForm({ item, type });
  };

  const handleTransactionSubmit = (type: 'in' | 'out', quantity: number, notes: string) => {
    if (!showTransactionForm) return;
    
    const { item } = showTransactionForm;
    const newId = Math.max(...transactionHistory.map(t => t.id), 0) + 1;
    
    const transaction = {
      id: newId,
      itemId: item.id,
      type,
      quantity,
      date: new Date().toISOString().split('T')[0],
      user: 'Utilisateur actuel',
      notes
    };
    
    setTransactionHistory([transaction, ...transactionHistory]);
    
    const newQuantity = type === 'in' 
      ? item.quantity + quantity 
      : Math.max(0, item.quantity - quantity);
    
    const updatedItem = { ...item, quantity: newQuantity, lastUpdated: new Date().toISOString().split('T')[0] };
    setInventoryData(inventoryData.map(i => i.id === item.id ? updatedItem : i));
    
    if (selectedItem?.id === item.id) {
      setSelectedItem(updatedItem);
    }
    
    setShowTransactionForm(null);
    toast.success(`Transaction ${type === 'in' ? 'entrée' : 'sortie'} enregistrée`);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    importInventoryFromCSV(file, (importedData) => {
      const existingIds = new Set(inventoryData.map(item => item.id));
      const newItems = importedData.filter(item => !existingIds.has(item.id));
      const updatedItems = importedData.filter(item => existingIds.has(item.id));
      
      const updatedInventory = inventoryData.map(item => {
        const updatedItem = updatedItems.find(update => update.id === item.id);
        return updatedItem || item;
      });
      
      setInventoryData([...updatedInventory, ...newItems]);
      toast.success(`${newItems.length} nouveaux articles importés, ${updatedItems.length} articles mis à jour`);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleExport = () => {
    exportInventoryToCSV(inventoryData, {
      fileName: `inventaire_${new Date().toISOString().split('T')[0]}.csv`,
      addTimestamp: true
    });
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  const hasActiveFilters = searchTerm !== '' || categoryFilter !== 'all' || sortBy !== 'name' || sortOrder !== 'asc';

  function getRandomColor() {
    const colors = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6', '#f97316', '#06b6d4', '#84cc16'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <InventoryHeader
        view={view}
        onViewChange={setView}
        onAddItem={() => setShowAddForm(true)}
        onImport={handleImport}
        onExport={handleExport}
        totalItems={inventoryData.length}
        lowStockCount={lowStockCount}
        totalValue={totalValue}
      />

      {/* Search and Filters */}
      <InventorySearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        categories={categories}
        onClearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="p-4 border-b">
          <InventoryAlerts
            alerts={alerts}
            onQuantityChange={(id, field, value) => {
              const item = inventoryData.find(i => i.id === id);
              if (item) {
                handleUpdateItem({ [field]: value });
              }
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {view === 'stats' ? (
          <div className="p-4">
            <InventoryStats
              inventoryData={inventoryData}
              categoryStats={categoryStats}
            />
          </div>
        ) : view === 'grid' ? (
          <InventoryGrid
            items={filteredItems}
            onItemSelect={setSelectedItem}
            onItemEdit={setSelectedItem}
            onItemDelete={handleDeleteItem}
            onTransaction={handleTransaction}
          />
        ) : (
          <div className="p-4">
            <InventoryList
              items={filteredItems}
              onItemSelect={setSelectedItem}
              onItemEdit={setSelectedItem}
              onItemDelete={handleDeleteItem}
              onTransaction={handleTransaction}
              onSort={handleSort}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedItem && (
        <InventoryDetailPanel
          item={selectedItem}
          transactions={transactionHistory}
          onClose={() => setSelectedItem(null)}
          onUpdate={handleUpdateItem}
          onDelete={() => handleDeleteItem(selectedItem.id)}
          onTransaction={handleTransactionSubmit}
        />
      )}

      {/* Add Item Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouvel article</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div>
              <Label htmlFor="name">Nom de l'article *</Label>
              <Input
                id="name"
                value={newItem.name || ''}
                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                placeholder="Ex: Semences de blé"
              />
            </div>
            <div>
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={newItem.category || ''} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                  <SelectItem value="Nouvelle catégorie">+ Nouvelle catégorie</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quantity">Quantité initiale *</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity || 0}
                onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="unit">Unité *</Label>
              <Input
                id="unit"
                value={newItem.unit || ''}
                onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                placeholder="Ex: kg, L, unité"
              />
            </div>
            <div>
              <Label htmlFor="minQuantity">Seuil minimal</Label>
              <Input
                id="minQuantity"
                type="number"
                value={newItem.minQuantity || 0}
                onChange={(e) => setNewItem({...newItem, minQuantity: Number(e.target.value)})}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="price">Prix unitaire (FCFA)</Label>
              <Input
                id="price"
                type="number"
                value={newItem.price || 0}
                onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                min={0}
                step="0.01"
              />
            </div>
            <div>
              <Label htmlFor="location">Emplacement</Label>
              <Input
                id="location"
                value={newItem.location || ''}
                onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                placeholder="Ex: Hangar principal"
              />
            </div>
            <div>
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input
                id="supplier"
                value={newItem.supplier || ''}
                onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                placeholder="Ex: Agro-Services SARL"
              />
            </div>
            <div>
              <Label htmlFor="sku">Référence (SKU)</Label>
              <Input
                id="sku"
                value={newItem.sku || ''}
                onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                placeholder="Ex: SEM-BLE-001"
              />
            </div>
            <div>
              <Label htmlFor="expiryDate">Date d'expiration</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newItem.expiryDate || ''}
                onChange={(e) => setNewItem({...newItem, expiryDate: e.target.value})}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newItem.notes || ''}
                onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                placeholder="Informations complémentaires..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter l'article
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Supprimer l'article"
        description="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        onConfirm={confirmDeleteItem}
        onOpenChange={setShowDeleteConfirm}
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        className="hidden"
      />
    </div>
  );
};

export default EnhancedInventory;