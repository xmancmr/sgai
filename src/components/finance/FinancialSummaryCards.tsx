
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { motion } from "framer-motion";

interface FinancialSummaryCardsProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export const FinancialSummaryCards: React.FC<FinancialSummaryCardsProps> = ({
  totalIncome,
  totalExpenses,
  balance,
}) => (
  <div className="flex flex-col gap-6 w-full">
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Revenus</CardTitle>
          <CardDescription>Total des entrées</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-600">{totalIncome.toFixed(2)} €</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Dépenses</CardTitle>
          <CardDescription>Total des sorties</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-600">{totalExpenses.toFixed(2)} €</p>
        </CardContent>
      </Card>
    </motion.div>
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
    >
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Solde</CardTitle>
          <CardDescription>Revenus - Dépenses</CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {balance.toFixed(2)} €
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </div>
);
