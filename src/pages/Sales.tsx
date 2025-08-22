// src/pages/Sales.tsx
import { useState, useMemo } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Sales() {
  // un exemple de données de suivi des ventes par mois
  const [salesData] = useState([
    { month: "Jan", ventes: 1200 },
    { month: "Fév", ventes: 2100 },
    { month: "Mar", ventes: 1800 },
    { month: "Avr", ventes: 2500 },
    { month: "Mai", ventes: 3000 },
    { month: "Juin", ventes: 2700 },
    { month: "Juil", ventes: 3500 },
    { month: "Août", ventes: 4000 },
    { month: "Sept", ventes: 3800 },
    { month: "Oct", ventes: 4200 },
    { month: "Nov", ventes: 4600 },
    { month: "Déc", ventes: 5000 },
  ]);

  // Calculs KPI
  const totalVentes = useMemo(
    () => salesData.reduce((acc, curr) => acc + curr.ventes, 0),
    [salesData]
  );

  const meilleurMois = useMemo(
    () => salesData.reduce((max, curr) => (curr.ventes > max.ventes ? curr : max)),
    [salesData]
  );

  const croissance = useMemo(() => {
    const last = salesData[salesData.length - 1].ventes;
    const prev = salesData[salesData.length - 2].ventes;
    return (((last - prev) / prev) * 100).toFixed(1);
  }, [salesData]);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Ventes</h1>
      <p className="text-gray-600 mb-6">Statistiques et suivi des ventes mensuelles.</p>

      {/* KPI Rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Total annuel</h3>
          <p className="text-2xl font-bold text-blue-600">{totalVentes} €</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Meilleur mois</h3>
          <p className="text-2xl font-bold text-green-600">
            {meilleurMois.month} ({meilleurMois.ventes} €)
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-sm text-gray-500">Croissance</h3>
          <p
            className={`text-2xl font-bold ${
              parseFloat(croissance) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {croissance} %
          </p>
        </div>
      </div>

      {/* Graphique */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="text-xl font-semibold mb-4">Suivi des ventes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="ventes" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </DashboardLayout>
  );
}
