
import React from 'react';
import { 
  Apple, 
  Cherry, 
  Carrot, 
  Wheat, 
  TreePine, 
  Leaf, 
  Flower, 
  Grape, 
  Bean,
  Palmtree,
  Sprout,
  Zap
} from 'lucide-react';
import { useCultureIcons } from '@/hooks/use-culture-icons';

interface CultureIconProps {
  cultureName: string;
  size?: number;
  className?: string;
  useAutoColor?: boolean;
}

// Mapping des noms d'icônes vers les composants Lucide React
const iconComponents: Record<string, React.ComponentType<any>> = {
  Apple,
  Cherry,
  Carrot,
  Wheat,
  TreePine,
  Leaf,
  Flower,
  Grape,
  Bean,
  Palmtree,
  Sprout,
  Zap
};

const CultureIcon: React.FC<CultureIconProps> = ({ 
  cultureName, 
  size = 20, 
  className,
  useAutoColor = true
}) => {
  const { getIconForCulture, getColorForCulture, loading, error } = useCultureIcons();

  // Pendant le chargement, afficher l'icône par défaut
  if (loading) {
    return <Leaf size={size} className={className || "text-green-500"} />;
  }

  // En cas d'erreur, afficher l'icône par défaut
  if (error) {
    console.warn('Erreur lors du chargement des icônes de cultures:', error);
    return <Leaf size={size} className={className || "text-green-500"} />;
  }

  // Obtenir le nom de l'icône depuis la base de données ou le mapping automatique
  const iconName = getIconForCulture(cultureName);
  
  // Obtenir la couleur automatique ou utiliser celle fournie
  const iconColor = useAutoColor && !className ? getColorForCulture(cultureName) : (className || "text-green-500");
  
  // Obtenir le composant d'icône correspondant
  const IconComponent = iconComponents[iconName] || Leaf;

  return <IconComponent size={size} className={iconColor} />;
};

export default CultureIcon;
