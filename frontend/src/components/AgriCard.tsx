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
// Ce fichier est obsolète. Utilisez src/components/shared/AgriCard.tsx
export {};
};
