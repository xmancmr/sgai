import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InventoryItem } from './ImportExportFunctions';
import { 
  ArrowLeft, 
  Edit, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Trash2,
  Package,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  History
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface Transaction {
  id: number;
  itemId: number;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  user: string;
  notes: string;
}

interface InventoryDetailPanelProps {
  item: InventoryItem;
  transactions: Transaction[];
  onClose: () => void;
  onUpdate: (updates: Partial<InventoryItem>) => void;
  onDelete: () => void;
  onTransaction: (type: 'in' | 'out', quantity: number, notes: string) => void;
}

const InventoryDetailPanel: React.FC<InventoryDetailPanelProps> = ({
  item,
  transactions,
  onClose,
  onUpdate,
  onDelete,
  onTransaction
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [showTransactionForm, setShowTransactionForm] = useState<'in' | 'out' | null>(null);
  const [transactionQuantity, setTransactionQuantity] = useState(0);
  const [transactionNotes, setTransactionNotes] = useState('');

  const handleSave = () => {
    onUpdate(editedItem);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedItem(item);
    setIsEditing(false);
  };

  const handleTransaction = () => {
    if (showTransactionForm && transactionQuantity > 0) {
      onTransaction(showTransactionForm, transactionQuantity, transactionNotes);
      setShowTransactionForm(null);
      setTransactionQuantity(0);
      setTransactionNotes('');
    }
  };

  const getStockStatus = () => {
    if (item.quantity <= 0) return { status: 'Rupture', color: 'destructive' };
    if (item.quantity < item.minQuantity * 0.5) return { status: 'Critique', color: 'destructive' };
    if (item.quantity <= item.minQuantity) return { status: 'Faible', color: 'secondary' };
    return { status: 'Normal', color: 'default' };
  };

  const stockStatus = getStockStatus();
  const totalValue = item.quantity * item.price;
  const stockPercentage = item.minQuantity > 0 ? Math.min(100, (item.quantity / (item.minQuantity * 2)) * 100) : 100;

  // Données pour les graphiques
  const stockData = [
    { name: 'Stock actuel', value: item.quantity, fill: '#10b981' },
    { name: 'Seuil minimal', value: item.minQuantity, fill: '#f59e0b' }
  ];

  const recentTransactions = transactions
    .filter(t => t.itemId === item.id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  const transactionHistory = recentTransactions.map((t, index) => ({
    date: new Date(t.date).toLocaleDateString(),
    quantity: t.type === 'in' ? t.quantity : -t.quantity,
    type: t.type
  }));

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 overflow-auto">
      <div className="min-h-full flex items-start justify-center p-4">
        <div className="w-full max-w-4xl bg-background border rounded-lg shadow-lg my-8">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                </div>
              </div>
              <Badge variant={stockStatus.color as any}>
                {stockStatus.status}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTransactionForm('in')}
                  >
                    <ArrowDown className="h-4 w-4 mr-2" />
                    Entrée
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowTransactionForm('out')}
                  >
                    <ArrowUp className="h-4 w-4 mr-2" />
                    Sortie
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Supprimer
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Transaction Form */}
          {showTransactionForm && (
            <div className="p-6 border-b bg-muted/30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">
                  {showTransactionForm === 'in' ? 'Entrée de stock' : 'Sortie de stock'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTransactionForm(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="transaction-quantity">Quantité</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="transaction-quantity"
                      type="number"
                      value={transactionQuantity}
                      onChange={(e) => setTransactionQuantity(Number(e.target.value))}
                      min={0}
                    />
                    <span className="text-sm text-muted-foreground">{item.unit}</span>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="transaction-notes">Notes</Label>
                  <Input
                    id="transaction-notes"
                    value={transactionNotes}
                    onChange={(e) => setTransactionNotes(e.target.value)}
                    placeholder="Commentaire sur la transaction..."
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button onClick={handleTransaction} disabled={transactionQuantity <= 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer la transaction
                </Button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations principales */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Informations générales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Nom de l'article</Label>
                          <Input
                            id="name"
                            value={editedItem.name}
                            onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="category">Catégorie</Label>
                          <Input
                            id="category"
                            value={editedItem.category}
                            onChange={(e) => setEditedItem({...editedItem, category: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantité</Label>
                          <div className="flex gap-2 mt-1">
                            <Input
                              id="quantity"
                              type="number"
                              value={editedItem.quantity}
                              onChange={(e) => setEditedItem({...editedItem, quantity: Number(e.target.value)})}
                            />
                            <Input
                              value={editedItem.unit}
                              onChange={(e) => setEditedItem({...editedItem, unit: e.target.value})}
                              className="w-20"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="minQuantity">Seuil minimal</Label>
                          <Input
                            id="minQuantity"
                            type="number"
                            value={editedItem.minQuantity}
                            onChange={(e) => setEditedItem({...editedItem, minQuantity: Number(e.target.value)})}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="price">Prix unitaire (FCFA)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editedItem.price}
                            onChange={(e) => setEditedItem({...editedItem, price: Number(e.target.value)})}
                            className="mt-1"
                            step="0.01"
                          />
                        </div>
                        <div>
                          <Label htmlFor="location">Emplacement</Label>
                          <Input
                            id="location"
                            value={editedItem.location}
                            onChange={(e) => setEditedItem({...editedItem, location: e.target.value})}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Quantité:</span>
                          <span className="font-semibold">{item.quantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Seuil minimal:</span>
                          <span className="font-semibold">{item.minQuantity} {item.unit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Prix unitaire:</span>
                          <span className="font-semibold">{item.price.toFixed(2)} FCFA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Valeur totale:</span>
                          <span className="font-semibold">{totalValue.toFixed(2)} FCFA</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Emplacement:</span>
                          <span className="font-semibold">{item.location || 'Non spécifié'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Dernière MAJ:</span>
                          <span className="font-semibold">{new Date(item.lastUpdated).toLocaleDateString()}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Historique des transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <History className="h-5 w-5" />
                      Historique des transactions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentTransactions.length > 0 ? (
                      <div className="space-y-2">
                        {recentTransactions.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-full ${
                                transaction.type === 'in' 
                                  ? 'bg-emerald-100 text-emerald-600' 
                                  : 'bg-amber-100 text-amber-600'
                              }`}>
                                {transaction.type === 'in' ? (
                                  <ArrowDown className="h-4 w-4" />
                                ) : (
                                  <ArrowUp className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {transaction.type === 'in' ? 'Entrée' : 'Sortie'} - {transaction.quantity} {item.unit}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(transaction.date).toLocaleDateString()} • {transaction.user}
                                </p>
                                {transaction.notes && (
                                  <p className="text-sm text-muted-foreground italic">
                                    {transaction.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Aucune transaction enregistrée
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Statistiques */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Niveau de stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Progression</span>
                        <span className="font-semibold">{stockPercentage.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            stockStatus.status === 'Critique' ? 'bg-destructive' :
                            stockStatus.status === 'Faible' ? 'bg-yellow-500' :
                            'bg-emerald-500'
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantity} / {item.minQuantity * 2} (optimal)
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Comparaison stock</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stockData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {transactionHistory.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Évolution récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={transactionHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="quantity" 
                              stroke="#10b981" 
                              strokeWidth={2}
                              dot={{ fill: '#10b981' }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryDetailPanel;