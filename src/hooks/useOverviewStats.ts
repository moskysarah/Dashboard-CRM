// src/hooks/useOverviewStats.ts
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../store/auth";

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

  const { role } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      // Check if user has permission to access analytics
      const allowedRoles = ['superadmin'];
      if (!role || !allowedRoles.includes(role)) {
        console.warn("Accès refusé aux statistiques d'aperçu : rôle non autorisé.");
        setStats(null);
        setTimeseries([]);
        setStatusData([]);
        setActiveUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [overviewRes, timeseriesRes, statusRes, activeRes] = await Promise.allSettled([
          api.get("/analytics/overview/"),
          api.get("/analytics/timeseries/"),
          api.get("/analytics/by-status/"),
          api.get("/analytics/active-users/")
        ]);

        // Handle overview stats
        if (overviewRes.status === 'fulfilled') {
          setStats({
            users: {
              total_users: overviewRes.value.data.totalUsers ?? 0,
              new_users_in_period: overviewRes.value.data.newUsersInPeriod ?? 0,
            },
            financials: {
              total_volume_in: overviewRes.value.data.totalRevenue ?? 0,
            },
            transactions: {
              success_rate_percent: overviewRes.value.data.successRate ?? 0,
            },
          });
        } else if (overviewRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux statistiques d'aperçu (403).");
          setStats(null);
        } else if (overviewRes.reason?.response?.status === 404) {
          console.warn("Statistiques d'aperçu non trouvées (404).");
          setStats(null);
        } else {
          console.error("Erreur lors du chargement des statistiques d'aperçu:", overviewRes.reason);
        }

        // Handle timeseries
        if (timeseriesRes.status === 'fulfilled') {
          setTimeseries(timeseriesRes.value.data || []);
        } else if (timeseriesRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux séries temporelles (403).");
          setTimeseries([]);
        } else if (timeseriesRes.reason?.response?.status === 404) {
          console.warn("Séries temporelles non trouvées (404).");
          setTimeseries([]);
        } else {
          console.error("Erreur lors du chargement des séries temporelles:", timeseriesRes.reason);
        }

        // Handle status data
        if (statusRes.status === 'fulfilled') {
          setStatusData(statusRes.value.data || []);
        } else if (statusRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux données de statut (403).");
          setStatusData([]);
        } else if (statusRes.reason?.response?.status === 404) {
          console.warn("Données de statut non trouvées (404).");
          setStatusData([]);
        } else {
          console.error("Erreur lors du chargement des données de statut:", statusRes.reason);
        }

        // Handle active users
        if (activeRes.status === 'fulfilled') {
          setActiveUsers(activeRes.value.data || []);
        } else if (activeRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux utilisateurs actifs (403).");
          setActiveUsers([]);
        } else if (activeRes.reason?.response?.status === 404) {
          console.warn("Utilisateurs actifs non trouvés (404).");
          setActiveUsers([]);
        } else {
          console.error("Erreur lors du chargement des utilisateurs actifs:", activeRes.reason);
        }

        // Set error only if all requests failed
        if (overviewRes.status === 'rejected' && timeseriesRes.status === 'rejected' &&
            statusRes.status === 'rejected' && activeRes.status === 'rejected') {
          setError("Impossible de charger les données utilisateur.");
        } else {
          setError(null);
        }
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
