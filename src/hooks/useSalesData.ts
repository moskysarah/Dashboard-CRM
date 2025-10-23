// src/hooks/useSalesData.ts
import { useState, useEffect } from "react";
import api from "../services/api";

type Sale = { month: string; ventes: number };

export const useSalesData = () => {
  const [data, setData] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const res = await api.get("/analytics/overview/");
        const transformed = res.data.map((item: any, index: number) => ({
          month: `Mois ${index + 1}`,
          ventes: item.totalTransactions || 0,
        }));
        setData(transformed);
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors du chargement des ventes.");
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  return { data, loading, error };
};
