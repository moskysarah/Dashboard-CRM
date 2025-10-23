import { useState, useEffect } from "react";
import { getAdminUsers, setUserRole, setUserStatus, createUser, deleteUserAccount} from "../services/api";
import { useAuth } from "../store/auth";
import type { User, UserRole } from "../types/domain";

export const useUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  //   Récupérer la liste des utilisateurs
  const fetchUsers = async (page = 1) => {
    if (user?.role !== "admin") {
      setError("Accès refusé : vous n'avez pas les permissions nécessaires pour voir la liste des utilisateurs.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await getAdminUsers({ page });
      setUsers(res.data.results || []);
      setTotalUsers(res.data.count || 0);
      setPageSize(res.data.page_size || 10);
      setCurrentPage(page);
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Accès refusé : permissions insuffisantes.");
      } else {
        setError("Erreur lors du chargement des utilisateurs.");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUsers = (page = currentPage) => fetchUsers(page);

  // 🔹 Changer le rôle
  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await setUserRole(userId.toString(), newRole);
      await refreshUsers(currentPage);
    } catch (error) {
      console.error("Erreur de changement de rôle :", error);
      setError("Impossible de changer le rôle de l'utilisateur.");
    }
  };

  //  Changer le statut
  const updateUserStatus = async (userId: number, isActive: boolean) => {
    try {
      await setUserStatus(userId.toString(), isActive ? "active" : "inactive");
      await refreshUsers(currentPage);
    } catch (error) {
      console.error("Erreur de changement de statut :", error);
      setError("Impossible de changer le statut de l'utilisateur.");
    }
  };

  // 🔹 Créer un utilisateur
  const createNewUser = async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: UserRole;
  }) => {
    try {
      await createUser(userData);
      await refreshUsers(currentPage);
    } catch (error) {
      console.error("Erreur de création d'utilisateur :", error);
      setError("Impossible de créer l'utilisateur.");
    }
  };

  // 🔹 Supprimer un utilisateur
  const deleteUser = async (userId: number) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      await deleteUserAccount(userId.toString());
      setUsers((prev) => prev.filter((u) => u.id !== userId)); // Mise à jour locale immédiate
    } catch (error) {
      console.error("Erreur de suppression d'utilisateur :", error);
      setError("Impossible de supprimer l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    users,
    loading,
    error,
    currentPage,
    totalUsers,
    totalPages,
    pageSize,
    refreshUsers,
    updateUserRole,
    updateUserStatus,
    createNewUser,
    deleteUser, 
  };
};
