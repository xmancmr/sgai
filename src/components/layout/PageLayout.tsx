
import React, { ReactNode } from 'react';
import Navbar from '../Navbar';
import { useIsMobile } from '@/hooks/use-mobile';

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col md:flex-row min-h-screen overflow-hidden bg-background">
      <Navbar />
      <main className="flex-1 overflow-auto pb-20 md:pb-0 min-w-0">
        <div className={`w-full px-3 sm:px-4 lg:px-8 py-4 sm:py-6 ${isMobile ? 'pt-20' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default PageLayout;
