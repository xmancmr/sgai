
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { MapPin } from 'lucide-react';
import { UserSettings } from '../reports/SettingsTab';

interface LocationInformationProps {
  values: UserSettings;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const LocationInformation: React.FC<LocationInformationProps> = ({ values, errors, handleChange, handleBlur }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <MapPin className="h-5 w-5 mr-2 text-green-600" />
          Localisation (pour les alertes météo automatiques)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="country">Pays</Label>
            <Input id="country" name="country" value={values.country} onChange={handleChange} onBlur={handleBlur} placeholder="France" />
          </div>
          <div>
            <Label htmlFor="region">Région</Label>
            <Input id="region" name="region" value={values.region} onChange={handleChange} onBlur={handleBlur} placeholder="Guadeloupe" />
          </div>
          <div>
            <Label htmlFor="department">Département</Label>
            <Input id="department" name="department" value={values.department} onChange={handleChange} onBlur={handleBlur} placeholder="971" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">Ville *</Label>
            <Input id="city" name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} className={errors.city ? 'border-red-500' : ''} placeholder="Pointe-à-Pitre" />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>
          <div>
            <Label htmlFor="arrondissement">Arrondissement</Label>
            <Input id="arrondissement" name="arrondissement" value={values.arrondissement} onChange={handleChange} onBlur={handleBlur} placeholder="Pointe-à-Pitre" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postalCode">Code postal</Label>
            <Input id="postalCode" name="postalCode" value={values.postalCode} onChange={handleChange} onBlur={handleBlur} placeholder="97110" />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Adresse complète</Label>
          <Textarea id="address" name="address" value={values.address} onChange={handleChange} onBlur={handleBlur} rows={2} placeholder="123 Rue de la Plantation, Quartier..." />
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationInformation;
