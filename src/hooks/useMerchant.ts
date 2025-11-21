import { useState, useEffect } from "react";
import { getMerchantsProfiles, createMerchant, updateMerchant, deleteMerchant } from "../api/merchants";

export const useMerchants = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupérer tous les marchands
  const loadMerchants = async () => {
    setLoading(true);
    try {
      const res = await getMerchantsProfiles();
      setData(Array.isArray(res) ? res : []);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des marchands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, []);

  // Ajouter un marchand
  const addMerchant = async (data: any) => {
    setLoading(true);
    try {
      await createMerchant(data);
      await loadMerchants(); // recharge la liste
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'ajout du marchand");
    } finally {
      setLoading(false);
    }
  };

  // Modifier un marchand
  const updateMerchantById = async (id: string, data: any) => {
    setLoading(true);
    try {
      await updateMerchant(id, data);
      await loadMerchants();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la mise à jour du marchand");
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un marchand
  const deleteMerchantById = async (id: string) => {
    setLoading(true);
    try {
      await deleteMerchant(id);
      await loadMerchants();
    } catch (err: any) {
      setError(err.message || "Erreur lors de la suppression du marchand");
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    loadMerchants,
    addMerchant,
    updateMerchantById,
    deleteMerchantById,
  };
};
