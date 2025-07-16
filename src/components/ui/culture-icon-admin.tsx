
import React, { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Plus, Trash2, Edit, Save, X, Leaf } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useCultureIcons } from '@/hooks/use-culture-icons';

interface CultureIconData {
  id?: string;
  culture_name: string;
  icon_name: string;
  category: string;
}

const availableIcons = [
  'Apple', 'Cherry', 'Carrot', 'Wheat', 'TreePine', 'Leaf', 
  'Flower', 'Grape', 'Bean', 'Palmtree', 'Sprout', 'Zap'
];

// Mapping des noms d'icônes vers les composants Lucide React
const iconComponents: Record<string, React.ComponentType<any>> = {
  Apple: () => <div>🍎</div>, // Placeholder - vous pouvez importer les vraies icônes
  Cherry: () => <div>🍒</div>,
  Carrot: () => <div>🥕</div>,
  Wheat: () => <div>🌾</div>,
  TreePine: () => <div>🌲</div>,
  Leaf: Leaf,
  Flower: () => <div>🌸</div>,
  Grape: () => <div>🍇</div>,
  Bean: () => <div>🫘</div>,
  Palmtree: () => <div>🌴</div>,
  Sprout: () => <div>🌱</div>,
  Zap: () => <div>⚡</div>
};

const categories = [
  'fruits', 'legumes', 'herbes', 'tubercules', 'cereales', 
  'legumineuses', 'epices', 'industrielles', 'types_agriculture',
  'fruits_exotiques', 'legumes_exotiques', 'legumes_feuilles',
  'courges', 'champignons', 'agrumes', 'noix_graines', 'medicinales'
];

export const CultureIconAdmin: React.FC = () => {
  const { icons, loading, getIconForCulture, getColorForCulture } = useCultureIcons();
  const [newIcon, setNewIcon] = useState<CultureIconData>({
    culture_name: '',
    icon_name: 'Leaf',
    category: 'legumes'
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleAddIcon = async () => {
    if (!newIcon.culture_name.trim()) {
      toast.error('Le nom de la culture est requis');
      return;
    }

    try {
      const { error } = await supabase
        .from('culture_icons')
        .insert([newIcon]);

      if (error) throw error;

      toast.success('Icône de culture ajoutée avec succès');
      setNewIcon({ culture_name: '', icon_name: 'Leaf', category: 'legumes' });
      // Recharger la page pour mettre à jour la liste
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast.error('Erreur lors de l\'ajout de l\'icône');
    }
  };

  const handleDeleteIcon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('culture_icons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Icône supprimée avec succès');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  // Exemples de cultures pour tester le mapping automatique
  const testCultures = [
    'Banane plantain', 'Tomate', 'Carotte', 'Maïs', 'Riz', 'Haricot vert', 
    'Piment', 'Gingembre', 'Palmier à huile', 'Manioc', 'Igname', 
    'Patate douce', 'Ananas', 'Mangue', 'Soja', 'Arachide'
  ];

  if (loading) {
    return <div>Chargement des icônes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Ajouter une nouvelle icône de culture</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Nom de la culture"
            value={newIcon.culture_name}
            onChange={(e) => setNewIcon({ ...newIcon, culture_name: e.target.value })}
          />
          <Select value={newIcon.icon_name} onValueChange={(value) => setNewIcon({ ...newIcon, icon_name: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableIcons.map(icon => (
                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={newIcon.category} onValueChange={(value) => setNewIcon({ ...newIcon, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddIcon}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Test du mapping automatique</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Aperçu des icônes et couleurs assignées automatiquement aux cultures courantes
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {testCultures.map((culture) => {
            const iconName = getIconForCulture(culture);
            const iconColor = getColorForCulture(culture);
            const IconComponent = iconComponents[iconName] || Leaf;
            
            return (
              <div key={culture} className="flex flex-col items-center p-3 border rounded-lg">
                <IconComponent size={32} className={iconColor} />
                <span className="text-xs text-center mt-2 font-medium">{culture}</span>
                <span className="text-xs text-muted-foreground">{iconName}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Icônes de cultures existantes ({Object.keys(icons).length})</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Administration des icônes de cultures chargées depuis la base de données
        </p>
        <div className="text-sm">
          <strong>Statistiques:</strong> {Object.keys(icons).length} icônes de cultures disponibles
        </div>
      </div>
    </div>
  );
};
