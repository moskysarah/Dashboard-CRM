import { useState, useEffect } from "react";
import { getAnalyticsTimeseries, getAnalyticsByStatus, getAnalyticsActiveUsers } from "../services/api";

export const useAnalytics = () => {
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [tsRes, statusRes, usersRes] = await Promise.all([
          getAnalyticsTimeseries(),
          getAnalyticsByStatus(),
          getAnalyticsActiveUsers(),
        ]);

        setTimeseries(tsRes.data || []);
        setStatusData(statusRes.data || []);
        setActiveUsers(usersRes.data || []);
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors du chargement des analytics.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { timeseries, statusData, activeUsers, loading, error };
};
