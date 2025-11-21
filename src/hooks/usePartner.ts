import { useState, useEffect } from "react";
import {
  getPartners,
  createPartner,
  deletePartner,
} from "../services/partners";

export function usePartners() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les partenaires
  const fetchPartners = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPartners();
      setData(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch partners");
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un partenaire
  const addPartner = async (partnerData: any) => {
    try {
      const { data } = await createPartner(partnerData);
      setData((prev) => [...prev, data]);
    } catch (err: any) {
      setError(err.message || "Failed to add partner");
    }
  };

  // Supprimer un partenaire
  const removePartner = async (id: string | number) => {
    try {
      await deletePartner(id.toString());
      setData((prev) => prev.filter((p: any) => p.id !== id));
    } catch (err: any) {
      setError(err.message || "Failed to remove partner");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return { data, loading, error, addPartner, removePartner, fetchPartners };
}
