import React, { useState } from 'react';
import PageHeader from './layout/PageHeader';
import { FinancialSummaryCards } from './finance/FinancialSummaryCards';
import { MonthlyOverviewChart } from './finance/MonthlyOverviewChart';
import TransactionsList from './finance/TransactionsList';
import FinancialReportsGenerator from './finance/FinancialReportsGenerator';
import EnhancedBudgetManagement from './finance/EnhancedBudgetManagement';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusCircle, Download, Printer, Trash2, FileText } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { EditableField } from './ui/editable-field';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Define monthly data
const monthlyData = [
  { name: 'Jan', income: 8500, expenses: 7200 },
  { name: 'Fév', income: 9200, expenses: 7800 },
  { name: 'Mar', income: 8800, expenses: 7400 },
  { name: 'Avr', income: 10500, expenses: 8100 },
  { name: 'Mai', income: 11200, expenses: 9500 },
  { name: 'Juin', income: 9800, expenses: 7900 },
  { name: 'Juil', income: 12500, expenses: 10200 },
];

// Schema for transaction form
const transactionSchema = z.object({
  date: z.string().min(1, "La date est requise"),
  description: z.string().min(3, "Description trop courte"),
  amount: z.string().refine(val => !isNaN(Number(val)) && Number(val) !== 0, {
    message: "Montant invalide"
  }),
  category: z.string().min(1, "La catégorie est requise"),
  type: z.enum(["income", "expense"]),
});

const FinancialTracking = () => {
  // State for editable content
  const [title, setTitle] = useState('Suivi Financier');
  const [description, setDescription] = useState('Gérez vos revenus et dépenses pour optimiser la rentabilité de votre exploitation');
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for transactions
  const [transactions, setTransactions] = useState([
    { id: 1, date: '2023-07-05', description: 'Vente de récolte', amount: 3200, category: 'Ventes', type: 'income' },
    { id: 2, date: '2023-07-10', description: 'Achat d\'engrais', amount: 850, category: 'Fournitures', type: 'expense' },
    { id: 3, date: '2023-07-12', description: 'Facture d\'électricité', amount: 320, category: 'Utilities', type: 'expense' },
    { id: 4, date: '2023-07-15', description: 'Vente de bananes', amount: 1500, category: 'Ventes', type: 'income' },
    { id: 5, date: '2023-07-20', description: 'Réparation tracteur', amount: 750, category: 'Maintenance', type: 'expense' },
    { id: 6, date: '2023-07-25', description: 'Subvention agricole', amount: 4200, category: 'Subventions', type: 'income' },
    { id: 7, date: '2023-07-28', description: 'Salaires employés', amount: 2800, category: 'Salaires', type: 'expense' },
  ]);
  
  // Filter and stats
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  
  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  // Form handling with react-hook-form
  const form = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      description: "",
      amount: "",
      category: "",
      type: "income" as "income" | "expense",
    },
  });
  
  // Categories for filtering
  const categories = ['all', ...new Set(transactions.map(t => t.category))];
  
  // Calculate totals
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const balance = totalIncome - totalExpenses;
  
  // Filter transactions based on selected filters
  const filteredTransactions = transactions
    .filter(t => {
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      return matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'asc' 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === 'amount') {
        return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      return 0;
    });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof transactionSchema>) => {
    const newTransaction = {
      id: Math.max(...transactions.map(t => t.id), 0) + 1,
      date: data.date,
      description: data.description,
      amount: parseFloat(data.amount),
      category: data.category,
      type: data.type
    };
    
    setTransactions([newTransaction, ...transactions]);
    setShowAddDialog(false);
    form.reset();
    
    toast.success('Transaction ajoutée avec succès');
  };
  
  // Handle delete transaction
  const handleDeleteTransaction = (id: number) => {
    setTransactions(transactions.filter(t => t.id !== id));
    toast.success('Transaction supprimée');
  };
  
  // Handle edit transaction
  const handleUpdateTransaction = (id: number, field: string, value: any) => {
    setTransactions(transactions.map(t => 
      t.id === id ? { ...t, [field]: field === 'amount' ? parseFloat(value) : value } : t
    ));
    toast.success('Transaction mise à jour');
  };
  
  // Export to CSV
  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Date', 'Description', 'Montant', 'Catégorie', 'Type'];
    const rows = transactions.map(t => [
      t.date, 
      t.description, 
      t.amount.toString(), 
      t.category, 
      t.type === 'income' ? 'Revenu' : 'Dépense'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Données exportées en CSV');
  };
  
  // Print transactions
  const printTransactions = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Impossible d\'ouvrir la fenêtre d\'impression');
      return;
    }
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Transactions Financières</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #f2f2f2; }
            .income { color: green; }
            .expense { color: red; }
            h2 { margin-bottom: 5px; }
            .summary { margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Transactions Financières</h1>
          <div class="summary">
            <p>Revenus totaux: <b>${totalIncome.toFixed(2)} €</b></p>
            <p>Dépenses totales: <b>${totalExpenses.toFixed(2)} €</b></p>
            <p>Solde: <b class="${balance >= 0 ? 'income' : 'expense'}">${balance.toFixed(2)} €</b></p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Montant</th>
                <th>Catégorie</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              ${transactions.map(t => `
                <tr>
                  <td>${new Date(t.date).toLocaleDateString()}</td>
                  <td>${t.description}</td>
                  <td class="${t.type === 'income' ? 'income' : 'expense'}">${t.amount.toFixed(2)} €</td>
                  <td>${t.category}</td>
                  <td>${t.type === 'income' ? 'Revenu' : 'Dépense'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    toast.success('Impression préparée');
  };
  
  return (
    <div className="space-y-8 max-w-6xl mx-auto px-2">
      <PageHeader 
        title={title}
        description={description}
        onTitleChange={(value) => {
          setTitle(String(value));
          toast.success('Titre mis à jour');
        }}
        onDescriptionChange={(value) => {
          setDescription(String(value));
          toast.success('Description mise à jour');
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="budget">Gestion Budgétaire</TabsTrigger>
          <TabsTrigger value="reports">Rapports Financiers</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <FinancialSummaryCards 
            totalIncome={totalIncome} 
            totalExpenses={totalExpenses} 
            balance={balance} 
          />
          <MonthlyOverviewChart 
            monthlyData={monthlyData}
          />
        </TabsContent>

        <TabsContent value="budget">
          <EnhancedBudgetManagement />
        </TabsContent>

        <TabsContent value="reports">
          <FinancialReportsGenerator />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionsList
            transactions={transactions}
            filteredTransactions={filteredTransactions}
            categories={categories}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            sortBy={sortBy}
            sortOrder={sortOrder}
            setTypeFilter={setTypeFilter}
            setCategoryFilter={setCategoryFilter}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            exportToCSV={exportToCSV}
            printTransactions={printTransactions}
            showAddDialog={showAddDialog}
            setShowAddDialog={setShowAddDialog}
            handleDeleteTransaction={handleDeleteTransaction}
            handleUpdateTransaction={handleUpdateTransaction}
            form={form}
            onSubmit={onSubmit}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialTracking;
