// src/hooks/useSalesData.ts
import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../store/auth";

type Sale = { month: string; ventes: number };

export const useSalesData = () => {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { role } = useAuth();

  useEffect(() => {
    const fetchSales = async () => {
      // Check if user has permission to access analytics
      const allowedRoles = ['admin', 'superadmin'];
      if (!role || !allowedRoles.includes(role)) {
        console.warn("Accès refusé aux données de ventes : rôle non autorisé.");
        setData([]);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/analytics/overview/");
        if (res.data && Array.isArray(res.data)) {
          const transformed = res.data.map((item: any, index: number) => ({
            month: `Mois ${index + 1}`,
            ventes: item.totalTransactions || 0,
          }));
          setData(transformed);
        } else {
          console.warn("Données de ventes non disponibles ou format incorrect.");
          setData([]);
        }
      } catch (err: any) {
        if (err.response?.status === 403) {
          console.warn("Accès refusé aux données de ventes (403).");
          setData([]);
        } else if (err.response?.status === 404) {
          console.warn("Données de ventes non trouvées (404).");
          setData([]);
        } else {
          console.error(err);
          setError("Erreur lors du chargement des ventes.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return { data, loading, error };
};
