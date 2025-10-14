import { useState, useEffect, useCallback } from 'react';
import { getAdminOverview } from '../services/api';
import { useAuth } from '../store/auth';

export interface OverviewStats {
  filters_applied: {
    start_date: string;
    end_date: string;
  };
  users: {
    total_users: number;
    new_users_in_period: number;
    active_users_in_period: number;
  };
  merchants: {
    total_merchants: number;
    active_merchants_in_period: number;
  top_merchants_by_volume: Record<string, unknown>[];
  };
  financials: {
    estimated_revenue: number;
    total_volume_in: number;
    total_volume_out: number;
    average_transaction_value: number;
  };
  transactions: {
    total_in_period: number;
    success_rate_percent: number;
    successful_out_for_revenue_calc: number;
  };
  stats_per_devise: {
    devise__codeISO: string;
    num_transactions: number;
    volume_in: number | null;
    volume_out: number | null;
    successful_count: number;
    failed_count: number;
    pending_count: number;
  }[];
}

export const useOverviewStats = () => {
    const [stats, setStats] = useState<OverviewStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userRole = useAuth((state) => state.user?.role);

    const fetchStats = useCallback(async () => {
        if (userRole !== 'superadmin') {
            setError("Vous n'avez pas les droits pour voir ces statistiques.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const res = await getAdminOverview();
            setStats(res.data);
        } catch (err) {
            setError("Impossible de charger les statistiques d'aperçu.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userRole]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refreshStats: fetchStats };
};