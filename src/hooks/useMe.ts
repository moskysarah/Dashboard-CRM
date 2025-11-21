import { useEffect, useState } from "react";
import { getTransactions, getWallets } from "../api/me";

export const useMe = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [wallets, setWallets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [txData, walletData] = await Promise.all([
        getTransactions(),
        getWallets(),
      ]);
      setTransactions(txData);
      setWallets(walletData);
    } catch {
      setError("Erreur lors du chargement de vos données personnelles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { transactions, wallets, loading, error, refresh: fetchData };
};
