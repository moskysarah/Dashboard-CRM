import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from '../store/auth';
import type { Transaction } from '../types/domain';

// L'API renvoie une réponse paginée
interface PaginatedTransactions {
    count: number;
    next: string | null;
    previous: string | null;
    results: Transaction[];
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const user = useAuth((state) => state.user);

    const fetchTransactions = useCallback(async () => {
        if (!user) {
            setLoading(false);
            return;
        }

        try {
            // Choisir la route API en fonction du rôle de l'utilisateur
            // Seul le superadmin peut voir toutes les transactions des marchands.
            // L'admin et l'utilisateur standard ne voient que les leurs.
            const isSuperAdmin = user.role === 'superadmin';
            // L'endpoint /admin-panel/transactions/ n'existe pas, on utilise /merchants/transactions/ comme défini dans l'API.
            const route = isSuperAdmin ? '/merchants/transactions/' : '/me/transactions/';
            
            const res = await api.get<PaginatedTransactions>(route);

            const newTransactions = res.data.results ?? [];
            setTransactions(newTransactions);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des transactions:", err);
            setError("Impossible de charger les transactions.");
            setTransactions([]); // Vider les transactions en cas d'erreur
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Appel initial et rafraîchissement automatique toutes les 30 secondes
    useEffect(() => {
        fetchTransactions(); // Appel initial

        const interval = setInterval(() => {
            fetchTransactions();
        }, 30000);

        return () => clearInterval(interval); // Nettoyage de l'intervalle
    }, [fetchTransactions]);

    return { transactions, loading, error, refreshTransactions: fetchTransactions };
};