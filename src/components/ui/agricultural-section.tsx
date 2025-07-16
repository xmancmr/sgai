
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgriculturalSectionProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  headerActions?: React.ReactNode;
}

export const AgriculturalSection: React.FC<AgriculturalSectionProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className,
  headerActions
}) => {
  return (
    <section className={cn(
      "rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden",
      "dark:bg-gray-800 dark:border-gray-700",
      className
    )}>
      {/* Header */}
      <div className="px-4 md:px-6 py-4 md:py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                <Icon className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            )}
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h2>
              {description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="flex items-center gap-2">
              {headerActions}
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </section>
  );
};
