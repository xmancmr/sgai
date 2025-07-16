
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { CreditCard, Euro } from 'lucide-react';
import { UserSettings } from '../reports/SettingsTab';

interface BudgetInformationProps {
  values: UserSettings;
  errors: Record<string, string>;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BudgetInformation: React.FC<BudgetInformationProps> = ({ values, errors, handleChange, handleBlur }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
          Allocation budgétaire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="monthlyBudget">Budget mensuel global *</Label>
            <Input
              id="monthlyBudget"
              name="monthlyBudget"
              type="number"
              value={values.monthlyBudget}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.monthlyBudget ? 'border-red-500' : ''}
              placeholder="1000"
            />
            {errors.monthlyBudget && <p className="text-red-500 text-sm mt-1">{errors.monthlyBudget}</p>}
          </div>
          <div>
            <Label htmlFor="currency">Devise</Label>
            <select
              id="currency"
              name="currency"
              value={values.currency}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full h-10 px-3 py-2 border rounded-md border-gray-200"
            >
              <option value="EUR">Euro (€)</option>
              <option value="USD">Dollar américain ($)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="equipmentBudget">Budget équipement</Label>
            <Input
              id="equipmentBudget"
              name="equipmentBudget"
              type="number"
              value={values.equipmentBudget}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="300"
            />
          </div>
          <div>
            <Label htmlFor="seedsBudget">Budget semences</Label>
            <Input
              id="seedsBudget"
              name="seedsBudget"
              type="number"
              value={values.seedsBudget}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="200"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <Label htmlFor="fertilizerBudget">Budget fertilisants</Label>
                <Input
                  id="fertilizerBudget"
                  name="fertilizerBudget"
                  type="number"
                  value={values.fertilizerBudget}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="150"
                />
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BudgetInformation;
