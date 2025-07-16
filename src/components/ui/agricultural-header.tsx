
import React from 'react';
import { Wheat, Sprout, Sun, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgriculturalHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  showIcons?: boolean;
}

export const AgriculturalHeader: React.FC<AgriculturalHeaderProps> = ({
  title,
  subtitle,
  className,
  showIcons = true
}) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-6 md:p-8",
      "border border-green-100 shadow-sm",
      "dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 dark:border-green-800",
      className
    )}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 text-green-600">
          <Wheat className="h-16 w-16 rotate-12" />
        </div>
        <div className="absolute top-8 right-8 text-emerald-600">
          <Sprout className="h-12 w-12 -rotate-12" />
        </div>
        <div className="absolute bottom-4 left-1/3 text-yellow-600">
          <Sun className="h-14 w-14 rotate-45" />
        </div>
        <div className="absolute bottom-6 right-1/4 text-blue-600">
          <Droplets className="h-10 w-10 -rotate-12" />
        </div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-2">
          {showIcons && (
            <div className="flex gap-2">
              <div className="p-2 bg-green-100 rounded-lg dark:bg-green-800/30">
                <Wheat className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg dark:bg-emerald-800/30">
                <Sprout className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>
        </div>
        {subtitle && (
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};
