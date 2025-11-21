import { useState, useEffect } from "react";
import { getAgentWallets, getAgentTransactions } from "../services/api";
import { getAnalyticsOverview } from "../services/analytics/overview";

export const useFinanceData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      setLoading(true);
      try {
        const [walletRes, txRes, overviewRes] = await Promise.allSettled([
          getAgentWallets(),
          getAgentTransactions(),
          getAnalyticsOverview()
        ]);

        let solde = 0;
        let totalRevenu = 0;
        let totalDepense = 0;
        let chartData: any[] = [];

        // Handle wallet data
        if (walletRes.status === 'fulfilled') {
          solde = walletRes.value.data.balance ?? 0;
        } else if (walletRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux données de portefeuille (403).");
        } else if (walletRes.reason?.response?.status === 404) {
          console.warn("Données de portefeuille non trouvées (404).");
        } else {
          console.error("Erreur lors du chargement des données de portefeuille:", walletRes.reason);
        }

        // Handle transactions data
        if (txRes.status === 'fulfilled') {
          chartData = Array.isArray(txRes.value.data) ? txRes.value.data.map((tx: any) => ({
            name: tx.date,
            revenu: tx.amount, // ou revenu selon le type
            depense: tx.amount, // ou depense selon le type
          })) : [];
        } else if (txRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux données de transactions (403).");
          chartData = [];
        } else if (txRes.reason?.response?.status === 404) {
          console.warn("Données de transactions non trouvées (404).");
          chartData = [];
        } else {
          console.error("Erreur lors du chargement des données de transactions:", txRes.reason);
        }

        // Handle overview data
        if (overviewRes.status === 'fulfilled') {
          totalRevenu = overviewRes.value.data.total_volume_in ?? 0;
          totalDepense = overviewRes.value.data.total_volume_out ?? 0;
        } else if (overviewRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux données d'aperçu (403).");
        } else if (overviewRes.reason?.response?.status === 404) {
          console.warn("Données d'aperçu non trouvées (404).");
        } else {
          console.error("Erreur lors du chargement des données d'aperçu:", overviewRes.reason);
        }

        setData({
          solde,
          totalRevenu,
          totalDepense,
          chartData,
        });

        // Set error only if all requests failed
        if (walletRes.status === 'rejected' && txRes.status === 'rejected' && overviewRes.status === 'rejected') {
          setError("Erreur lors du chargement des données financières.");
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors du chargement des données financières.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinance();
  }, []);

  return { data, loading, error };
};
