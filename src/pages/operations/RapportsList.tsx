// src/pages/operations/ReportsList.tsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";  // api back

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

// ===== Types =====
type ReportData = {
  period: string;
  transactions: number;
};

const ReportsList: React.FC = () => {
  const [data, setData] = useState<ReportData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get("/reports"); // 🔥 adapte l’endpoint à ton backend
        setData(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des rapports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <p className="text-center py-4">Chargement du rapport...</p>;
  }

  return (
    <div className="p-6">
      <div className="w-full h-96">
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="period" />
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
