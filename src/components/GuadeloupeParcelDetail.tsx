import React, { useState } from 'react';
import { EditableField } from './ui/editable-field';
import { AgriChart } from './shared/AgriChart';
import { EditableTable, Column } from './ui/editable-table';
import { 
  Map, 
  MapPin, 
  Tractor, 
  Calendar, 
  PlaneTakeoff, 
  CloudRain, 
  Thermometer, 
  LineChart,
  Camera,
  Plus,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { useParams } from 'react-router-dom';
import { Button } from './ui/button';

interface ParcelDetail {
  id: string;
  name: string;
  location: string;
  surface: number;
  soilType: string;
  crops: { crop: string; variety: string; plantingDate: string; harvestDate: string; status: string }[];
  irrigationSystem: string;
  notes: string;
  owner: string;
  lastInspection: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  images: string[];
}

interface TaskData {
  id: number;
  task: string;
  dueDate: string;
  assignedTo: string;
  priority: 'Basse' | 'Moyenne' | 'Élevée' | 'Urgente';
  status: 'À faire' | 'En cours' | 'Terminée';
}

const parcelData: ParcelDetail = {
  id: '1',
  name: 'Parcelle des Hauts Palmiers',
  location: 'Grande-Terre - Morne-à-l\'Eau',
  surface: 8.5,
  soilType: 'Argilo-calcaire',
  crops: [
    { 
      crop: 'Canne à Sucre', 
      variety: 'R579', 
      plantingDate: '2023-02-10', 
      harvestDate: '2024-02-15',
      status: 'En croissance'
    },
    { 
      crop: 'Igname', 
      variety: 'Pacala', 
      plantingDate: '2023-05-20', 
      harvestDate: '2023-12-10',
      status: 'Récolté'
    }
  ],
  irrigationSystem: 'Goutte-à-goutte avec captation d\'eau de pluie',
  notes: 'Parcelle en conversion bio depuis 2022. Exposition Sud-Est favorable.',
  owner: 'Coopérative Agricole de Grande-Terre',
  lastInspection: '2023-11-15',
  coordinates: {
    latitude: 16.3312,
    longitude: -61.3844
  },
  images: [
    'parcelle1_vue1.jpg',
    'parcelle1_irrigation.jpg'
  ]
};

const initialTasks: TaskData[] = [
  { 
    id: 1, 
    task: 'Fertilisation de la canne', 
    dueDate: '2023-09-25', 
    assignedTo: 'Jean Dupont', 
    priority: 'Élevée',
    status: 'À faire'
  },
  { 
    id: 2, 
    task: 'Traitement contre la cercosporiose', 
    dueDate: '2023-09-28', 
    assignedTo: 'Marie Lambert', 
    priority: 'Moyenne',
    status: 'En cours'
  },
  { 
    id: 3, 
    task: 'Inspection croissance ananas', 
    dueDate: '2023-09-30', 
    assignedTo: 'Pierre Lafortune', 
    priority: 'Basse',
    status: 'À faire'
  },
  {
    id: 4,
    task: 'Désherbage parcelle madère',
    dueDate: '2023-10-05',
    assignedTo: 'Sophie Martin',
    priority: 'Moyenne',
    status: 'À faire'
  },
  {
    id: 5,
    task: 'Préparation coupe canne',
    dueDate: '2024-01-10',
    assignedTo: 'Jean Dupont',
    priority: 'Élevée',
    status: 'À faire'
  }
];

const taskColumns: Column[] = [
  { id: 'task', header: 'Tâche', accessorKey: 'task', isEditable: true },
  { id: 'assignedTo', header: 'Assigné à', accessorKey: 'assignedTo', isEditable: true },
  { id: 'dueDate', header: 'Date', accessorKey: 'dueDate', isEditable: true, width: '120px' },
  { id: 'priority', header: 'Priorité', accessorKey: 'priority', isEditable: true, width: '120px' },
  { id: 'status', header: 'Statut', accessorKey: 'status', isEditable: true, width: '100px' }
];

const cropColumns: Column[] = [
  { id: 'crop', header: 'Culture', accessorKey: 'crop', isEditable: true },
  { id: 'variety', header: 'Variété', accessorKey: 'variety', isEditable: true },
  { id: 'plantingDate', header: 'Date plantation', accessorKey: 'plantingDate', isEditable: true },
  { id: 'harvestDate', header: 'Date récolte prévue', accessorKey: 'harvestDate', isEditable: true },
  { id: 'status', header: 'Statut', accessorKey: 'status', isEditable: true },
];

const GuadeloupeParcelDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [parcel, setParcel] = useState<ParcelDetail>(parcelData);
  const [tasks, setTasks] = useState<TaskData[]>(initialTasks);
  const [activeTab, setActiveTab] = useState<'info' | 'crops' | 'tasks' | 'stats' | 'layers'>('info');
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleParcelUpdate = (field: keyof ParcelDetail, value: string | number) => {
    setParcel({
      ...parcel,
      [field]: value
    });
    toast.success(`${field} mis à jour`);
  };

  const handleTaskUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedTasks = [...tasks];
    const updatedTask = { ...updatedTasks[rowIndex] };
    
    (updatedTask as any)[columnId] = value;
    updatedTasks[rowIndex] = updatedTask;
    
    setTasks(updatedTasks);
    toast.success('Tâche mise à jour');
  };

  const handleCropUpdate = (rowIndex: number, columnId: string, value: any) => {
    const updatedParcel = { ...parcel };
    const updatedCrops = [...updatedParcel.crops];
    const updatedCrop = { ...updatedCrops[rowIndex] };
    
    (updatedCrop as any)[columnId] = value;
    updatedCrops[rowIndex] = updatedCrop;
    
    updatedParcel.crops = updatedCrops;
    setParcel(updatedParcel);
    toast.success('Culture mise à jour');
  };

  const handleAddTask = (newRow: Record<string, any>) => {
    const newId = Math.max(0, ...tasks.map(t => t.id)) + 1;
    
    const newTask: TaskData = {
      id: newId,
      task: String(newRow.task || ''),
      dueDate: String(newRow.dueDate || new Date().toISOString().split('T')[0]),
      assignedTo: String(newRow.assignedTo || ''),
      priority: (newRow.priority as TaskData['priority']) || 'Moyenne',
      status: (newRow.status as TaskData['status']) || 'À faire'
    };
    
    setTasks([...tasks, newTask]);
    toast.success('Nouvelle tâche ajoutée');
  };

  const handleAddCrop = (newRow: Record<string, any>) => {
    const updatedParcel = { ...parcel };
    
    const newCrop = {
      crop: String(newRow.crop || ''),
      variety: String(newRow.variety || ''),
      plantingDate: String(newRow.plantingDate || new Date().toISOString().split('T')[0]),
      harvestDate: String(newRow.harvestDate || ''),
      status: String(newRow.status || 'Planifié')
    };
    
    updatedParcel.crops = [...updatedParcel.crops, newCrop];
    setParcel(updatedParcel);
    toast.success('Nouvelle culture ajoutée');
  };

  const handleDeleteTask = (rowIndex: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(rowIndex, 1);
    setTasks(updatedTasks);
    toast.success('Tâche supprimée');
  };

  const handleDeleteCrop = (rowIndex: number) => {
    const updatedParcel = { ...parcel };
    const updatedCrops = [...updatedParcel.crops];
    updatedCrops.splice(rowIndex, 1);
    updatedParcel.crops = updatedCrops;
    setParcel(updatedParcel);
    toast.success('Culture supprimée');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <MapPin className="h-6 w-6 mr-2 text-agri-primary" />
              <EditableField
                value={parcel.name}
                onSave={(value) => handleParcelUpdate('name', value)}
                className="inline-block"
              />
            </h2>
            <p className="text-muted-foreground flex items-center mt-1">
              <Map className="h-4 w-4 mr-1.5" />
              <EditableField
                value={parcel.location}
                onSave={(value) => handleParcelUpdate('location', value)}
                className="inline-block"
              />
            </p>
          </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'info' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('info')}
            >
              Informations
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'crops' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('crops')}
            >
              Cultures
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'tasks' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('tasks')}
            >
              Tâches
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'stats' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistiques
            </button>
            <button 
              className={`px-4 py-2 rounded-lg ${activeTab === 'layers' ? 'bg-agri-primary text-white' : 'bg-muted'}`}
              onClick={() => setActiveTab('layers')}
            >
              Couches
            </button>
          </div>
        </div>
        
        {activeTab === 'info' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Superficie</h3>
                <div className="flex items-center">
                  <EditableField
                    value={parcel.surface}
                    type="number"
                    onSave={(value) => handleParcelUpdate('surface', value)}
                    className="text-xl font-bold"
                  />
                  <span className="ml-1 text-xl">ha</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Type de sol</h3>
                <EditableField
                  value={parcel.soilType}
                  onSave={(value) => handleParcelUpdate('soilType', value)}
                  className="text-xl font-bold"
                />
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Dernière inspection</h3>
                <EditableField
                  value={parcel.lastInspection}
                  onSave={(value) => handleParcelUpdate('lastInspection', value)}
                  className="text-xl font-bold"
                />
              </div>
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Système d'irrigation</h3>
              <EditableField
                value={parcel.irrigationSystem}
                onSave={(value) => handleParcelUpdate('irrigationSystem', value)}
                className="text-lg"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
              <EditableField
                value={parcel.notes}
                onSave={(value) => handleParcelUpdate('notes', value)}
                className="text-lg"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Propriétaire</h3>
              <EditableField
                value={parcel.owner}
                onSave={(value) => handleParcelUpdate('owner', value)}
                className="text-lg"
              />
            </div>
            
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Photos de la parcelle</h3>
                <button 
                  className="text-sm flex items-center text-agri-primary hover:text-agri-primary-dark"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Ajouter une photo
                </button>
              </div>
              
              {showImageUpload && (
                <div className="mb-4 p-3 border border-dashed rounded-lg">
                  <div className="flex flex-col items-center justify-center">
                    <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Glissez une image ou cliquez pour parcourir</p>
                    <Input type="file" className="max-w-xs" />
                    <div className="flex space-x-2 mt-2">
                      <button className="px-3 py-1 text-sm bg-agri-primary text-white rounded">Télécharger</button>
                      <button 
                        className="px-3 py-1 text-sm border rounded"
                        onClick={() => setShowImageUpload(false)}
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {parcel.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="h-24 w-full bg-gray-100 rounded flex items-center justify-center border">
                      <span className="text-xs text-muted-foreground">{image}</span>
                    </div>
                    <button className="absolute top-1 right-1 hidden group-hover:flex p-1 bg-red-100 rounded-full text-red-600">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'crops' && (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Cultures sur cette parcelle</h3>
            <EditableTable
              data={parcel.crops}
              columns={cropColumns}
              onUpdate={handleCropUpdate}
              onDelete={handleDeleteCrop}
              onAdd={handleAddCrop}
              className="border-none"
            />
          </div>
        )}
        
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Tâches à venir</h3>
              <Button 
                onClick={() => toast.success('Redirection vers la page des tâches')}
                variant="outline"
                className="text-sm"
              >
                Voir toutes les tâches
              </Button>
            </div>
            
            <EditableTable
              data={tasks}
              columns={taskColumns}
              onUpdate={handleTaskUpdate}
              onDelete={handleDeleteTask}
              onAdd={handleAddTask}
              className="border-none"
              actions={[
                {
                  icon: <Check className="h-4 w-4 text-green-600" />,
                  label: "Marquer comme terminée",
                  onClick: (rowIndex) => {
                    toast.success(`Tâche "${tasks[rowIndex].task}" marquée comme terminée`);
                    const updatedTasks = [...tasks];
                    updatedTasks[rowIndex].status = 'Terminée';
                    setTasks(updatedTasks);
                  }
                }
              ]}
            />
          </div>
        )}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg></span>
            <h3 className="text-xl font-bold tracking-wide text-blue-900">Statistiques de la parcelle</h3>
          </div>
          {/* Mini-graphique dynamique */}
          <div className="bg-white border border-blue-100 rounded-xl p-4 mb-4 shadow-sm">
            <h4 className="font-semibold mb-2 text-blue-700 flex items-center gap-2"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg> Répartition des cultures par variété</h4>
            <div className="w-full max-w-xs mx-auto">
              <AgriChart
                type="bar"
                data={{
                  labels: Array.from(new Set(parcel.crops.map(c => c.variety))),
                  datasets: [
                    {
                      label: 'Nombre de cultures',
                      data: Array.from(new Set(parcel.crops.map(c => c.variety))).map(
                        v => parcel.crops.filter(c => c.variety === v).length
                      ),
                    },
                  ],
                }}
                title=""
                darkMode={false}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1 text-blue-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg> Semences</h4>
              <ul className="text-sm space-y-1">
                {parcel.crops.map((c, i) => (
                  <li key={c.crop + c.variety + c.plantingDate} className="flex items-center gap-2"><span className="font-medium text-blue-800">{c.crop}</span> <span className="bg-blue-200 text-blue-900 rounded px-2 py-0.5 text-xs">{c.variety}</span> <span className="text-xs text-blue-600">semé le {c.plantingDate}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1 text-green-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg> Production</h4>
              <ul className="text-sm space-y-1">
                {parcel.crops.map((c, i) => (
                  <li key={c.crop + c.variety + c.status} className="flex items-center gap-2"><span className="font-medium text-green-800">{c.crop}</span> <span className="bg-green-200 text-green-900 rounded px-2 py-0.5 text-xs">{c.variety}</span> <span className="text-xs text-green-600">statut {c.status}</span></li>
                ))}
              </ul>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1 text-yellow-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M4 17l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> Récolte</h4>
              <ul className="text-sm space-y-1">
                {parcel.crops.map((c, i) => (
                  <li key={c.crop + c.variety + c.harvestDate} className="flex items-center gap-2"><span className="font-medium text-yellow-800">{c.crop}</span> <span className="bg-yellow-200 text-yellow-900 rounded px-2 py-0.5 text-xs">{c.variety}</span> <span className="text-xs text-yellow-600">récolte prévue {c.harvestDate}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'layers' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 text-purple-600"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg></span>
            <h3 className="text-xl font-bold tracking-wide text-purple-900">Couches : Sol &amp; Climat</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1 text-purple-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg> Caractéristiques du sol</h4>
              <ul className="text-sm space-y-1">
                <li><span className="font-medium">Type de sol :</span> <span className="bg-purple-200 text-purple-900 rounded px-2 py-0.5 text-xs">{parcel.soilType}</span></li>
                <li><span className="font-medium">Superficie :</span> <span className="bg-purple-100 text-purple-800 rounded px-2 py-0.5 text-xs">{parcel.surface} ha</span></li>
                <li><span className="font-medium">Irrigation :</span> <span className="bg-purple-100 text-purple-800 rounded px-2 py-0.5 text-xs">{parcel.irrigationSystem}</span></li>
              </ul>
            </div>
            <div className="bg-pink-50 border border-pink-200 p-4 rounded-xl shadow-sm">
              <h4 className="font-semibold mb-2 flex items-center gap-1 text-pink-700"><svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/></svg> Climat de la zone</h4>
              <ul className="text-sm space-y-1">
                <li><span className="font-medium">Localisation :</span> <span className="bg-pink-100 text-pink-800 rounded px-2 py-0.5 text-xs">{parcel.location}</span></li>
                <li><span className="font-medium">Dernière inspection :</span> <span className="bg-pink-100 text-pink-800 rounded px-2 py-0.5 text-xs">{parcel.lastInspection}</span></li>
                <li><span className="font-medium">Notes :</span> <span className="bg-pink-100 text-pink-800 rounded px-2 py-0.5 text-xs">{parcel.notes}</span></li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuadeloupeParcelDetail;
