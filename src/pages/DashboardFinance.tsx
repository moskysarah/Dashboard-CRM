// src/pages/DashboardFinanceSales.tsx
import React from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { useFinanceData } from "../hooks/useFinanceData";
import { useSalesData } from "../hooks/useSalesData";
import { useAnalytics } from "../hooks/useAnalyticsData";
import TimeseriesChart from "../components/timeSeriesChart";
import StatusChart from "../components/statusChart";
import ActiveUsersList from "../components/activeUsersList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { LineChart, Line } from "recharts";
import T from "../components/translatespace";

const DashboardFinanceSales: React.FC = () => {
  const { data: finance, loading: financeLoading, error: financeError } = useFinanceData();
  const { data: salesData, loading: salesLoading, error: salesError } = useSalesData();
  const { timeseries, statusData, activeUsers, loading: analyticsLoading, error: analyticsError } = useAnalytics();

  const loading = financeLoading || salesLoading || analyticsLoading;
  const error = financeError || salesError || analyticsError;

  // KPI ventes
  const totalVentes = salesData?.reduce((acc, curr) => acc + curr.ventes, 0) ?? 0;
  const meilleurMois = salesData?.reduce((max, curr) => (curr.ventes > max.ventes ? curr : max), salesData[0] || { month: "", ventes: 0 }) ?? { month: "", ventes: 0 };
  const croissance = salesData && salesData.length > 1
    ? (((salesData[salesData.length - 1].ventes - salesData[salesData.length - 2].ventes) / salesData[salesData.length - 2].ventes) * 100).toFixed(1)
    : "0";

  if (loading) return <DashboardLayout><p className="p-6"><T>Chargement des données...</T></p></DashboardLayout>;
  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 min-h-[calc(100vh-80px)] space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold mb-4"><T>Finance & Ventes</T></h1>

        {/* ================= KPI Finance ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-green-100 p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Total Revenu</T></h2>
            <p className="text-2xl font-bold text-green-700">{finance?.totalRevenu ?? 0} $</p>
          </div>
          <div className="bg-red-100 p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Total Dépenses</T></h2>
            <p className="text-2xl font-bold text-red-700">{finance?.totalDepense ?? 0} $</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Solde</T></h2>
            <p className="text-2xl font-bold text-blue-700">{finance?.solde ?? 0} $</p>
          </div>
        </div>

        {/* ================= KPI Ventes ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Total Ventes</T></h2>
            <p className="text-2xl font-bold text-blue-600">{totalVentes} €</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Meilleur Mois</T></h2>
            <p className="text-2xl font-bold text-green-600">{meilleurMois.month} ({meilleurMois.ventes} €)</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Croissance</T></h2>
            <p className={`text-2xl font-bold ${parseFloat(croissance) >= 0 ? "text-green-600" : "text-red-600"}`}>
              {croissance} %
            </p>
          </div>
        </div>

        {/* ================= Graphique Finance ================= */}
        <div className="bg-white p-4 rounded-2xl shadow w-full mt-4">
          <h2 className="text-lg font-semibold mb-3"><T>Transactions Finance</T></h2>
          <div className="w-full h-64 md:h-96">
            <ResponsiveContainer>
              <BarChart data={finance?.chartData ?? []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenu" fill="#4F46E5" name="Revenu" />
                <Bar dataKey="depense" fill="#EF4444" name="Dépense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= Graphique Ventes ================= */}
        <div className="bg-white p-4 rounded-2xl shadow w-full mt-4">
          <h2 className="text-lg font-semibold mb-3"><T>Suivi des ventes mensuelles</T></h2>
          <div className="w-full h-64 md:h-96">
            <ResponsiveContainer>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ventes" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ================= Timeseries Chart ================= */}
        <TimeseriesChart data={timeseries} title="Suivi des Transactions" />

        {/* ================= Status Chart ================= */}
        <StatusChart data={statusData} title="Répartition par Statut" />

        {/* ================= Active Users ================= */}
        <ActiveUsersList users={activeUsers} />
      </div>
    </DashboardLayout>
  );
};

export default DashboardFinanceSales;
