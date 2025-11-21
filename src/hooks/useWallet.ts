import { useEffect, useState } from "react";
import { getWallets, getWalletById } from "../api/me";

export const useWallet = (walletId?: string) => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = async () => {
    try {
      const data = await getWallets();
      setWallets(data);
    } catch (err: any) {
      setError("Erreur lors du chargement des wallets");
    } finally {
      setLoading(false);
    }
  };

  const fetchWalletById = async (id: string) => {
    try {
      const data = await getWalletById(id);
      setWallet(data);
    } catch (err: any) {
      setError("Impossible de charger ce wallet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletId) fetchWalletById(walletId);
    else fetchWallets();
  }, [walletId]);

  return { wallets, wallet, loading, error, refresh: fetchWallets };
};
