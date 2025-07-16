import React, { useState, useEffect } from 'react';
import { AnimatedNavTabs } from './components/AnimatedNavTabs';
import { AnimatedLoader } from './components/AnimatedLoader';

import Dashboard from './pages/Dashboard';
import { PredictionForm } from './components/PredictionForm';
import { CostsForm } from './components/CostsForm';
import { WeatherForm } from './components/WeatherForm';
import { InflationForm } from './components/InflationForm';
import { VolatilityForm } from './components/VolatilityForm';
import { ReportForm } from './components/ReportForm';
import { LoginForm } from './components/LoginForm';
import { AuthProvider } from './components/JWTContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const tabContent: Record<string, React.ReactNode> = {
  dashboard: <Dashboard />,
  production: <PredictionForm />,
  costs: <CostsForm />,
  weather: <WeatherForm />,
  inflation: <InflationForm />,
  volatility: <VolatilityForm />,
  report: <ReportForm />,
  login: <LoginForm />,
};

function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const { darkMode, toggleDarkMode, palette } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AnimatedLoader />;

  return (
    <div className={darkMode ? 'dark min-h-screen bg-[#23231A]' : 'min-h-screen bg-gray-50'}>
      <header className="py-6 mb-4 bg-gradient-to-r from-[#F5F3E7] to-[#A3B18A] shadow dark:from-[#23231A] dark:to-[#4B7F52]">
        <div className="flex justify-between items-center max-w-5xl mx-auto px-2 md:px-6">
          <h1 className="text-3xl font-bold text-center text-[#4B7F52] dark:text-[#A3B18A] tracking-tight mb-2">SGAI - Gestion Agricole Intelligente</h1>
          <button onClick={toggleDarkMode} className="ml-4 p-2 rounded-full bg-white dark:bg-[#2D2A26] shadow">
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
        <AnimatedNavTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </header>
      <main className="max-w-5xl mx-auto px-2 md:px-6">
        {React.cloneElement(tabContent[activeTab] as React.ReactElement, { darkMode, palette })}
      </main>
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
