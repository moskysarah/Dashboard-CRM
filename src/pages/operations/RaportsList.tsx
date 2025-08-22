// src/pages/Reports.tsx
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { period: "Aujourd'hui", transactions: 35 },
  { period: "Cette semaine", transactions: 120 },
  { period: "Ce mois", transactions: 540 },
];

const ReportsList: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rapports des transactions</h1>
      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="transactions" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ReportsList;
