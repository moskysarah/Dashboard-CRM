import { useEffect, useState } from "react";
import { getAnalyticsOverview } from "../services/api";
import { AxiosError } from "axios";

import { useAuth } from '../store/auth';

export const useAnalyticsData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !['admin', 'superadmin'].includes(user.role || '')) {
        setError('You do not have permission to view analytics data.');
        setLoading(false);
        return;
      }
      try {
        const res = await getAnalyticsOverview();
        setData(res.data);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          setError("Token expiré. Veuillez vous reconnecter.");
        } else if (err instanceof AxiosError && err.response?.status === 403) {
          setError('You do not have permission to view analytics data.');
        } else {
          setError("Impossible de charger les données analytics");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return { data, loading, error };
};
