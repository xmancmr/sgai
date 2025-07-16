
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { TrendingUp, Sprout, AlertCircle, CheckCircle } from 'lucide-react';
import { formatFCFA } from '@/utils/currency';

export const FinancialOverviewCharts: React.FC = () => {
  const monthlyData = [
    { month: 'Jan', revenus: 9840000, depenses: 7872000, benefice: 1968000, recoltes: 5576000, productivite: 85 },
    { month: 'Fév', revenus: 12136000, depenses: 8854000, benefice: 3280000, recoltes: 7872000, productivite: 88 },
    { month: 'Mar', revenus: 14432000, depenses: 9184000, benefice: 5248000, recoltes: 12136000, productivite: 92 },
    { month: 'Avr', revenus: 12792000, depenses: 10168000, benefice: 2624000, recoltes: 9971200, productivite: 87 },
    { month: 'Mai', revenus: 16400000, depenses: 10496000, benefice: 5904000, recoltes: 14956800, productivite: 95 },
    { month: 'Jun', revenus: 18368000, depenses: 11480000, benefice: 6888000, recoltes: 17318400, productivite: 98 }
  ];

  const categoryData = [
    { category: 'Céréales', revenus: 18698000, croissance: 12.5, couleur: '#10b981', rendement: '2.8 t/ha' },
    { category: 'Légumes', revenus: 11931600, croissance: 8.3, couleur: '#059669', rendement: '15.2 t/ha' },
    { category: 'Fruits', revenus: 10364400, croissance: -2.1, couleur: '#047857', rendement: '12.8 t/ha' },
    { category: 'Subventions', revenus: 5974520, croissance: 15.7, couleur: '#065f46', rendement: 'N/A' }
  ];

  const productivityTrend = [
    { mois: 'Jan', efficacite: 78, qualite: 82, rendement: 75 },
    { mois: 'Fév', efficacite: 81, qualite: 85, rendement: 79 },
    { mois: 'Mar', efficacite: 85, qualite: 88, rendement: 83 },
    { mois: 'Avr', efficacite: 83, qualite: 86, rendement: 81 },
    { mois: 'Mai', efficacite: 89, qualite: 92, rendement: 87 },
    { mois: 'Jun', efficacite: 92, qualite: 95, rendement: 90 }
  ];

  return (
    <div className="space-y-8">
      {/* Évolution financière avec explications détaillées */}
      <Card className="shadow-xl border-border">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl text-green-800">
                <TrendingUp className="h-7 w-7" />
                Évolution Financière Détaillée
              </CardTitle>
              <p className="text-green-700 mt-2 text-base">
                Analyse comparative des revenus, dépenses et bénéfices sur 6 mois
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className="bg-green-100 text-green-800 px-3 py-1">
                <CheckCircle className="h-4 w-4 mr-1" />
                Croissance +12.5%
              </Badge>
              <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
                ROI 28.9%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="revenusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="depensesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" strokeWidth={1} />
                <XAxis 
                  dataKey="month" 
                  stroke="#047857"
                  fontSize={14}
                  fontWeight={500}
                />
                <YAxis 
                  stroke="#047857"
                  fontSize={14}
                  fontWeight={500}
                  tickFormatter={(value) => `${Math.round(value/1000000)}M FCFA`}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => [
                    formatFCFA(value), 
                    name === 'revenus' ? 'Revenus' : name === 'depenses' ? 'Dépenses' : 'Bénéfice'
                  ]}
                  labelFormatter={(label) => `Mois: ${label}`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.15)',
                    fontSize: '14px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '14px', fontWeight: '500' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenus" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#revenusGradient)"
                  name="Revenus Totaux" 
                />
                <Area 
                  type="monotone" 
                  dataKey="depenses" 
                  stroke="#f59e0b" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#depensesGradient)"
                  name="Dépenses Opérationnelles" 
                />
                <Line 
                  type="monotone" 
                  dataKey="benefice" 
                  stroke="#059669" 
                  strokeWidth={4}
                  name="Bénéfice Net" 
                  dot={{ fill: '#059669', strokeWidth: 2, r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Explications détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl border border-green-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">+18.6%</div>
              <div className="text-sm text-gray-600">Progression moyenne mensuelle des revenus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">+12.2%</div>
              <div className="text-sm text-gray-600">Augmentation contrôlée des dépenses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-700">250%</div>
              <div className="text-sm text-gray-600">Amélioration du bénéfice net</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Revenus par culture avec analyse */}
        <Card className="shadow-xl border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-emerald-800">
              <Sprout className="h-6 w-6" />
              Performance par Type de Culture
            </CardTitle>
            <p className="text-emerald-700 mt-1">
              Analyse comparative des rendements et rentabilité
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                  <XAxis 
                    type="number" 
                    stroke="#047857" 
                    fontSize={12}
                    tickFormatter={(value) => `${Math.round(value/1000000)}M`}
                  />
                  <YAxis 
                    dataKey="category" 
                    type="category" 
                    width={80}
                    stroke="#047857"
                    fontSize={12}
                    fontWeight={500}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatFCFA(value), 'Revenus']}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #10b981',
                      borderRadius: '8px',
                      boxShadow: '0 8px 20px rgba(16, 185, 129, 0.15)'
                    }}
                  />
                  <Bar 
                    dataKey="revenus" 
                    fill="#10b981"
                    radius={[0, 8, 8, 0]}
                    stroke="#059669"
                    strokeWidth={1}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              {categoryData.map((item, index) => (
                <div key={item.category} className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-5 h-5 rounded-full border-2 border-white shadow-sm" 
                        style={{ backgroundColor: item.couleur }}
                      />
                      <span className="font-semibold text-gray-800">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${
                        item.croissance > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {item.croissance > 0 ? '+' : ''}{item.croissance}%
                      </Badge>
                      {item.croissance > 0 ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-bold text-lg text-emerald-700">{formatFCFA(item.revenus)}</span>
                      <span className="text-gray-600 ml-2">• Rendement: {item.rendement}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Indicateurs de productivité */}
        <Card className="shadow-xl border-border">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl text-amber-800">
              <TrendingUp className="h-6 w-6" />
              Indicateurs de Productivité
            </CardTitle>
            <p className="text-amber-700 mt-1">
              Suivi de l'efficacité, qualité et rendement
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productivityTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#fef3c7" />
                  <XAxis 
                    dataKey="mois" 
                    stroke="#b45309"
                    fontSize={12}
                    fontWeight={500}
                  />
                  <YAxis 
                    stroke="#b45309"
                    fontSize={12}
                    domain={[70, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value}%`, 
                      name === 'efficacite' ? 'Efficacité' : name === 'qualite' ? 'Qualité' : 'Rendement'
                    ]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '2px solid #f59e0b',
                      borderRadius: '8px',
                      boxShadow: '0 8px 20px rgba(245, 158, 11, 0.15)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="efficacite" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    name="Efficacité Opérationnelle"
                    dot={{ fill: '#f59e0b', strokeWidth: 2, r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="qualite" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    name="Qualité des Récoltes"
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rendement" 
                    stroke="#d97706" 
                    strokeWidth={3}
                    name="Rendement par Hectare"
                    dot={{ fill: '#d97706', strokeWidth: 2, r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
