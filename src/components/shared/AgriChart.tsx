import React from 'react';
import { useScrollTrigger } from '../../../frontend/src/hooks/useScrollTrigger';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { theme, darkTheme } from '../../../frontend/src/theme';

interface PaletteType {
  colors: Record<string, string>;
  borderRadius: string;
  shadow: string;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

type AgriChartProps = {
  type: 'bar' | 'line';
  data: ChartData<'bar'> | ChartData<'line'>;
  options?: ChartOptions<'bar'> | ChartOptions<'line'>;
  title?: string;
};

export const AgriChart: React.FC<AgriChartProps & { darkMode?: boolean; palette?: PaletteType }> = ({ type, data, options, title, darkMode, palette }) => {
  const paletteToUse = palette || (darkMode ? darkTheme : theme);
  const chartColors = [
    paletteToUse.colors.chart1,
    paletteToUse.colors.chart2,
    paletteToUse.colors.chart3,
    paletteToUse.colors.chart4,
    paletteToUse.colors.chart5,
  ];

  // Intégration du scroll trigger (fade-in du graphique)
  const isTriggered = useScrollTrigger(120);

  const chartDataBar: ChartData<'bar'> = type === 'bar'
    ? {
        ...data,
        datasets: data.datasets.map((ds, i) => {
          const { type: _type, ...rest } = ds as ChartData<'bar'>['datasets'][number];
          return {
            ...rest,
            backgroundColor: rest.backgroundColor || chartColors[i % chartColors.length],
            borderColor: rest.borderColor || chartColors[i % chartColors.length],
            borderWidth: 2,
            borderRadius: 8,
            pointRadius: 4,
          };
        }),
      }
    : ({} as ChartData<'bar'>);

  const chartDataLine: ChartData<'line'> = type === 'line'
    ? {
        ...data,
        datasets: data.datasets.map((ds, i) => {
          const { type: _type, ...rest } = ds as ChartData<'line'>['datasets'][number];
          return {
            ...rest,
            backgroundColor: rest.backgroundColor || chartColors[i % chartColors.length],
            borderColor: rest.borderColor || chartColors[i % chartColors.length],
            borderWidth: 2,
            borderRadius: 8,
            pointRadius: 4,
          };
        }),
      }
    : ({} as ChartData<'line'>);

  const chartOptionsBar: ChartOptions<'bar'> = {
    plugins: {
      legend: { display: true, labels: { color: paletteToUse.colors.muted } },
      title: { display: !!title, text: title, color: paletteToUse.colors.primary, font: { size: 18 } },
      tooltip: { backgroundColor: paletteToUse.colors.surface, titleColor: paletteToUse.colors.primary, bodyColor: paletteToUse.colors.text },
    },
    scales: {
      x: { grid: { color: paletteToUse.colors.border }, ticks: { color: paletteToUse.colors.muted } },
      y: { grid: { color: paletteToUse.colors.border }, ticks: { color: paletteToUse.colors.muted } },
    },
    responsive: true,
    maintainAspectRatio: false,
    ...(options as ChartOptions<'bar'>),
  };

  const chartOptionsLine: ChartOptions<'line'> = {
    plugins: {
      legend: { display: true, labels: { color: paletteToUse.colors.muted } },
      title: { display: !!title, text: title, color: paletteToUse.colors.primary, font: { size: 18 } },
      tooltip: { backgroundColor: paletteToUse.colors.surface, titleColor: paletteToUse.colors.primary, bodyColor: paletteToUse.colors.text },
    },
    scales: {
      x: { grid: { color: paletteToUse.colors.border }, ticks: { color: paletteToUse.colors.muted } },
      y: { grid: { color: paletteToUse.colors.border }, ticks: { color: paletteToUse.colors.muted } },
    },
    responsive: true,
    maintainAspectRatio: false,
    ...(options as ChartOptions<'line'>),
  };

  return (
    <div
      className={`w-full min-w-0 overflow-x-auto transition-opacity duration-700 ${isTriggered ? 'opacity-100' : 'opacity-0 translate-y-8'}`}
      style={{
        minHeight: 240,
        borderRadius: '1.5rem',
        background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '8px 8px 24px #b8b8b8, -8px -8px 24px #ffffff',
        border: '1px solid #e0e0e0',
        padding: '2rem',
        margin: '1rem 0',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%23f5f7fa\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'%23e0e0e0\'/%3E%3C/svg%3E")',
      }}
    >
      <div className="min-w-[220px] sm:min-w-0" style={{ width: '100%' }}>
        {type === 'bar' ? (
          <Bar data={chartDataBar} options={chartOptionsBar} />
        ) : (
          <Line data={chartDataLine} options={chartOptionsLine} />
        )}
      </div>
    </div>
  );
};
