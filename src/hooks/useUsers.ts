import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, patchAdminUser } from '../services/api';
import type { User, UserRole } from '../types/domain';

// L'API renvoie une réponse paginée
interface PaginatedUsers {
    count: number;
    next: string | null;
    previous: string | null;
    results: User[];
}

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAdminUsers();
            const paginatedResponse = res.data as PaginatedUsers;
            setUsers(paginatedResponse.results ?? []);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des utilisateurs:", err);
            setError("Impossible de charger les utilisateurs.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const updateUser = useCallback(async (userId: number, data: Partial<User>) => {
        try {
            await patchAdminUser(userId.toString(), data);
            // Rafraîchir la liste pour voir les changements
            await fetchUsers();
            return true;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, err);
            return false;
        }
    }, [fetchUsers]);

    const updateUserStatus = useCallback(async (userId: number, isActive: boolean) => {
        // L'API attend un PATCH sur l'utilisateur avec le champ is_active
        return await updateUser(userId, { is_active: isActive });
    }, [updateUser]);

    const updateUserRole = useCallback(async (userId: number, role: UserRole) => {
        // L'API attend un PATCH sur l'utilisateur avec le champ role
        return await updateUser(userId, { role });
    }, [updateUser]);


    return {
        users,
        loading,
        error,
        refreshUsers: fetchUsers,
        updateUserStatus,
        updateUserRole,
    };
};