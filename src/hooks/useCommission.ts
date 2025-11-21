import { useEffect, useState } from "react";
import { getCommissions, createCommission, updateCommission, deleteCommission } from "../api/commissions";
import type { CommissionFormData } from "../types/Commission";

export const useCommissions = () => {
  const [data, setData] = useState<any>({ results: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommissions = async () => {
    try {
      const data = await getCommissions();
      setData(data);
    } catch (err: any) {
      setError("Impossible de charger les commissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const create = async (formData: CommissionFormData) => {
    try {
      await createCommission(formData);
      await fetchCommissions(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la création de la commission");
    }
  };

  const update = async (id: string, formData: CommissionFormData) => {
    try {
      await updateCommission(id, formData);
      await fetchCommissions(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la mise à jour de la commission");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteCommission(id);
      await fetchCommissions(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la suppression de la commission");
    }
  };

  return { data, loading, error, create, update, remove, refetch: fetchCommissions };
};
