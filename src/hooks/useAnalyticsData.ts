import { useState, useEffect } from "react";
import { getAnalyticsTimeseries, getAnalyticsByStatus, getAnalyticsActiveUsers } from "../services/api";
import { useAuth } from "../store/auth";

export const useAnalytics = () => {
  const [timeseries, setTimeseries] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { role } = useAuth();

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Check if user has permission to access analytics
      const allowedRoles = ['admin', 'superadmin'];
      if (!role || !allowedRoles.includes(role)) {
        console.warn("Accès refusé aux analytics : rôle non autorisé.");
        setTimeseries([]);
        setStatusData([]);
        setActiveUsers([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [tsRes, statusRes, usersRes] = await Promise.allSettled([
          getAnalyticsTimeseries(),
          getAnalyticsByStatus(),
          getAnalyticsActiveUsers(),
        ]);

        // Handle timeseries
        if (tsRes.status === 'fulfilled') {
          setTimeseries(tsRes.value.data || []);
        } else if (tsRes.reason?.response?.status === 403) {
          setTimeseries([]);
          console.warn("Accès refusé aux données de séries temporelles (403).");
        } else if (tsRes.reason?.response?.status === 404) {
          setTimeseries([]);
          console.warn("Données de séries temporelles non trouvées (404).");
        } else {
          console.error("Erreur lors du chargement des séries temporelles:", tsRes.reason);
        }

        // Handle status data
        if (statusRes.status === 'fulfilled') {
          setStatusData(statusRes.value.data || []);
        } else if (statusRes.reason?.response?.status === 403) {
          setStatusData([]);
          console.warn("Accès refusé aux données de statut (403).");
        } else if (statusRes.reason?.response?.status === 404) {
          setStatusData([]);
          console.warn("Données de statut non trouvées (404).");
        } else {
          console.error("Erreur lors du chargement des données de statut:", statusRes.reason);
        }

        // Handle active users
        if (usersRes.status === 'fulfilled') {
          setActiveUsers(usersRes.value.data || []);
        } else if (usersRes.reason?.response?.status === 403) {
          setActiveUsers([]);
          console.warn("Accès refusé aux utilisateurs actifs (403).");
        } else if (usersRes.reason?.response?.status === 404) {
          setActiveUsers([]);
          console.warn("Utilisateurs actifs non trouvés (404).");
        } else {
          console.error("Erreur lors du chargement des utilisateurs actifs:", usersRes.reason);
        }

        // Set error only if all requests failed
        if (tsRes.status === 'rejected' && statusRes.status === 'rejected' && usersRes.status === 'rejected') {
          setError("Erreur lors du chargement des analytics.");
        } else {
          setError(null);
        }
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
