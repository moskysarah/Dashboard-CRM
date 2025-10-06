// src/pages/Finance.tsx
import React, { useState, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/dashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";

type FinanceTransaction = {
  id: string;
  type: "revenu" | "dépense";
  amount: number;
  description: string;
  date: string;
};

const Finance: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/finance", {
          params: { role: user?.role },
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Erreur fetching finance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  if (loading) return <p className="p-6">{t("loading_transactions")}</p>;

  const totalRevenu = transactions
    .filter((t) => t.type === "revenu")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDepense = transactions
    .filter((t) => t.type === "dépense")
    .reduce((sum, t) => sum + t.amount, 0);

  const solde = totalRevenu - totalDepense;

  const chartData = transactions.map((t) => ({
    name: t.date,
    revenu: t.type === "revenu" ? t.amount : 0,
    depense: t.type === "dépense" ? t.amount : 0,
  }));

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-3">{t("finance")}</h1>
        <p className="text-gray-600 mb-6">{t("finance_transactions_overview")}</p>

        {/* Cartes résumé */}
        <div className="flex gap-6 mb-6">
          <div className="flex-1 p-4 bg-green-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("total_revenue")}</h2>
            <p className="text-2xl font-bold text-green-700">{totalRevenu} $</p>
          </div>
          <div className="flex-1 p-4 bg-red-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("total_expenses")}</h2>
            <p className="text-2xl font-bold text-red-700">{totalDepense} $</p>
          </div>
          <div className="flex-1 p-4 bg-blue-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("balance")}</h2>
            <p className="text-2xl font-bold text-blue-700">{solde} $</p>
          </div>
        </div>

        {/* Graphique */}
        <div className="w-full h-96 mb-6 bg-white rounded-2xl shadow-lg p-4">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenu" fill="#4F46E5" name={t("revenue")} />
              <Bar dataKey="depense" fill="#EF4444" name={t("expenses")} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions récentes */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">{t("recent_transactions")}</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-white">
                <th className="py-2 px-4 text-center">{t("date")}</th>
                <th className="py-2 px-4 text-center">{t("description")}</th>
                <th className="py-2 px-4 text-center">{t("type")}</th>
                <th className="py-2 px-4 text-center">{t("amount")}</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 text-center">{tx.date}</td>
                  <td className="py-2 px-4 text-center">{tx.description}</td>
                  <td
                    className={`py-2 px-4 text-center ${
                      tx.type === "revenu" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {tx.type}
                  </td>
                  <td className="py-2 px-4 text-center">{tx.amount} $</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Finance;
