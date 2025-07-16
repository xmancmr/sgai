
import React from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface MonthlyOverviewChartProps {
  monthlyData: { name: string; income: number; expenses: number }[];
}

const cardVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" }
  }
};

export const MonthlyOverviewChart: React.FC<MonthlyOverviewChartProps> = ({ monthlyData }) => (
  <motion.div
    variants={cardVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.22 }}
    className="w-full"
  >
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Aperçu Mensuel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={monthlyData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`${value} €`, '']} 
                labelFormatter={(label) => `Mois: ${label}`}
              />
              <Bar name="Revenus" dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} />
              <Bar name="Dépenses" dataKey="expenses" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);
