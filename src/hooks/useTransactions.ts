import { useState, useEffect } from 'react';
import { getMerchantTransactions, getTransactions } from '../services/api';
import { useAuth } from '../store/auth';
import type { Transaction } from '../types/domain';
import { AxiosError } from 'axios';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        let data: Transaction[];
        if (user.merchant) {
          const res = await getMerchantTransactions();
          data = res.data.results || res.data;
        } else {
          const res = await getTransactions();
          data = res.data.results || res.data;
        }
        setTransactions(data);
      } catch (err) {
        if (err instanceof AxiosError && err.response?.status === 401) {
          setError('Token expired. Please log in again.');
        } else if (err instanceof AxiosError && err.response?.status === 403) {
          setError('You do not have permission to view transactions.');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  return { transactions, loading, error };
};
