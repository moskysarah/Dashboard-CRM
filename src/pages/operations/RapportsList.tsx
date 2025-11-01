import React, { useEffect, useState } from "react";
import { getAnalyticsTimeseries } from "../../services/analytics";
import { useAuth } from "../../store/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ReportData = {
  date: string;
  transactions: number;
};

const ReportsList: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      if (user?.role !== 'admin') {
        setError("Accès refusé: Vous n'avez pas les permissions nécessaires pour voir les rapports.");
        setLoading(false);
        return;
      }

      try {
        const res = await getAnalyticsTimeseries();
        // Exemple d’adaptation selon ton backend
        setData(res.data.results ?? res.data);
      } catch (err: any) {
        if (err.response?.status === 403) {
          console.error("Accès refusé aux rapports:", err);
          setError("Accès refusé aux rapports. Vous n'avez pas les permissions nécessaires.");
        } else {
          console.error("Erreur lors du chargement des rapports:", err);
          setError("Erreur lors du chargement des rapports.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  if (loading) return <p className="text-center py-4">Chargement du rapport...</p>;

  if (error) return <p className="text-center py-4 text-red-500">{error}</p>;

  return (
    <div className="p-6">

      <div className="w-full h-96 bg-white p-4 rounded-2xl shadow">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
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
