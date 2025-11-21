import { useEffect, useState } from "react";
import { getAdminWallets, getAdminWalletById, setTransactionStatus } from "../services/api";

export const useAdmin = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [wallet, setWallet] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdminWallets = async () => {
    setLoading(true);
    try {
      const data = await getAdminWallets();
      if (Array.isArray(data.data)) {
        setWallets(data.data);
      } else {
        setError("Données des portefeuilles invalides");
      }
    } catch (err) {
      setError("Erreur lors du chargement des portefeuilles admin");
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminWalletById = async (id: string) => {
    setLoading(true);
    try {
      const data = await getAdminWalletById(id);
      setWallet(data.data);
    } catch (err) {
      setError("Erreur lors du chargement du portefeuille admin");
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionCode: string, status: string) => {
    setLoading(true);
    try {
      await setTransactionStatus(transactionCode, status);
      // Optionally refresh data or emit success
    } catch (err) {
      setError("Erreur lors de la mise à jour du statut de la transaction");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminWallets();
  }, []);

  return {
    wallets,
    wallet,
    loading,
    error,
    fetchAdminWallets,
    fetchAdminWalletById,
    updateTransactionStatus,
  };
};
