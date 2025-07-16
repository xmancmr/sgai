
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { useFormOperations } from '../../hooks/use-form-operations';
import { toast } from 'sonner';
import { Settings, Shield, Bell, Smartphone } from 'lucide-react';

import PersonalInformation from '../settings/PersonalInformation';
import LocationInformation from '../settings/LocationInformation';
import AgriculturalInformation from '../settings/AgriculturalInformation';
import BudgetInformation from '../settings/BudgetInformation';
import NotificationPreferences from '../settings/NotificationPreferences';

export interface UserSettings {
  // Informations personnelles
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Localisation
  country: string;
  region: string;
  city: string;
  arrondissement: string;
  department: string;
  address: string;
  postalCode: string;
  
  // Agriculture
  farmType: string;
  mainCrops: string[];
  farmSize: number;
  experienceYears: number;
  
  // Budget
  monthlyBudget: number;
  equipmentBudget: number;
  seedsBudget: number;
  fertilizerBudget: number;
  currency: string;
  
  // Préférences
  weatherAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  advisorNotifications: boolean;
}

const SettingsTab = () => {
  const initialValues: UserSettings = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    country: 'Cameroun',
    region: '',
    city: '',
    arrondissement: '',
    department: '',
    address: '',
    postalCode: '',
    farmType: '',
    mainCrops: [],
    farmSize: 0,
    experienceYears: 0,
    monthlyBudget: 0,
    equipmentBudget: 0,
    seedsBudget: 0,
    fertilizerBudget: 0,
    currency: 'FCFA',
    weatherAlerts: true,
    emailNotifications: true,
    smsNotifications: false,
    advisorNotifications: true,
  };

  const validationConfig = {
    firstName: { required: true, minLength: 2 },
    lastName: { required: true, minLength: 2 },
    email: { required: true, isEmail: true },
    phone: { required: true, minLength: 10 },
    city: { required: true },
    farmType: { required: true },
    farmSize: { required: true, isNumber: true, min: 0.1 },
    monthlyBudget: { required: true, isNumber: true, min: 0 },
  };

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    resetForm,
    formRef,
    setAllData
  } = useFormOperations(initialValues, validationConfig);

  // Charger les données depuis localStorage au montage du composant
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        // Fusionner avec les valeurs par défaut pour éviter les champs manquants
        const mergedSettings = { ...initialValues, ...parsedSettings };
        setAllData(mergedSettings);
        console.log('Données utilisateur chargées:', mergedSettings);
      } catch (error) {
        console.error('Erreur lors du chargement des paramètres:', error);
        toast.error('Erreur lors du chargement de vos paramètres');
      }
    }
  }, []);

  const farmTypes = [
    'Agriculture biologique',
    'Agriculture conventionnelle',
    'Agriculture raisonnée',
    'Permaculture',
    'Élevage',
    'Maraîchage',
    'Arboriculture',
    'Viticulture',
    'Céréaliculture'
  ];

  const cropOptions = [
    'Tomates', 'Courgettes', 'Aubergines', 'Poivrons', 'Salade',
    'Carottes', 'Radis', 'Épinards', 'Haricots verts', 'Petits pois',
    'Pommes de terre', 'Oignons', 'Ail', 'Échalotes', 'Persil',
    'Basilic', 'Thym', 'Romarin', 'Coriandre', 'Menthe'
  ];

  const handleCropChange = (crop: string, checked: boolean) => {
    const currentCrops = values.mainCrops || [];
    if (checked) {
      setFieldValue('mainCrops', [...currentCrops, crop]);
    } else {
      setFieldValue('mainCrops', currentCrops.filter(c => c !== crop));
    }
  };

  const onSubmit = async (data: UserSettings) => {
    console.log('Paramètres mis à jour:', data);
    
    try {
      // Sauvegarder dans localStorage
      localStorage.setItem('userSettings', JSON.stringify(data));
      toast.success('Paramètres sauvegardés avec succès !');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde des paramètres');
    }
  };

  const handleReset = () => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        const mergedSettings = { ...initialValues, ...parsedSettings };
        setAllData(mergedSettings);
        toast.info('Paramètres réinitialisés aux dernières valeurs sauvegardées');
      } catch (error) {
        resetForm();
        toast.info('Paramètres réinitialisés aux valeurs par défaut');
      }
    } else {
      resetForm();
      toast.info('Paramètres réinitialisés aux valeurs par défaut');
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* En-tête avec description améliorée */}
      <div className="text-center space-y-4 px-4">
        <div className="flex justify-center">
          <div className="p-3 bg-agri-primary/10 rounded-full">
            <Settings className="h-8 w-8 text-agri-primary" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuration de votre profil agricole</h1>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">
            Personnalisez votre expérience AgriTech en configurant vos informations agricoles, 
            votre localisation et vos préférences de notification pour recevoir des conseils adaptés à votre exploitation.
          </p>
        </div>
      </div>

      {/* Indicateurs de progression */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Sécurisé</h3>
          <p className="text-xs text-muted-foreground">Vos données sont protégées</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Smartphone className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Conseils personnalisés en temps réel</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Bell className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">Alertes Météo</h3>
          <p className="text-xs text-muted-foreground">Notifications automatiques</p>
        </div>
        <div className="bg-card rounded-lg p-4 border border-border text-center">
          <Settings className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm">IA Avancée</h3>
          <p className="text-xs text-muted-foreground">Recommandations intelligentes</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-4">
        <PersonalInformation values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
        <LocationInformation values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
        <AgriculturalInformation
          values={values}
          errors={errors}
          handleChange={handleChange}
          handleBlur={handleBlur}
          handleCropChange={handleCropChange}
          farmTypes={farmTypes}
          cropOptions={cropOptions}
        />
        <BudgetInformation values={values} errors={errors} handleChange={handleChange} handleBlur={handleBlur} />
        <NotificationPreferences values={values} setFieldValue={setFieldValue} />

        {/* Section d'aide et conseils */}
        <div className="bg-gradient-to-r from-agri-primary/5 to-green-50 dark:from-agri-primary/10 dark:to-green-900/20 rounded-xl p-6 border border-agri-primary/20">
          <h3 className="text-lg font-semibold text-agri-primary mb-3">💡 Conseils pour optimiser vos paramètres</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-1">Localisation précise</h4>
              <p>Une localisation exacte permet des alertes météo plus précises et des conseils adaptés à votre micro-climat.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Cultures principales</h4>
              <p>Sélectionnez toutes vos cultures pour recevoir des conseils spécialisés sur la rotation et les associations.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Budget réaliste</h4>
              <p>Un budget précis aide l'IA à proposer des solutions économiquement viables pour votre exploitation.</p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-1">Notifications intelligentes</h4>
              <p>Activez les alertes pour ne jamais manquer les moments critiques de vos cultures.</p>
            </div>
          </div>
        </div>

        {/* Boutons d'action avec design amélioré */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleReset}
            disabled={isSubmitting}
            className="order-2 sm:order-1"
          >
            Réinitialiser
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-agri-primary hover:bg-agri-primary/90 order-1 sm:order-2"
          >
            {isSubmitting ? 'Sauvegarde en cours...' : 'Sauvegarder la configuration'}
          </Button>
        </div>
      </form>

      {/* Footer informatif */}
      <div className="text-center text-xs text-muted-foreground border-t border-border pt-6 px-4">
        <p>
          🔒 Vos informations sont stockées localement et en sécurité. 
          Elles sont utilisées uniquement pour personnaliser vos conseils agricoles.
        </p>
      </div>
    </div>
  );
};

export default SettingsTab;
