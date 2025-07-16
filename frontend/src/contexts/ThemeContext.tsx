import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { theme, darkTheme } from '../theme';

interface ThemeContextProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  palette: typeof theme;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mq.matches);
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = () => setDarkMode(d => !d);
  const palette = darkMode ? darkTheme : theme;

  const value = React.useMemo(() => ({ darkMode, toggleDarkMode, palette }), [darkMode, palette]);
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
