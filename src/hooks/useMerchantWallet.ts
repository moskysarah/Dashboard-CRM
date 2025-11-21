import { useState, useEffect } from "react";
import { getMerchantWallets } from "../api/merchants";

export const useMerchantWallet = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      const data = await getMerchantWallets();
      setWallets(data);
      if (data && data.length > 0) {
        setWallet(data[0]); // Prendre le premier wallet par défaut
      }
    } catch (err: any) {
      setError("Erreur lors du chargement des wallets marchands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  return { wallets, wallet, loading, error, refresh: fetchWallets };
};
