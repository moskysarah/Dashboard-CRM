import { useState, useEffect } from "react";
import {
  getPartners,
  createPartner,
  deletePartner,
} from "../services/partners";

export function usePartners() {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Charger tous les partenaires
  const fetchPartners = async () => {
    setLoading(true);
    try {
      const { data } = await getPartners();
      setPartners(data);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un partenaire
  const addPartner = async (partnerData: any) => {
    const { data } = await createPartner(partnerData);
    setPartners((prev) => [...prev, data]);
  };

  // Supprimer un partenaire
  const removePartner = async (id: string | number) => {
    await deletePartner(id);
    setPartners((prev) => prev.filter((p: any) => p.id !== id));
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  return { partners, loading, addPartner, removePartner, fetchPartners };
}
