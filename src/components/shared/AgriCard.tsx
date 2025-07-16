import React from 'react';

interface PaletteType {
  colors: Record<string, string>;
  borderRadius: string;
  shadow: string;
}

export const AgriCard: React.FC<{
  title: string;
  children: React.ReactNode;
  className?: string;
  palette?: PaletteType;
  darkMode?: boolean;
}> = ({ title, children, className = '', palette, darkMode }) => {
  const p = palette || {
    colors: {
      surface: '#fff',
      border: '#E0DCC3',
      primary: '#4B7F52',
      text: '#2D2A26',
    },
    borderRadius: '0.75rem',
    shadow: '0 2px 8px 0 rgba(76, 85, 72, 0.08)',
  };
  return (
    <div
      className={`w-full min-w-0 overflow-x-auto ${className}`}
      style={{
        borderRadius: p.borderRadius || '1.5rem',
        background: 'linear-gradient(145deg, #f5f7fa 0%, #c3cfe2 100%)',
        boxShadow: '8px 8px 24px #b8b8b8, -8px -8px 24px #ffffff',
        border: '1px solid #e0e0e0',
        padding: '2rem',
        margin: '1rem 0',
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' fill=\'none\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'40\' height=\'40\' fill=\'%23f5f7fa\'/%3E%3Ccircle cx=\'20\' cy=\'20\' r=\'1.5\' fill=\'%23e0e0e0\'/%3E%3C/svg%3E")',
      }}
    >
      <h3 className="text-base sm:text-lg font-semibold mb-2" style={{ color: p.colors.primary }}>{title}</h3>
      <div className="w-full min-w-0">{children}</div>
    </div>
  );
};
