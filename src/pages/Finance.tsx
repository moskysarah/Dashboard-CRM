// src/pages/Finance.tsx
import React from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "../layouts/dashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFinanceData } from "../hooks/useFinanceData";

const Finance: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error } = useFinanceData();

  if (loading) return <DashboardLayout><p className="p-6">{t("loading_transactions")}</p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-3">{t("finance")}</h1>
        <p className="text-gray-600 mb-6">{t("finance_transactions_overview")}</p>

        {/* Cartes résumé */}
        <div className="flex gap-6 mb-6">
          <div className="flex-1 p-4 bg-green-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("total_revenue")}</h2>
            <p className="text-2xl font-bold text-green-700">{data?.totalRevenu ?? 0} $</p>
          </div>
          <div className="flex-1 p-4 bg-red-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("total_expenses")}</h2>
            <p className="text-2xl font-bold text-red-700">{data?.totalDepense ?? 0} $</p>
          </div>
          <div className="flex-1 p-4 bg-blue-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold">{t("balance")}</h2>
            <p className="text-2xl font-bold text-blue-700">{data?.solde ?? 0} $</p>
          </div>
        </div>

        {/* Graphique */}
        <div className="w-full h-96 mb-6 bg-white rounded-2xl shadow-lg p-4">
          <ResponsiveContainer>
            <BarChart data={data?.chartData ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenu" fill="#4F46E5" name={t("revenue")} />
              <Bar dataKey="depense" fill="#EF4444" name={t("expenses")} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Finance;
