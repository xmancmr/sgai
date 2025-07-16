import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScatterChart,
  Scatter,
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart,
  Bar,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { useStatistics } from '../../contexts/StatisticsContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { formatFCFA } from '@/utils/currency';
import { TrendingUp, TrendingDown, BarChart3, PieChart as PieChartIcon } from 'lucide-react';

const EnhancedFinancialCharts = () => {
  const { financialData } = useStatistics();
  const { profitabilityByParcel, costAnalysis, revenueByMonth } = financialData;

  // Enhanced data with more detailed information
  const enhancedProfitabilityData = [
    { name: 'Parcelle Nord', size: 5.2, profitability: 8200000, crop: 'Banane', efficiency: 92 },
    { name: 'Parcelle Sud', size: 3.8, profitability: 6400000, crop: 'Canne à Sucre', efficiency: 87 },
    { name: 'Parcelle Est', size: 4.1, profitability: 7100000, crop: 'Ananas', efficiency: 95 },
    { name: 'Parcelle Ouest', size: 6.3, profitability: 9800000, crop: 'Igname', efficiency: 89 },
    { name: 'Parcelle Centre', size: 2.7, profitability: 4900000, crop: 'Légumes', efficiency: 91 }
  ];

  const detailedCostAnalysis = [
    { name: 'Intrants agricoles', value: 9967344, trend: 'up', percentage: 28 },
    { name: 'Main d\'œuvre', value: 8396416, trend: 'stable', percentage: 24 },
    { name: 'Énergie/Carburant', value: 7806883, trend: 'up', percentage: 22 },
    { name: 'Maintenance équipement', value: 5378854, trend: 'down', percentage: 15 },
    { name: 'Transport/Logistique', value: 3585902, trend: 'stable', percentage: 11 }
  ];

  const revenueBreakdown = [
    { name: 'Ventes directes', value: 18698000, color: '#10b981', percentage: 42 },
    { name: 'Coopératives', value: 11931600, color: '#059669', percentage: 27 },
    { name: 'Export', value: 8944800, color: '#047857', percentage: 20 },
    { name: 'Subventions', value: 4872000, color: '#065f46', percentage: 11 }
  ];

  const monthlyComparison = [
    { 
      mois: 'Jan', 
      revenus: 7873440, 
      depenses: 6298752, 
      benefice: 1574688,
      objectif: 1312000,
      realisation: 120
    },
    { 
      mois: 'Fév', 
      revenus: 9840000, 
      depenses: 7872000, 
      benefice: 1968000,
      objectif: 1640000,
      realisation: 120
    },
    { 
      mois: 'Mar', 
      revenus: 12136000, 
      depenses: 8854400, 
      benefice: 3281600,
      objectif: 2624000,
      realisation: 125
    },
    { 
      mois: 'Avr', 
      revenus: 10496000, 
      depenses: 8396800, 
      benefice: 2099200,
      objectif: 1968000,
      realisation: 107
    },
    { 
      mois: 'Mai', 
      revenus: 13120000, 
      depenses: 9184000, 
      benefice: 3936000,
      objectif: 3280000,
      realisation: 120
    },
    { 
      mois: 'Jun', 
      revenus: 14432000, 
      depenses: 10168000, 
      benefice: 4264000,
      objectif: 3936000,
      realisation: 108
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus Totaux</p>
                <p className="text-xl font-bold">{formatFCFA(68446400)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">+15.3%</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bénéfice Net</p>
                <p className="text-xl font-bold">{formatFCFA(17123488)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">+25.0%</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI Moyen</p>
                <p className="text-xl font-bold">28.9%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">Excellent</Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Efficacité</p>
                <p className="text-xl font-bold">91%</p>
              </div>
              <PieChartIcon className="h-8 w-8 text-orange-600" />
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800">Optimale</Badge>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Profitability Analysis */}
      <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Analyse Comparative des Rendements et Rentabilité
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Performance par parcelle avec indicateurs d'efficacité
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, left: 40, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis 
                    type="number" 
                    dataKey="size" 
                    name="Taille" 
                    unit=" ha" 
                    label={{ value: 'Surface (hectares)', position: 'insideBottom', offset: -20 }}
                    stroke="#475569"
                  />
                  <YAxis 
                    type="number" 
                    dataKey="profitability" 
                    name="Rentabilité" 
                    unit=" FCFA/ha" 
                    label={{ value: 'Rentabilité (FCFA/ha)', angle: -90, position: 'insideLeft' }}
                    tickFormatter={(value: any) => `${Math.round(Number(value)/1000000)}M`}
                    stroke="#475569"
                  />
                  <ZAxis 
                    type="number" 
                    dataKey="efficiency" 
                    range={[50, 400]} 
                    name="Efficacité"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-lg">
                            <p className="font-semibold text-lg">{data.name}</p>
                            <div className="space-y-1 mt-2">
                              <p className="flex justify-between">
                                <span>Culture:</span> 
                                <span className="font-medium">{data.crop}</span>
                              </p>
                              <p className="flex justify-between">
                                <span>Surface:</span> 
                                <span className="font-medium">{data.size} ha</span>
                              </p>
                              <p className="flex justify-between">
                                <span>Rentabilité:</span> 
                                <span className="font-medium">{formatFCFA(data.profitability)}</span>
                              </p>
                              <p className="flex justify-between">
                                <span>Efficacité:</span> 
                                <span className="font-medium">{data.efficiency}%</span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter 
                    name="Parcelles" 
                    data={enhancedProfitabilityData} 
                    fill="#10b981"
                    stroke="#059669"
                    strokeWidth={2}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            {/* Performance Summary */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-green-700">Meilleure Performance</p>
                <p className="text-lg font-bold text-green-900">Parcelle Nord - Banane</p>
                <p className="text-sm text-green-600">95% d'efficacité</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-700">Rentabilité Moyenne</p>
                <p className="text-lg font-bold text-blue-900">{formatFCFA(7280000)}/ha</p>
                <p className="text-sm text-blue-600">Sur 22.1 hectares</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm font-medium text-purple-700">Opportunité</p>
                <p className="text-lg font-bold text-purple-900">Parcelle Sud</p>
                <p className="text-sm text-purple-600">Potentiel +8% rendement</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Revenue Sources Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChartIcon className="h-5 w-5" />
                Sources de Revenus Détaillées
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Répartition enrichie des sources de financement
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percentage }) => `${percentage}%`}
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatFCFA(value), 'Revenus']}
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Detailed breakdown */}
              <div className="space-y-3 mt-4">
                {revenueBreakdown.map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatFCFA(item.value)}</p>
                      <p className="text-sm text-gray-600">{item.percentage}% du total</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Enhanced Cost Analysis */}
        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée des Coûts</CardTitle>
              <p className="text-sm text-muted-foreground">
                Structure des dépenses avec tendances
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={detailedCostAnalysis}
                    layout="horizontal"
                    margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis 
                      type="number" 
                      tickFormatter={(value: any) => `${Math.round(Number(value)/1000000)}M`}
                    />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 12 }} 
                      width={100} 
                    />
                    <Tooltip formatter={(value: any) => [formatFCFA(Number(value)), 'Montant']} />
                    <Bar 
                      dataKey="value" 
                      fill="#f59e0b" 
                      radius={[0, 4, 4, 0]} 
                      barSize={25}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              
              {/* Cost trends */}
              <div className="space-y-3 mt-4">
                {detailedCostAnalysis.map((cost, index) => (
                  <div key={cost.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm">{cost.name}</span>
                      {cost.trend === 'up' && <TrendingUp className="h-4 w-4 text-red-500" />}
                      {cost.trend === 'down' && <TrendingDown className="h-4 w-4 text-green-500" />}
                      {cost.trend === 'stable' && <div className="w-4 h-1 bg-gray-400 rounded" />}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">{formatFCFA(cost.value)}</p>
                      <p className="text-xs text-gray-600">{cost.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Monthly Performance Comparison */}
      <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Performance Mensuelle Détaillée</CardTitle>
            <p className="text-sm text-muted-foreground">
              Évolution des revenus, dépenses et taux de réalisation des objectifs
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyComparison}>
                  <defs>
                    <linearGradient id="colorRevenus" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorDepenses" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mois" />
                  <YAxis tickFormatter={(value: any) => `${Math.round(Number(value)/1000000)}M`} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      formatFCFA(value), 
                      name === 'revenus' ? 'Revenus' : name === 'depenses' ? 'Dépenses' : 'Bénéfice'
                    ]}
                  />
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
                    stroke="#f59e0b" 
                    fillOpacity={1} 
                    fill="url(#colorDepenses)"
                    name="Dépenses" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="benefice" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Bénéfice" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Financial KPIs */}
      <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle>Indicateurs Financiers Clés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-700 mb-1">EBE (EBITDA)</p>
                <p className="text-2xl font-bold text-green-900">{formatFCFA(27880000)}</p>
                <p className="text-xs text-green-600 mt-1">32% du chiffre d'affaires</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <p className="text-sm font-medium text-blue-700 mb-1">Marge Nette</p>
                <p className="text-2xl font-bold text-blue-900">25.0%</p>
                <p className="text-xs text-blue-600 mt-1">+3.2% vs année précédente</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg border border-purple-200">
                <p className="text-sm font-medium text-purple-700 mb-1">ROI</p>
                <p className="text-2xl font-bold text-purple-900">28.9%</p>
                <p className="text-xs text-purple-600 mt-1">Sur les investissements</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                <p className="text-sm font-medium text-orange-700 mb-1">Taux de Croissance</p>
                <p className="text-2xl font-bold text-orange-900">15.3%</p>
                <p className="text-xs text-orange-600 mt-1">Revenus annuels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EnhancedFinancialCharts;