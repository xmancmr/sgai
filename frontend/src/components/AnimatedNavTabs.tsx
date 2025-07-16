import React, { useRef, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { useTheme } from '../contexts/ThemeContext';

const tabs = [
  { label: 'Dashboard', key: 'dashboard', icon: '🏠' },
  { label: 'Production', key: 'production', icon: '🌾' },
  { label: 'Coûts', key: 'costs', icon: '💰' },
  { label: 'Météo', key: 'weather', icon: '☀️' },
  { label: 'Inflation', key: 'inflation', icon: '📈' },
  { label: 'Volatilité', key: 'volatility', icon: '📊' },
  { label: 'Rapport', key: 'report', icon: '📝' },
  { label: 'Connexion', key: 'login', icon: '🔑' },
];

export const AnimatedNavTabs: React.FC<{
  activeTab: string;
  onTabChange: (key: string) => void;
}> = ({ activeTab, onTabChange }) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const { palette, darkMode } = useTheme();

  useEffect(() => {
    const idx = tabs.findIndex(tab => tab.key === activeTab);
    const tab = tabRefs.current[idx];
    if (tab && indicatorRef.current) {
      anime({
        targets: indicatorRef.current,
        left: tab.offsetLeft,
        width: tab.offsetWidth,
        duration: 500,
        easing: 'easeOutElastic(1, .8)',
      });
    }
  }, [activeTab]);

  return (
    <nav aria-label="Navigation principale" className={`relative w-full flex flex-col items-center ${darkMode ? 'bg-[#23231A]' : 'bg-white'} shadow rounded-lg p-2`}>
      <div className="flex flex-wrap w-full justify-center gap-2 sm:gap-4 relative">
        {tabs.map((tab, i) => (
          <button
            key={tab.key}
            ref={el => (tabRefs.current[i] = el)}
            aria-label={tab.label}
            className={`relative px-2 sm:px-4 py-2 font-semibold flex items-center gap-1 sm:gap-2 transition-colors duration-300 focus:outline-none ${activeTab === tab.key ? 'text-primary' : 'hover:text-primary'} ${darkMode ? 'text-[#A3B18A]' : 'text-[#4B7F52]'} text-xs sm:text-sm rounded w-20 sm:w-auto`}
            onClick={() => onTabChange(tab.key)}
          >
            <span className="text-lg sm:text-xl" aria-hidden="true">{tab.icon}</span>
            <span className="truncate max-w-[60px] sm:max-w-[100px]">{tab.label}</span>
          </button>
        ))}
        <div
          ref={indicatorRef}
          className="absolute bottom-0 h-1 rounded transition-all"
          style={{ left: 0, width: 0, background: palette?.colors.primary || '#4B7F52' }}
        />
      </div>
    </nav>
  );
};
