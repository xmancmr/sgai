
import React from "react";
import { motion } from "framer-motion";
import PageLayout from "../components/layout/PageLayout";
import TabContainer, { TabItem } from "../components/layout/TabContainer";
import ReportsMainTab from "../components/reports/ReportsMainTab";
import AiAdvisorTab from "../components/reports/AiAdvisorTab";
import ImpactResultsTab from "../components/reports/ImpactResultsTab";
import SettingsTab from "../components/reports/SettingsTab";
import { Sparkles, Settings } from "lucide-react";
import { useLocation } from "react-router-dom";

const RapportsPage = () => {
  const location = useLocation();
  const isSettingsPage = location.pathname === '/parametres';

  const defaultValue = isSettingsPage ? 'parametres' : 'conseils';
  const pageTitle = isSettingsPage ? 'Paramètres' : 'Conseils & Rapports';
  const PageIcon = isSettingsPage ? Settings : Sparkles;

  const allTabs: TabItem[] = [
    {
      value: "conseils",
      label: "Pour vous",
      content: <AiAdvisorTab />
    },
    {
      value: "resultats",
      label: "Résultats & Impact",
      content: <ImpactResultsTab />
    },
    {
      value: "rapports",
      label: "Rapports",
      content: <ReportsMainTab />
    },
    {
      value: "parametres",
      label: "Paramètres",
      content: <SettingsTab />
    }
  ];

  const tabs = isSettingsPage
    ? allTabs.filter(tab => tab.value === 'parametres')
    : allTabs.filter(tab => tab.value !== 'parametres');

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-2">
          <PageIcon className="h-6 w-6 text-agri-primary" />
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
        </div>
        
        <TabContainer
          tabs={tabs}
          defaultValue={defaultValue}
        />
      </motion.div>
    </PageLayout>
  );
};

export default RapportsPage;
