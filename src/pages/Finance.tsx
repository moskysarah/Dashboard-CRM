// src/pages/Finance.tsx
import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type FinanceTransaction = {
  id: string;
  type: "revenu" | "dépense";
  amount: number;
  description: string;
  date: string;
};

// un exemple de données simulées
const sampleTransactions: FinanceTransaction[] = [
  { id: "1", type: "revenu", amount: 500, description: "Location espace", date: "2025-08-19" },
  { id: "2", type: "dépense", amount: 200, description: "Achat fournitures", date: "2025-08-18" },
  { id: "3", type: "revenu", amount: 300, description: "Service extra", date: "2025-08-18" },
  { id: "4", type: "dépense", amount: 150, description: "Maintenance", date: "2025-08-17" },
];

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);

  useEffect(() => {
    setTransactions(sampleTransactions);
  }, []);

  const totalRevenu = transactions.filter(t => t.type === "revenu").reduce((sum, t) => sum + t.amount, 0);
  const totalDepense = transactions.filter(t => t.type === "dépense").reduce((sum, t) => sum + t.amount, 0);
  const solde = totalRevenu - totalDepense;

  const chartData = transactions.map(t => ({
    name: t.date,
    revenu: t.type === "revenu" ? t.amount : 0,
    depense: t.type === "dépense" ? t.amount : 0,
  }));

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Finance</h1>

        <div className="flex gap-6 mb-6">
          <div className="flex-1 p-4 bg-green-100 rounded">
            <h2 className="text-lg font-semibold">Total Revenu</h2>
            <p className="text-2xl font-bold text-green-700">{totalRevenu} $</p>
          </div>
          <div className="flex-1 p-4 bg-red-100 rounded">
            <h2 className="text-lg font-semibold">Total Dépense</h2>
            <p className="text-2xl font-bold text-red-700">{totalDepense} $</p>
          </div>
          <div className="flex-1 p-4 bg-blue-100 rounded">
            <h2 className="text-lg font-semibold">Solde</h2>
            <p className="text-2xl font-bold text-blue-700">{solde} $</p>
          </div>
        </div>

        <div className="w-full h-96 mb-6">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenu" fill="#4F46E5" />
              <Bar dataKey="depense" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <h2 className="text-xl font-bold mb-4">Transactions récentes</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="py-2 px-4 text-center">Date</th>
              <th className="py-2 px-4 text-center">Description</th>
              <th className="py-2 px-4 text-center">Type</th>
              <th className="py-2 px-4 text-center">Montant</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 text-center">{tx.date}</td>
                <td className="py-2 px-4 text-center">{tx.description}</td>
                <td className={`py-2 px-4 text-center ${tx.type === "revenu" ? "text-green-500" : "text-red-500"}`}>
                  {tx.type}
                </td>
                <td className="py-2 px-4 text-center">{tx.amount} $</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
