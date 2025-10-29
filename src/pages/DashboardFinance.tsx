// src/pages/DashboardFinance.tsx
import React from "react";
import { useFinanceData } from "../hooks/useFinanceData";
import { useAnalytics } from "../hooks/useAnalyticsData";
import TimeseriesChart from "../components/timeSeriesChart";
import StatusChart from "../components/statusChart";
import ActiveUsersList from "../components/activeUsersList";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const DashboardFinance: React.FC = () => {
  const { data: finance, loading: financeLoading, error: financeError } = useFinanceData();
  const { timeseries, statusData, activeUsers, loading: analyticsLoading, error: analyticsError } = useAnalytics();

  const loading = financeLoading || analyticsLoading;
  const error = financeError || analyticsError;

  if (loading) return <p className="p-6">Chargement des données...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-4 md:p-6 min-h-[calc(100vh-80px)] space-y-6">
      <h1 className="text-2xl md:text-2xl font-semibold mb-4">Tableau de bord-Finance</h1>

      {/* ================= KPI Finance ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-2xl shadow flex flex-col">
          <h2 className="text-sm text-gray-500 mb-1">Total Revenu</h2>
          <p className="text-2xl font-bold text-green-700">{finance?.totalRevenu ?? 0} $</p>
        </div>
        <div className="bg-red-100 p-4 rounded-2xl shadow flex flex-col">
          <h2 className="text-sm text-gray-500 mb-1">Total Dépenses</h2>
          <p className="text-2xl font-bold text-red-700">{finance?.totalDepense ?? 0} $</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-2xl shadow flex flex-col">
          <h2 className="text-sm text-gray-500 mb-1">Solde</h2>
          <p className="text-2xl font-bold text-blue-700">{finance?.solde ?? 0} $</p>
        </div>
      </div>

      {/* ================= Graphique Finance ================= */}
      <div className="bg-white p-4 rounded-2xl shadow w-full mt-4">
        <h2 className="text-lg font-semibold mb-3">Transactions Finance</h2>
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

      {/* ================= Timeseries Chart ================= */}
      <TimeseriesChart data={timeseries} title="Suivi des Transactions" />

      {/* ================= Status Chart ================= */}
      <StatusChart data={statusData} title="Répartition par Statut" />

      {/* ================= Active Users ================= */}
      <ActiveUsersList users={activeUsers} />
    </div>
  );
};

export default DashboardFinance;
