import React from 'react';
import { motion } from 'framer-motion';
import { EditableField } from '../ui/editable-field';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from '../ui/input';
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { CalendarIcon, PlusCircle, Download, Printer, Trash2, FileText } from 'lucide-react';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const TransactionsList = (props: {
  transactions: any[];
  filteredTransactions: any[];
  categories: string[];
  typeFilter: string;
  categoryFilter: string;
  sortBy: string;
  sortOrder: string;
  setTypeFilter: (val: string) => void;
  setCategoryFilter: (val: string) => void;
  setSortBy: (val: string) => void;
  setSortOrder: (val: "asc" | "desc") => void;
  exportToCSV: () => void;
  printTransactions: () => void;
  showAddDialog: boolean;
  setShowAddDialog: (b: boolean) => void;
  handleDeleteTransaction: (id: number) => void;
  handleUpdateTransaction: (id: number, field: string, value: any) => void;
  form: any;
  onSubmit: (data: any) => void;
}) => {

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.14 }}
      className="w-full"
    >
      {/* Add Transaction Dialog + Transactions Table & Controls from original component */}
      {/* ... keep all code for Add Transaction Dialog and filtered transactions here as in FinancialTracking.tsx ... */}
      {/* (Copy code for the Dialog/Form, filter/select controls, list rendering, and transaction deletion/edit, unchanged except wrapper className) */}
      {/* All sub-codes from the second Card "Transactions Récentes" of FinancialTracking */}
      <Card className="bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions Récentes</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={props.exportToCSV}
            >
              <Download className="h-4 w-4 mr-1" />
              Exporter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={props.printTransactions}
            >
              <Printer className="h-4 w-4 mr-1" />
              Imprimer
            </Button>
            <Button
              onClick={() => props.setShowAddDialog(true)}
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <select
              className="px-3 py-1 border rounded-md text-sm"
              value={props.typeFilter}
              onChange={(e) => props.setTypeFilter(e.target.value)}
            >
              <option value="all">Tous types</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>

            <select
              className="px-3 py-1 border rounded-md text-sm"
              value={props.categoryFilter}
              onChange={(e) => props.setCategoryFilter(e.target.value)}
            >
              {props.categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Toutes catégories' : cat}
                </option>
              ))}
            </select>

            <select
              className="px-3 py-1 border rounded-md text-sm ml-auto"
              value={`${props.sortBy}-${props.sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                props.setSortBy(field);
                props.setSortOrder(order as 'asc' | 'desc');
              }}
            >
              <option value="date-desc">Date (récent)</option>
              <option value="date-asc">Date (ancien)</option>
              <option value="amount-desc">Montant (haut)</option>
              <option value="amount-asc">Montant (bas)</option>
            </select>
          </div>

          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
            {props.filteredTransactions.length > 0 ? (
              props.filteredTransactions.map(transaction => (
                <div key={transaction.id} className="border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                    transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  }`}>
                    <FileText className="h-4 w-4" />
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <EditableField
                        value={new Date(transaction.date).toLocaleDateString()}
                        type="date"
                        onSave={(value) => props.handleUpdateTransaction(
                          transaction.id,
                          'date',
                          typeof value === 'string' ? value : new Date(value).toISOString().split('T')[0]
                        )}
                        className="text-sm font-medium"
                      />
                      <span className="hidden sm:inline text-muted-foreground">•</span>
                      <EditableField
                        value={transaction.category}
                        onSave={(value) => props.handleUpdateTransaction(transaction.id, 'category', value)}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      />
                    </div>
                    <EditableField
                      value={transaction.description}
                      onSave={(value) => props.handleUpdateTransaction(transaction.id, 'description', value)}
                      className="text-muted-foreground text-sm mt-1"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <EditableField
                      value={transaction.amount}
                      type="number"
                      onSave={(value) => props.handleUpdateTransaction(transaction.id, 'amount', value)}
                      className={`font-semibold ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1"
                      onClick={() => props.handleDeleteTransaction(transaction.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">Aucune transaction trouvée</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <Dialog open={props.showAddDialog} onOpenChange={props.setShowAddDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Ajouter une transaction</DialogTitle>
          </DialogHeader>

          <Form {...props.form}>
            <form onSubmit={props.form.handleSubmit(props.onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={props.form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Type de transaction</FormLabel>
                      <div className="flex mt-1">
                        <Button
                          type="button"
                          variant={field.value === 'income' ? 'default' : 'outline'}
                          className={field.value === 'income' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => field.onChange('income')}
                        >
                          Revenu
                        </Button>
                        <Button
                          type="button"
                          variant={field.value === 'expense' ? 'default' : 'outline'}
                          className={`ml-2 ${field.value === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                          onClick={() => field.onChange('expense')}
                        >
                          Dépense
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={props.form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="date"
                            {...field}
                          />
                          <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={props.form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Montant (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={props.form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Catégorie</FormLabel>
                      <FormControl>
                        <Input placeholder="Exemple: Ventes, Fournitures..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={props.form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => props.setShowAddDialog(false)}
                >
                  Annuler
                </Button>
                <Button type="submit">Ajouter</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
};

export default TransactionsList;
