// src/hooks/useOverviewStats.ts
import { useState, useEffect } from "react";
import api from "../services/api";

console.log("HOOK useOverviewStats appelé");

type StatsData = {
  users: {
    total_users: number;
    new_users_in_period: number;
  };
  financials: {
    total_volume_in: number;
  };
  transactions: {
    success_rate_percent: number;
  };
};

type TimeseriesData = {
  date: string;
  transactions: number;
  revenue: number;
};

type StatusData = {
  status: string;
  count: number;
};

type ActiveUser = {
  id: string;
  name: string;
  email: string;
};

export const useOverviewStats = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [timeseries, setTimeseries] = useState<TimeseriesData[]>([]);
  const [statusData, setStatusData] = useState<StatusData[]>([]);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // KPI global
        const overviewRes = await api.get("/analytics/overview/");
        setStats({
          users: {
            total_users: overviewRes.data.totalUsers ?? 0,
            new_users_in_period: overviewRes.data.newUsersInPeriod ?? 0,
          },
          financials: {
            total_volume_in: overviewRes.data.totalRevenue ?? 0,
          },
          transactions: {
            success_rate_percent: overviewRes.data.successRate ?? 0,
          },
        });

        // Graphiques temps
        const timeseriesRes = await api.get("/analytics/timeseries/");
        setTimeseries(timeseriesRes.data || []);

        // Statut des transactions
        const statusRes = await api.get("/analytics/by-status/");
        setStatusData(statusRes.data || []);

        // Utilisateurs actifs
        const activeRes = await api.get("/analytics/active-users/");
        setActiveUsers(activeRes.data || []);

        setError(null);
      } catch (err: any) {
        console.error("Erreur fetch user overview:", err);
        setError("Impossible de charger les données utilisateur.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { stats, timeseries, statusData, activeUsers, loading, error };
};
