
import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgriculturalStatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'stable';
  icon: LucideIcon;
  iconColor?: string;
  description?: string;
  className?: string;
  onClick?: () => void;
}

export const AgriculturalStatCard: React.FC<AgriculturalStatCardProps> = ({
  title,
  value,
  change,
  changeType = 'stable',
  icon: Icon,
  iconColor = 'text-green-600',
  description,
  className,
  onClick
}) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-gray-100",
        "hover:shadow-md transition-all duration-200 cursor-pointer",
        "dark:bg-gray-800 dark:border-gray-700",
        className
      )}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/30 to-emerald-50/50 opacity-50 dark:from-gray-800 dark:via-green-900/10 dark:to-emerald-900/20" />
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors dark:bg-green-900/30">
              <Icon className={cn("h-6 w-6", iconColor)} />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                {title}
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
            </div>
          </div>
          
          {change !== undefined && (
            <div className="flex items-center gap-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {Math.abs(change)}%
              </span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};
