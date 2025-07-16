
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { Mail } from 'lucide-react';
import { UserSettings } from '../reports/SettingsTab';

interface NotificationPreferencesProps {
  values: UserSettings;
  setFieldValue: (field: keyof UserSettings, value: any) => void;
}

const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ values, setFieldValue }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Mail className="h-5 w-5 mr-2 text-orange-600" />
          Préférences de notification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="weatherAlerts"
              checked={values.weatherAlerts}
              onCheckedChange={(checked) => setFieldValue('weatherAlerts', checked)}
            />
            <Label htmlFor="weatherAlerts">Alertes météorologiques automatiques</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="emailNotifications"
              checked={values.emailNotifications}
              onCheckedChange={(checked) => setFieldValue('emailNotifications', checked)}
            />
            <Label htmlFor="emailNotifications">Notifications par email</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="smsNotifications"
              checked={values.smsNotifications}
              onCheckedChange={(checked) => setFieldValue('smsNotifications', checked)}
            />
            <Label htmlFor="smsNotifications">Notifications par SMS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="advisorNotifications"
              checked={values.advisorNotifications}
              onCheckedChange={(checked) => setFieldValue('advisorNotifications', checked)}
            />
            <Label htmlFor="advisorNotifications">Conseils personnalisés de l'IA</Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationPreferences;
