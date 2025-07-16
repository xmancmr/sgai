
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { 
  Download, 
  Upload, 
  FileText, 
  Settings, 
  Calculator, 
  TrendingUp, 
  Target,
  Plus,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface FinancialActionsProps {
  onExportData: () => void;
  onImportData: () => void;
  onGenerateReport: () => void;
  onCalculateBudget: () => void;
}

export const FinancialActions: React.FC<FinancialActionsProps> = ({
  onExportData,
  onImportData,
  onGenerateReport,
  onCalculateBudget
}) => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: '',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleExport = () => {
    // Simuler l'export de données
    const data = {
      revenus: [
        { source: 'Céréales', montant: 28500, date: '2024-06-01' },
        { source: 'Légumes', montant: 18200, date: '2024-06-01' },
        { source: 'Fruits', montant: 15800, date: '2024-06-01' },
        { source: 'Subventions', montant: 9110, date: '2024-06-01' }
      ],
      depenses: [
        { categorie: 'Semences & Intrants', montant: 15200, date: '2024-06-01' },
        { categorie: 'Carburant & Énergie', montant: 12800, date: '2024-06-01' },
        { categorie: 'Main d\'œuvre', montant: 11900, date: '2024-06-01' }
      ]
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `donnees-financieres-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success("Données exportées avec succès !");
    onExportData();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.csv,.xlsx';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            console.log('Données importées:', data);
            toast.success(`Fichier "${file.name}" importé avec succès !`);
            onImportData();
          } catch (error) {
            toast.error("Erreur lors de l'import du fichier");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleGenerateReport = () => {
    toast.loading("Génération du rapport en cours...");
    
    setTimeout(() => {
      toast.success("Rapport financier généré avec succès !");
      onGenerateReport();
    }, 2000);
  };

  const handleCalculateBudget = () => {
    toast.loading("Calcul du budget prévisionnel...");
    
    setTimeout(() => {
      toast.success("Budget calculé et optimisé !");
      onCalculateBudget();
    }, 1500);
  };

  const handleAddTransaction = () => {
    if (!newTransaction.type || !newTransaction.category || !newTransaction.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    console.log('Nouvelle transaction:', newTransaction);
    toast.success(`Transaction de ${newTransaction.amount}€ ajoutée avec succès !`);
    
    setNewTransaction({
      type: '',
      category: '',
      amount: '',
      description: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsAddingTransaction(false);
  };

  return (
    <div className="space-y-6">
      {/* Actions principales */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Settings className="h-5 w-5" />
            Actions Financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              onClick={handleExport}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
            
            <Button 
              onClick={handleImport}
              variant="outline"
              className="border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Importer
            </Button>
            
            <Button 
              onClick={handleGenerateReport}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Rapport
            </Button>
            
            <Button 
              onClick={handleCalculateBudget}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Budget
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Ajout de transaction */}
      <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Plus className="h-5 w-5" />
            Gestion des Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
              <DialogTrigger asChild>
                <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nouvelle Transaction
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-orange-800">
                    <Plus className="h-5 w-5" />
                    Ajouter une Transaction
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Type *</Label>
                      <Select value={newTransaction.type} onValueChange={(value) => 
                        setNewTransaction(prev => ({ ...prev, type: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenus">Revenus</SelectItem>
                          <SelectItem value="depenses">Dépenses</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="category">Catégorie *</Label>
                      <Select value={newTransaction.category} onValueChange={(value) => 
                        setNewTransaction(prev => ({ ...prev, category: value }))
                      }>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir..." />
                        </SelectTrigger>
                        <SelectContent>
                          {newTransaction.type === 'revenus' ? (
                            <>
                              <SelectItem value="cereales">Céréales</SelectItem>
                              <SelectItem value="legumes">Légumes</SelectItem>
                              <SelectItem value="fruits">Fruits</SelectItem>
                              <SelectItem value="subventions">Subventions</SelectItem>
                            </>
                          ) : (
                            <>
                              <SelectItem value="intrants">Semences & Intrants</SelectItem>
                              <SelectItem value="energie">Carburant & Énergie</SelectItem>
                              <SelectItem value="maindoeuvre">Main d'œuvre</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="amount">Montant (€) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={newTransaction.amount}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={newTransaction.date}
                        onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description optionnelle..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddingTransaction(false)}
                    >
                      Annuler
                    </Button>
                    <Button 
                      onClick={handleAddTransaction}
                      className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline"
              className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-2"
              onClick={() => toast.success("Analyse des tendances mise à jour !")}
            >
              <TrendingUp className="h-4 w-4" />
              Analyser Tendances
            </Button>
            
            <Button 
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 flex items-center gap-2"
              onClick={() => toast.success("Objectifs financiers recalculés !")}
            >
              <Target className="h-4 w-4" />
              Définir Objectifs
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alertes et notifications */}
      <Card className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            Alertes Financières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-orange-500">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-gray-800">Dépassement budget carburant</p>
                  <p className="text-sm text-gray-600">+22% par rapport au mois dernier</p>
                </div>
              </div>
              <Badge className="bg-orange-100 text-orange-800">Action requise</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-gray-800">Objectif revenus atteint</p>
                  <p className="text-sm text-gray-600">118% de l'objectif mensuel</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800">Excellent</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
