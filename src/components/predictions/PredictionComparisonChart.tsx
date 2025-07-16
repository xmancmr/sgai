
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonData {
  culture: string;
  prediction: number;
  realise: number;
  ecart: number;
  precision: number;
}

const mockComparisonData: ComparisonData[] = [
  { culture: 'Canne à sucre', prediction: 82, realise: 85, ecart: 3, precision: 96.5 },
  { culture: 'Banane', prediction: 30, realise: 32, ecart: 2, precision: 93.8 },
  { culture: 'Ananas', prediction: 47, realise: 45, ecart: -2, precision: 95.7 },
  { culture: 'Igname', prediction: 16, realise: 18, ecart: 2, precision: 88.9 },
  { culture: 'Madère', prediction: 21, realise: 22, ecart: 1, precision: 95.5 },
];

const PredictionComparisonChart: React.FC = () => {
  const averagePrecision = mockComparisonData.reduce((sum, item) => sum + item.precision, 0) / mockComparisonData.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Comparaison Prédictions vs Réalisé</span>
          <div className="text-sm font-normal">
            Précision moyenne: {averagePrecision.toFixed(1)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="culture" />
              <YAxis label={{ value: 'Rendement (t/ha)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                formatter={(value, name) => [
                  `${value} t/ha`, 
                  name === 'prediction' ? 'Prédiction' : 'Réalisé'
                ]}
              />
              <Legend />
              <Bar dataKey="prediction" fill="#3b82f6" name="Prédiction" />
              <Bar dataKey="realise" fill="#10b981" name="Réalisé" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {mockComparisonData.filter(d => Math.abs(d.ecart) <= 2).length}
            </div>
            <div className="text-sm text-muted-foreground">Prédictions précises (±2t/ha)</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {averagePrecision.toFixed(1)}%
            </div>
            <div className="text-sm text-muted-foreground">Précision moyenne</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {Math.abs(mockComparisonData.reduce((sum, d) => sum + d.ecart, 0) / mockComparisonData.length).toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">Écart moyen (t/ha)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionComparisonChart;
