import React, { useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import PageHeader from '../components/layout/PageHeader';
import TabContainer, { TabItem } from '../components/layout/TabContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Download, Upload, RefreshCw, Settings } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import usePageMetadata from '../hooks/use-page-metadata';

const SettingsPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('personal');
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    title, 
    description, 
    handleTitleChange, 
    handleDescriptionChange 
  } = usePageMetadata({
    defaultTitle: 'Paramètres et Configuration',
    defaultDescription: 'Gérez vos paramètres personnels, informations agricoles et préférences système'
  });

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Paramètres sauvegardés",
        description: "Vos paramètres ont été mis à jour avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur s'est produite lors de la sauvegarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      exportDate: new Date().toISOString(),
      version: "1.0.0",
      settings: {
        personal: {},
        location: {},
        agricultural: {},
        budget: {},
        notifications: {}
      }
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `agri-dom-settings-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Paramètres exportés",
      description: "Vos paramètres ont été exportés avec succès.",
    });
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const settings = JSON.parse(e.target?.result as string);
            console.log('Imported settings:', settings);
            toast({
              title: "Paramètres importés",
              description: "Vos paramètres ont été importés avec succès.",
            });
          } catch (error) {
            toast({
              title: "Erreur d'importation",
              description: "Le fichier de paramètres n'est pas valide.",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const renderTabActions = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleSaveSettings}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Sauvegarder
        </Button>
        <Button
          variant="outline"
          onClick={handleExportSettings}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter
        </Button>
        <Button
          variant="outline"
          onClick={handleImportSettings}
          className="flex items-center gap-2"
        >
          <Upload className="h-4 w-4" />
          Importer
        </Button>
      </div>
    );
  };

  const tabs: TabItem[] = [
    {
      value: 'personal',
      label: 'Informations Personnelles',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations Personnelles</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  <Input id="firstName" placeholder="Votre prénom" />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  <Input id="lastName" placeholder="Votre nom" />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre.email@example.com" />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" placeholder="+33 1 23 45 67 89" />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'location',
      label: 'Localisation',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Localisation de l'Exploitation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" placeholder="123 Rue de l'Agriculture" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">Ville</Label>
                  <Input id="city" placeholder="Ville" />
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  <Input id="postalCode" placeholder="12345" />
                </div>
              </div>
              <div>
                <Label htmlFor="region">Région</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une région" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guadeloupe">Guadeloupe</SelectItem>
                    <SelectItem value="martinique">Martinique</SelectItem>
                    <SelectItem value="guyane">Guyane</SelectItem>
                    <SelectItem value="reunion">Réunion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'agricultural',
      label: 'Informations Agricoles',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Exploitation Agricole</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="farmName">Nom de l'exploitation</Label>
                <Input id="farmName" placeholder="Nom de votre exploitation" />
              </div>
              <div>
                <Label htmlFor="farmType">Type d'exploitation</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type d'exploitation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cereales">Céréales</SelectItem>
                    <SelectItem value="legumes">Légumes</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="elevage">Élevage</SelectItem>
                    <SelectItem value="mixte">Mixte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="farmSize">Superficie (hectares)</Label>
                <Input id="farmSize" type="number" placeholder="100" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Décrivez votre exploitation..." />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'budget',
      label: 'Budget et Finances',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration Budgétaire</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currency">Devise</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une devise" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eur">EUR (Euro)</SelectItem>
                    <SelectItem value="fcfa">FCFA (Franc CFA)</SelectItem>
                    <SelectItem value="usd">USD (Dollar américain)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="annualBudget">Budget annuel (FCFA)</Label>
                <Input id="annualBudget" type="number" placeholder="1000000" />
              </div>
              <div>
                <Label htmlFor="taxRate">Taux de TVA (%)</Label>
                <Input id="taxRate" type="number" placeholder="20" />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    },
    {
      value: 'notifications',
      label: 'Notifications',
      content: (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Préférences de Notification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les alertes par email</p>
                </div>
                <Switch id="emailNotifications" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="stockAlerts">Alertes de stock</Label>
                  <p className="text-sm text-muted-foreground">Notifications pour les niveaux de stock bas</p>
                </div>
                <Switch id="stockAlerts" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weatherAlerts">Alertes météo</Label>
                  <p className="text-sm text-muted-foreground">Notifications météorologiques importantes</p>
                </div>
                <Switch id="weatherAlerts" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="taskReminders">Rappels de tâches</Label>
                  <p className="text-sm text-muted-foreground">Rappels pour les tâches agricoles</p>
                </div>
                <Switch id="taskReminders" />
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
  ];

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <PageLayout>
      <div className="p-3 sm:p-6 animate-enter">
        <PageHeader 
          title={title}
          description={description}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          actions={renderTabActions()}
          icon={<Settings className="h-6 w-6" />}
        />

        <TabContainer 
          tabs={tabs} 
          defaultValue={activeTab} 
          onValueChange={handleTabChange} 
        />
      </div>
    </PageLayout>
  );
};

export default SettingsPage;