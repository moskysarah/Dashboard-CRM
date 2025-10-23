import { useState, useEffect } from "react";
import { getAgentWallets, getAgentTransactions, getAnalyticsOverview } from "../services/api";

export const useFinanceData = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinance = async () => {
      setLoading(true);
      try {
        const [walletRes, txRes, overviewRes] = await Promise.all([
          getAgentWallets(),
          getAgentTransactions(),
          getAnalyticsOverview()
        ]);

        setData({
          solde: walletRes.data.balance ?? 0,
          totalRevenu: overviewRes.data.total_volume_in ?? 0,
          totalDepense: overviewRes.data.total_volume_out ?? 0,
          chartData: txRes.data.map((tx: any) => ({
            name: tx.date,
            revenu: tx.amount, // ou revenu selon le type
            depense: tx.amount, // ou depense selon le type
          })),
        });
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
