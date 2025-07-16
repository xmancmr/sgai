import React from 'react';
import { AgriCard } from '../../../src/components/shared/AgriCard';
import { AgriChart } from '../../../src/components/shared/AgriChart';

interface PaletteType {
  colors: Record<string, string>;
  borderRadius: string;
  shadow: string;
}

const productionData = {
  labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
  datasets: [
    {
      label: 'Production (tonnes)',
      data: [12, 19, 15, 22, 18, 25],
    },
  ],
};

const costData = {
  labels: ['Semences', 'Engrais', 'Eau', 'Main d’œuvre'],
  datasets: [
    {
      label: 'Coûts (€)',
      data: [1200, 900, 700, 1500],
    },
  ],
};

export default function Dashboard({ darkMode, palette }: { darkMode?: boolean, palette?: PaletteType }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2 sm:p-4 max-w-full sm:max-w-5xl mx-auto w-full overflow-x-auto">
      <div className="w-full min-w-0">
        <AgriCard title="Production mensuelle" palette={palette} darkMode={darkMode}>
          <AgriChart type="line" data={productionData} title="Production par mois" darkMode={darkMode} palette={palette} />
        </AgriCard>
      </div>
      <div className="w-full min-w-0">
        <AgriCard title="Répartition des coûts" palette={palette} darkMode={darkMode}>
          <AgriChart type="bar" data={costData} title="Coûts par catégorie" darkMode={darkMode} palette={palette} />
        </AgriCard>
      </div>
      <div className="w-full min-w-0">
        <AgriCard title="Résumé" palette={palette} darkMode={darkMode}>
          <ul className="space-y-2 text-xs sm:text-base">
            <li><span className="font-semibold text-green-700 dark:text-green-300">Rendement moyen :</span> 18,5 t/mois</li>
            <li><span className="font-semibold text-yellow-700 dark:text-yellow-300">Coût total :</span> 4 300 €</li>
            <li><span className="font-semibold text-brown-700 dark:text-brown-300">Tendance :</span> +8% par rapport à l’an dernier</li>
          </ul>
        </AgriCard>
      </div>
    </div>
  );
}
