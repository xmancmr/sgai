
import React from 'react';
import PageLayout from '../components/layout/PageLayout';
import FinancialDashboard from '../components/finance/FinancialDashboard';
import { Toaster } from '@/components/ui/sonner';

const FinancePage = () => {
  return (
    <PageLayout>
      <FinancialDashboard />
      <Toaster />
    </PageLayout>
  );
};

export default FinancePage;
