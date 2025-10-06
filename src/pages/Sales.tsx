// src/pages/operations/Sales.tsx
import { useState, useMemo, useEffect } from "react";
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
import api from "../services/api";

// ===== Types =====
type Sale = {
  month: string;
  ventes: number;
};

const Sales: React.FC = () => {
  const [salesData, setSalesData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  // jee recupere les ventes depuis l'API
  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/sales"); //  l’endpoint au backend
        setSalesData(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des ventes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSales();
  }, []);

  const totalVentes = useMemo(
    () => salesData.reduce((acc, curr) => acc + curr.ventes, 0),
    [salesData]
  );

  const meilleurMois = useMemo(
    () =>
      salesData.reduce(
        (max, curr) => (curr.ventes > max.ventes ? curr : max),
        salesData[0] || { month: "", ventes: 0 }
      ),
    [salesData]
  );

  const croissance = useMemo(() => {
    if (salesData.length < 2) return "0";
    const last = salesData[salesData.length - 1].ventes;
    const prev = salesData[salesData.length - 2].ventes;
    return (((last - prev) / prev) * 100).toFixed(1);
  }, [salesData]);

  if (loading) return <p className="p-6">Chargement des ventes...</p>;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-80px)] p-6">
        <h1 className="text-2xl font-bold mb-3">Ventes</h1>
        <p className="text-gray-600 mb-6">
          Statistiques et suivi des ventes mensuelles.
        </p>

        {/* KPI Rapides */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow w-full">
            <h3 className="text-sm text-gray-500">Total annuel</h3>
            <p className="text-2xl font-bold text-blue-600">{totalVentes} €</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow w-full">
            <h3 className="text-sm text-gray-500">Meilleur mois</h3>
            <p className="text-2xl font-bold text-green-600">
              {meilleurMois.month} ({meilleurMois.ventes} €)
            </p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow w-full">
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
        <div className="bg-white p-4 rounded-2xl shadow w-full">
          <h2 className="text-xl font-semibold mb-3">Suivi des ventes</h2>
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
      </div>
    </DashboardLayout>
  );
};

export default Sales;
