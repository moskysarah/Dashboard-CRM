import { useState, useEffect, useCallback } from "react";
import { getMerchantTransactions } from "../api/merchants";
import { getAgentTransactions } from "../api/agents";

export interface TransactionFilters {
  status?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  search?: string;
  userRole?: string; // Add userRole to determine which API to call
}

export const useTransactions = (filters?: TransactionFilters) => {
  const [data, setData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les transactions selon le rôle utilisateur
  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (filters?.userRole === 'agent') {
        // For agents, get their own transactions
        res = await getAgentTransactions('me'); // Use 'me' to get current agent's transactions
      } else {
        // Default to merchant transactions
        res = await getMerchantTransactions();
      }
      const transactions = Array.isArray(res) ? res : [];
      setData(transactions);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Erreur lors du chargement des transactions");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [filters?.userRole]);

  // Appliquer les filtres
  const applyFilters = useCallback((transactions: any[], filters?: TransactionFilters) => {
    if (!filters) return transactions;

    return transactions.filter((transaction) => {
      // Filtre par statut
      if (filters.status && transaction.status?.toLowerCase() !== filters.status.toLowerCase()) {
        return false;
      }

      // Filtre par date
      if (filters.startDate || filters.endDate) {
        const transactionDate = new Date(transaction.created_at || transaction.date);
        if (filters.startDate && transactionDate < new Date(filters.startDate)) {
          return false;
        }
        if (filters.endDate && transactionDate > new Date(filters.endDate)) {
          return false;
        }
      }

      // Filtre par montant
      if (filters.minAmount !== undefined && transaction.Montant < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && transaction.Montant > filters.maxAmount) {
        return false;
      }

      // Recherche par ID ou autre champ
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = [
          transaction.id?.toString(),
          transaction.reference,
          transaction.description
        ].filter(Boolean);

        if (!searchableFields.some(field => field.toLowerCase().includes(searchTerm))) {
          return false;
        }
      }

      return true;
    });
  }, []);

  // Mettre à jour les données filtrées quand les données ou les filtres changent
  useEffect(() => {
    const filtered = applyFilters(data, filters);
    setFilteredData(filtered);
  }, [data, filters, applyFilters]);

  useEffect(() => {
    loadTransactions();

    // Polling pour les mises à jour en temps réel (toutes les 10 secondes)
    const interval = setInterval(() => {
      loadTransactions();
    }, 10000);

    return () => clearInterval(interval);
  }, [loadTransactions]);

  return {
    data: filteredData,
    allData: data,
    loading,
    error,
    loadTransactions,
    applyFilters
  };
};
