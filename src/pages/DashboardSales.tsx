// src/pages/operations/SalesDashboard.tsx
import React, { useMemo } from "react";
import { useSalesData } from "../hooks/useSalesData";
import { useAnalytics } from "../hooks/useAnalyticsData";
import TimeseriesChart from "../components/timeSeriesChart";
import StatusChart from "../components/statusChart";
import ActiveUsersList from "../components/activeUsersList";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import T from "../components/translatespace";

const DashboardSales: React.FC = () => {
  const { data: salesData, loading: salesLoading, error: salesError } = useSalesData();
  const { timeseries, statusData, activeUsers, loading: analyticsLoading, error: analyticsError } = useAnalytics();

  // KPI Calculations
  const totalVentes = useMemo(() => salesData.reduce((acc, curr) => acc + curr.ventes, 0), [salesData]);
  const meilleurMois = useMemo(
    () => salesData.reduce((max, curr) => (curr.ventes > max.ventes ? curr : max), salesData[0] || { month: "", ventes: 0 }),
    [salesData]
  );
  const croissance = useMemo(() => {
    if (salesData.length < 2) return "0";
    const last = salesData[salesData.length - 1].ventes;
    const prev = salesData[salesData.length - 2].ventes;
    return (((last - prev) / prev) * 100).toFixed(1);
  }, [salesData]);

  if (salesLoading || analyticsLoading) return <p className="p-6"><T>Chargement des données...</T></p>;
  if (salesError || analyticsError) return <p className="p-6 text-red-500">{salesError || analyticsError}</p>;

  return (
   
      <div className="p-4 md:p-6 min-h-[calc(100vh-80px)] space-y-6">

        <h1 className="text-2xl md:text-3xl font-bold mb-4"><T>Ventes</T></h1>

        {/* ===== KPI Résumé ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow flex flex-col">
            <h2 className="text-sm text-gray-500 mb-1"><T>Total Annuel</T></h2>
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

        {/* ===== LineChart Ventes ===== */}
        <div className="bg-white p-4 rounded-2xl shadow w-full">
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

        {/* ===== Timeseries Chart ===== */}
        <TimeseriesChart data={timeseries} title="Suivi des Transactions" />

        {/* ===== Status Chart ===== */}
        <StatusChart data={statusData} title="Répartition par Statut" />

        {/* ===== Active Users ===== */}
        <ActiveUsersList users={activeUsers} />

      </div>
    
  );
};

export default DashboardSales;
