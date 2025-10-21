// src/hooks/useFinanceData.ts
import { useEffect, useState } from "react";
import { getAnalyticsOverview, getAnalyticsTimeseries } from "../services/api";
import { useAuth } from "../store/auth";
import { AxiosError } from "axios";

interface ChartPoint {
  name: string;
  revenu: number;
  depense: number;
}

export const useFinanceData = () => {
  const { user } = useAuth();
  const [data, setData] = useState<{
    totalRevenu: number;
    totalDepense: number;
    solde: number;
    chartData: ChartPoint[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role !== 'admin') {
        setError("Accès refusé: Vous n'avez pas les permissions nécessaires pour voir les données financières.");
        setLoading(false);
        return;
      }

      try {
        // 🔹 Appel simultané des 2 endpoints
        const [overviewRes, timeseriesRes] = await Promise.all([
          getAnalyticsOverview(),
          getAnalyticsTimeseries(),
        ]);

        const overview = overviewRes.data;
        const timeseries = timeseriesRes.data.series ?? timeseriesRes.data;

        // 🔹 Transformation des données pour ton graphique
        const chartData = timeseries.map((item: any) => ({
          name: item.date ?? item.timestamp?.split("T")[0],
          revenu: item.income ?? item.volume_in ?? 0,
          depense: item.expense ?? item.volume_out ?? 0,
        }));

        // 🔹 Calcul du solde
        const totalRevenu = overview.total_revenue ?? 0;
        const totalDepense = overview.total_expenses ?? 0;
        const solde = totalRevenu - totalDepense;

        setData({
          totalRevenu,
          totalDepense,
          solde,
          chartData,
        });
      } catch (err: any) {
        console.error("Erreur API finance:", err);
        if (err.response?.status === 403) {
          setError("Accès refusé: Permissions insuffisantes pour accéder aux données financières.");
        } else if (err instanceof AxiosError && err.response?.status === 401) {
          setError("Token expiré. Veuillez vous reconnecter.");
        } else {
          setError("Impossible de charger les données financières");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return { data, loading, error };
};
