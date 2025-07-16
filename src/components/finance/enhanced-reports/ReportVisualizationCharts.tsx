
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Target } from 'lucide-react';

interface ReportVisualizationChartsProps {
  financialData: any;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export const ReportVisualizationCharts: React.FC<ReportVisualizationChartsProps> = ({ financialData }) => {
  const monthlyEvolution = [
    { month: 'Jan', revenus: 15000, depenses: 12000, benefice: 3000 },
    { month: 'Fév', revenus: 18500, depenses: 13500, benefice: 5000 },
    { month: 'Mar', revenus: 22000, depenses: 14000, benefice: 8000 },
    { month: 'Avr', revenus: 19500, depenses: 15500, benefice: 4000 },
    { month: 'Mai', revenus: 25000, depenses: 16000, benefice: 9000 },
    { month: 'Jun', revenus: 28000, depenses: 17500, benefice: 10500 }
  ];

  const categoryBreakdown = [
    { name: 'Ventes récoltes', value: 45860, percentage: 64 },
    { name: 'Subventions PAC', value: 18500, percentage: 26 },
    { name: 'Autres revenus', value: 7250, percentage: 10 }
  ];

  const expenseCategories = [
    { category: 'Intrants', montant: 12750, pourcentage: 25, tendance: 'hausse' },
    { category: 'Matériel', montant: 23600, pourcentage: 46, tendance: 'baisse' },
    { category: 'Main d\'œuvre', montant: 15320, pourcentage: 29, tendance: 'hausse' }
  ];

  const profitabilityTrend = [
    { periode: 'T1', marge: 18.5, roi: 22.3, ebitda: 32.1 },
    { periode: 'T2', marge: 22.1, roi: 25.7, ebitda: 35.8 },
    { periode: 'T3', marge: 19.8, roi: 24.2, ebitda: 33.5 },
    { periode: 'T4', marge: 27.8, roi: 28.9, ebitda: 38.2 }
  ];

  return (
    <div className="space-y-6">
      {/* Évolution mensuelle */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            Évolution Mensuelle des Performances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyEvolution}>
                <defs>
                  <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}€`, '']} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenus)"
                  name="Revenus" 
                />
                <Area 
                  type="monotone" 
                  dataKey="depenses" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorDepenses)"
                  name="Dépenses" 
                />
                <Line 
                  type="monotone" 
                  dataKey="benefice" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="Bénéfice Net" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des revenus */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <DollarSign className="h-5 w-5" />
              Répartition des Sources de Revenus
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}€`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {categoryBreakdown.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span>{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value.toLocaleString()}€</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analyse des dépenses */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Target className="h-5 w-5" />
              Analyse Détaillée des Dépenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={expenseCategories} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={80} />
                  <Tooltip formatter={(value) => [`${value}€`, 'Montant']} />
                  <Bar dataKey="montant" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-3">
              {expenseCategories.map((expense) => (
                <div key={expense.category} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{expense.category}</span>
                    <span className="text-sm text-gray-600">({expense.pourcentage}%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{expense.montant.toLocaleString()}€</span>
                    {expense.tendance === 'hausse' ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicateurs de rentabilité */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Target className="h-5 w-5" />
            Évolution des Indicateurs de Rentabilité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profitabilityTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, '']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="marge" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="Marge Bénéficiaire (%)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="roi" 
                  stroke="#06b6d4" 
                  strokeWidth={2}
                  name="ROI (%)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="ebitda" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="EBITDA (%)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
