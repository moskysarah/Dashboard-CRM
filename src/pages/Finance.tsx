// src/pages/Finance.tsx
import React from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useFinanceData } from "../hooks/useFinanceData.ts";
import T from "../components/T";

const Finance: React.FC = () => {
  const { data, loading, error } = useFinanceData();

  if (loading) return <DashboardLayout><p className="p-6"><T>loading_transactions</T></p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-3"><T>Finance</T></h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base"><T>Finance_transactions_overview</T></p>

        {/* Cartes résumé */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <div className="p-4 bg-green-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <T>total_revenue</T>
            </h2>
            <p className="text-2xl font-bold text-green-700">{data?.totalRevenu ?? 0} $</p>
          </div>
          <div className="p-4 bg-red-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
              <T>total_expenses</T>
            </h2>
            <p className="text-2xl font-bold text-red-700">{data?.totalDepense ?? 0} $</p>
          </div>
          <div className="p-4 bg-blue-100 rounded-2xl shadow">
            <h2 className="text-lg font-semibold flex items-center">
              <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
              <T>balance</T>
            </h2>
            <p className="text-2xl font-bold text-blue-700">{data?.solde ?? 0} $</p>
          </div>
        </div>

        {/* Graphique */}
        <div className="w-full h-64 md:h-96 mb-6 bg-white rounded-2xl shadow-lg p-4">
          <ResponsiveContainer>
            <BarChart data={data?.chartData ?? []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenu" fill="#4F46E5" name="revenue" />
              <Bar dataKey="depense" fill="#EF4444" name="expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Finance;
