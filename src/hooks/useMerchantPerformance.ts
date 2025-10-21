import { useState, useEffect, useCallback } from 'react';
import { getMerchants } from '../services/api';
import { AxiosError } from 'axios';
import { useAuth } from '../store/auth';

/**
 * Structure des données de performance pour un marchand,
 * telle que retournée par l'API.
 */
export type MerchantPerformanceData = {
  merchantId: string;
  merchantName: string;
  subStore: string;
  transactionsCount: number;
  totalAmount: number;
  success: number;
  pending: number;
  failed: number;
}

export const useMerchantPerformance = () => {
    const [performanceData, setPerformanceData] = useState<MerchantPerformanceData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuth((state) => state.user);

    const fetchPerformance = useCallback(async () => {
        // Only fetch if user is admin or superadmin
        if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
            setLoading(false);
            setError("Accès non autorisé.");
            return;
        }

        setLoading(true);
        try {
            // Utilisation de la fonction d'API centralisée
            const response = await getMerchants();
            setPerformanceData(response.data.results ?? response.data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des performances des marchands:", err);
            if (err instanceof AxiosError && err.response?.status === 401) {
                setError("Token expiré. Veuillez vous reconnecter.");
            } else if (err instanceof AxiosError && err.response?.status === 403) {
                setError("Accès non autorisé.");
            } else {
                setError("Impossible de charger les performances.");
            }
            setPerformanceData([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    return { performanceData, loading, error, refresh: fetchPerformance };
};
