
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { EditableField } from '../ui/editable-field';

interface InventoryAlert {
  id: number;
  name: string;
  current: number;
  min: number;
  status: 'critical' | 'warning';
}

interface InventoryAlertsProps {
  alerts: InventoryAlert[];
  onQuantityChange: (id: number, field: string, value: any) => void;
}

const InventoryAlerts: React.FC<InventoryAlertsProps> = ({ alerts, onQuantityChange }) => {
  if (alerts.length === 0) return null;
  
  return (
    <div className="mb-6 border border-agri-warning/30 bg-agri-warning/5 rounded-xl p-6 animate-enter shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="h-6 w-6 text-agri-warning mr-3" />
          <h3 className="font-semibold text-lg text-gray-800">Alertes de stock bas</h3>
        </div>
        <div className="bg-agri-warning/10 px-3 py-1 rounded-full">
          <span className="text-sm font-medium text-agri-warning">
            {alerts.length} alerte{alerts.length > 1 ? 's' : ''}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {alerts.map(alert => (
          <div 
            key={alert.id} 
            className={`p-4 rounded-lg border-2 shadow-sm transition-all hover:shadow-md ${
              alert.status === 'critical' 
                ? 'border-agri-danger/40 bg-agri-danger/5' 
                : 'border-agri-warning/40 bg-agri-warning/5'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">{alert.name}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.status === 'critical' ? 'bg-agri-danger' : 'bg-agri-warning'
                  }`} />
                  <span className="text-xs text-gray-600 font-medium">
                    {alert.status === 'critical' ? 'Stock critique' : 'Stock faible'}
                  </span>
                </div>
              </div>
              <span 
                className={`text-xs px-2 py-1 rounded-full font-medium ${
                  alert.status === 'critical' 
                    ? 'bg-agri-danger/15 text-agri-danger border border-agri-danger/20' 
                    : 'bg-agri-warning/15 text-agri-warning border border-agri-warning/20'
                }`}
              >
                {alert.status === 'critical' ? 'Critique' : 'Attention'}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Stock actuel:</span>
                <EditableField
                  value={alert.current}
                  type="number"
                  onSave={(value) => onQuantityChange(alert.id, 'quantity', Number(value))}
                  className="text-right font-medium"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Minimum requis:</span>
                <EditableField
                  value={alert.min}
                  type="number"
                  onSave={(value) => onQuantityChange(alert.id, 'minQuantity', Number(value))}
                  className="text-right font-medium"
                />
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Pourcentage restant:</span>
                  <span className={`text-xs font-bold ${
                    alert.status === 'critical' ? 'text-agri-danger' : 'text-agri-warning'
                  }`}>
                    {Math.round((alert.current / alert.min) * 100)}%
                  </span>
                </div>
                <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      alert.status === 'critical' ? 'bg-agri-danger' : 'bg-agri-warning'
                    }`}
                    style={{ width: `${Math.min(100, (alert.current / alert.min) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryAlerts;
