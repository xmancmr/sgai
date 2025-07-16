
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CultureIcon {
  id: string;
  culture_name: string;
  icon_name: string;
  category: string;
}

// Mapping des catégories vers les couleurs
const categoryColors: Record<string, string> = {
  'fruits': 'text-red-500',
  'legumes': 'text-green-500',
  'herbes': 'text-emerald-400',
  'tubercules': 'text-amber-600',
  'cereales': 'text-yellow-500',
  'legumineuses': 'text-purple-500',
  'epices': 'text-orange-500',
  'industrielles': 'text-blue-500',
  'types_agriculture': 'text-teal-500',
  'fruits_exotiques': 'text-pink-500',
  'legumes_exotiques': 'text-lime-500',
  'legumes_feuilles': 'text-green-400',
  'courges': 'text-orange-400',
  'champignons': 'text-stone-500',
  'agrumes': 'text-yellow-400',
  'noix_graines': 'text-amber-500',
  'medicinales': 'text-violet-500'
};

// Mapping automatique basé sur des mots-clés
const autoMapping: Record<string, { icon: string, category: string }> = {
  // Fruits
  'banane': { icon: 'Apple', category: 'fruits' },
  'ananas': { icon: 'Apple', category: 'fruits_exotiques' },
  'mangue': { icon: 'Apple', category: 'fruits_exotiques' },
  'papaye': { icon: 'Apple', category: 'fruits_exotiques' },
  'pasteque': { icon: 'Apple', category: 'fruits' },
  'pomme': { icon: 'Apple', category: 'fruits' },
  'orange': { icon: 'Apple', category: 'agrumes' },
  'citron': { icon: 'Apple', category: 'agrumes' },
  'grape': { icon: 'Grape', category: 'fruits' },
  'raisin': { icon: 'Grape', category: 'fruits' },
  'cerise': { icon: 'Cherry', category: 'fruits' },
  
  // Légumes
  'tomate': { icon: 'Apple', category: 'legumes' },
  'carotte': { icon: 'Carrot', category: 'legumes' },
  'concombre': { icon: 'Leaf', category: 'legumes' },
  'oignon': { icon: 'Leaf', category: 'legumes' },
  'salade': { icon: 'Leaf', category: 'legumes_feuilles' },
  'épinard': { icon: 'Leaf', category: 'legumes_feuilles' },
  'chou': { icon: 'Leaf', category: 'legumes_feuilles' },
  'poivron': { icon: 'Leaf', category: 'legumes' },
  'courgette': { icon: 'Leaf', category: 'courges' },
  'potiron': { icon: 'Leaf', category: 'courges' },
  
  // Tubercules
  'pomme de terre': { icon: 'Sprout', category: 'tubercules' },
  'patate': { icon: 'Sprout', category: 'tubercules' },
  'igname': { icon: 'Sprout', category: 'tubercules' },
  'manioc': { icon: 'Sprout', category: 'tubercules' },
  'macabo': { icon: 'Sprout', category: 'tubercules' },
  'taro': { icon: 'Sprout', category: 'tubercules' },
  
  // Céréales
  'mais': { icon: 'Wheat', category: 'cereales' },
  'maïs': { icon: 'Wheat', category: 'cereales' },
  'riz': { icon: 'Wheat', category: 'cereales' },
  'blé': { icon: 'Wheat', category: 'cereales' },
  'mil': { icon: 'Wheat', category: 'cereales' },
  'sorgho': { icon: 'Wheat', category: 'cereales' },
  'avoine': { icon: 'Wheat', category: 'cereales' },
  
  // Légumineuses
  'haricot': { icon: 'Bean', category: 'legumineuses' },
  'pois': { icon: 'Bean', category: 'legumineuses' },
  'lentille': { icon: 'Bean', category: 'legumineuses' },
  'soja': { icon: 'Bean', category: 'legumineuses' },
  'arachide': { icon: 'Bean', category: 'legumineuses' },
  'niebe': { icon: 'Bean', category: 'legumineuses' },
  'niébé': { icon: 'Bean', category: 'legumineuses' },
  'voandzou': { icon: 'Bean', category: 'legumineuses' },
  
  // Épices et herbes
  'piment': { icon: 'Zap', category: 'epices' },
  'gingembre': { icon: 'Leaf', category: 'epices' },
  'ail': { icon: 'Leaf', category: 'epices' },
  'persil': { icon: 'Leaf', category: 'herbes' },
  'basilic': { icon: 'Leaf', category: 'herbes' },
  'thym': { icon: 'Leaf', category: 'herbes' },
  'gombo': { icon: 'Flower', category: 'legumes' },
  
  // Arbres et cultures industrielles
  'palmier': { icon: 'Palmtree', category: 'industrielles' },
  'cocotier': { icon: 'Palmtree', category: 'industrielles' },
  'cacao': { icon: 'TreePine', category: 'industrielles' },
  'café': { icon: 'Bean', category: 'industrielles' },
  'coton': { icon: 'Flower', category: 'industrielles' },
  'canne à sucre': { icon: 'Wheat', category: 'industrielles' },
  
  // Autres
  'sesame': { icon: 'Bean', category: 'noix_graines' },
  'sésame': { icon: 'Bean', category: 'noix_graines' },
  'pistache': { icon: 'Bean', category: 'noix_graines' }
};

export const useCultureIcons = () => {
  const [icons, setIcons] = useState<Record<string, { icon: string, category: string }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCultureIcons = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('culture_icons')
          .select('culture_name, icon_name, category');

        if (error) {
          throw error;
        }

        // Convertir les données en objet pour un accès rapide
        const iconMap: Record<string, { icon: string, category: string }> = {};
        data?.forEach((icon: CultureIcon) => {
          // Normaliser le nom de la culture pour la recherche
          const normalizedName = icon.culture_name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
          iconMap[normalizedName] = {
            icon: icon.icon_name,
            category: icon.category || 'legumes'
          };
        });

        setIcons(iconMap);
        setError(null);
      } catch (err) {
        console.error('Erreur lors du chargement des icônes de cultures:', err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchCultureIcons();
  }, []);

  const getIconForCulture = (cultureName: string): string => {
    // Normaliser le nom de la culture recherchée
    const normalizedName = cultureName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    // Recherche exacte dans la base de données
    if (icons[normalizedName]) {
      return icons[normalizedName].icon;
    }

    // Recherche par correspondance partielle dans la base
    const partialMatch = Object.keys(icons).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );

    if (partialMatch) {
      return icons[partialMatch].icon;
    }

    // Mapping automatique basé sur les mots-clés
    const autoMatch = Object.keys(autoMapping).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );

    if (autoMatch) {
      return autoMapping[autoMatch].icon;
    }

    // Icône par défaut
    return 'Leaf';
  };

  const getColorForCulture = (cultureName: string): string => {
    // Normaliser le nom de la culture recherchée
    const normalizedName = cultureName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    // Recherche exacte dans la base de données
    if (icons[normalizedName]) {
      return categoryColors[icons[normalizedName].category] || 'text-green-500';
    }

    // Recherche par correspondance partielle dans la base
    const partialMatch = Object.keys(icons).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );

    if (partialMatch) {
      return categoryColors[icons[partialMatch].category] || 'text-green-500';
    }

    // Mapping automatique basé sur les mots-clés
    const autoMatch = Object.keys(autoMapping).find(key => 
      normalizedName.includes(key) || key.includes(normalizedName)
    );

    if (autoMatch) {
      return categoryColors[autoMapping[autoMatch].category] || 'text-green-500';
    }

    // Couleur par défaut
    return 'text-green-500';
  };

  return {
    getIconForCulture,
    getColorForCulture,
    loading,
    error,
    icons
  };
};
