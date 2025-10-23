import { useState, useEffect } from "react";
import api from "../services/api";
import type { Transaction } from "../types/domain";

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get("/me/transactions/");
        setTransactions(res.data as Transaction[]);
      } catch (err: any) {
        console.error(err);
        setError("Erreur lors du chargement des transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  return { transactions, loading, error };
};
