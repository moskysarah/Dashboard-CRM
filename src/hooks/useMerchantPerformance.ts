import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

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

    const fetchPerformance = useCallback(async () => {
        setLoading(true);
        try {
            // Cet endpoint est utilisé dans le composant original.
            // Nous supposons qu'il renvoie un tableau de MerchantPerformanceData.
            const response = await api.get<MerchantPerformanceData[]>("/merchants/performance");
            setPerformanceData(response.data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des performances des marchands:", err);
            setError("Impossible de charger les performances.");
            setPerformanceData([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPerformance();
    }, [fetchPerformance]);

    return { performanceData, loading, error, refresh: fetchPerformance };
};