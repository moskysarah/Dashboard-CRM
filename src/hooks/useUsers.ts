import { useState, useEffect, useCallback } from 'react';
import { getAdminUsers, patchAdminUser } from '../services/api';
import type { User, UserRole } from '../types/domain';
import { useAuth } from '../store/auth';

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
    // États pour la pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Nombre d'utilisateurs par page
    const user = useAuth((state) => state.user);
    const userRole = user?.role;

    const fetchUsers = useCallback(async (page = 1) => {
        // On ne fait rien tant que l'objet utilisateur n'est pas chargé.
        if (!user) {
            setLoading(false); // On s'assure que l'état de chargement n'est pas bloqué
            return;
        }

        setLoading(true);
        setCurrentPage(page);

        // Seul un superadmin peut lister tous les utilisateurs
        if (user.role !== 'superadmin') {
            setError("Vous n'avez pas les droits pour voir la liste des utilisateurs.");
            setLoading(false);
            return;
        }
        try {
            // On passe la page et la taille de la page à l'API
            const res = await getAdminUsers({ page, page_size: pageSize });
            const paginatedResponse = res.data as PaginatedUsers;
            setTotalUsers(paginatedResponse.count);
            setUsers(paginatedResponse.results ?? []);
            setError(null);
        } catch (err) {
            console.error("Erreur lors du chargement des utilisateurs:", err);
            setError("Impossible de charger les utilisateurs.");
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [user, pageSize]);

    useEffect(() => {
        fetchUsers(1); // Charger la première page au montage
    }, [fetchUsers]);

    const updateUser = useCallback(async (userId: number, data: Partial<User>): Promise<boolean> => {
        if (userRole !== 'superadmin') return false;
        try {
            await patchAdminUser(userId.toString(), data);
            // Rafraîchir la liste pour voir les changements
            await fetchUsers();
            return true;
        } catch (err) {
            console.error(`Erreur lors de la mise à jour de l'utilisateur ${userId}:`, err);
            return false;
        }
    }, [fetchUsers, userRole]);

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
        currentPage,
        totalUsers,
        pageSize,
        refreshUsers: fetchUsers,
        updateUserStatus,
        updateUserRole,
    };
};