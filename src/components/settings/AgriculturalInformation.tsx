
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Sprout } from 'lucide-react';
import { UserSettings } from '../reports/SettingsTab';

interface AgriculturalInformationProps {
  values: UserSettings;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleCropChange: (crop: string, checked: boolean) => void;
  farmTypes: string[];
  cropOptions: string[];
}

const AgriculturalInformation: React.FC<AgriculturalInformationProps> = ({
  values,
  errors,
  handleChange,
  handleBlur,
  handleCropChange,
  farmTypes,
  cropOptions,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Sprout className="h-5 w-5 mr-2 text-green-600" />
          Informations agricoles
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="farmType">Type d'agriculture *</Label>
            <select
              id="farmType"
              name="farmType"
              value={values.farmType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full h-10 px-3 py-2 border rounded-md ${errors.farmType ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="">Sélectionnez un type</option>
              {farmTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.farmType && <p className="text-red-500 text-sm mt-1">{errors.farmType}</p>}
          </div>
          <div>
            <Label htmlFor="farmSize">Superficie (hectares) *</Label>
            <Input
              id="farmSize"
              name="farmSize"
              type="number"
              step="0.1"
              value={values.farmSize}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.farmSize ? 'border-red-500' : ''}
              placeholder="1.5"
            />
            {errors.farmSize && <p className="text-red-500 text-sm mt-1">{errors.farmSize}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="experienceYears">Années d'expérience</Label>
          <Input
            id="experienceYears"
            name="experienceYears"
            type="number"
            value={values.experienceYears}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="5"
          />
        </div>
        <div>
          <Label>Cultures principales</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-md p-3">
            {cropOptions.map(crop => (
              <div key={crop} className="flex items-center space-x-2">
                <Checkbox
                  id={crop}
                  checked={values.mainCrops?.includes(crop) || false}
                  onCheckedChange={(checked) => handleCropChange(crop, checked as boolean)}
                />
                <Label htmlFor={crop} className="text-sm">{crop}</Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgriculturalInformation;
