import { useState, useEffect, useCallback } from 'react';
import { getFinanceOverview } from '../services/api';

/**
 * Données agrégées pour le graphique financier.
 * L'API devrait renvoyer des données sous cette forme.
 */
export type FinanceChartData = {
  name: string; // ex: "Jan", "Fev"
  revenu: number;
  depense: number;
}

/**
 * Données globales retournées par l'endpoint d'analytics.
 */
type FinanceOverview = {
  totalRevenu: number;
  totalDepense: number;
  solde: number;
  chartData: FinanceChartData[];
}

export const useFinanceData = () => {
    const [data, setData] = useState<FinanceOverview | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchFinanceData = useCallback(async () => {
        setLoading(true);
        try {
            // Utilisation de la fonction d'API centralisée
            const res = await getFinanceOverview();

            setData(res.data);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des données financières:", err);
            setError("Impossible de charger les données financières.");
            // En cas d'erreur, on peut mettre des données par défaut pour éviter un crash
            setData({ totalRevenu: 0, totalDepense: 0, solde: 0, chartData: [] });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFinanceData();
    }, [fetchFinanceData]);

    return {
        data,
        loading,
        error,
        refresh: fetchFinanceData
    };
};
