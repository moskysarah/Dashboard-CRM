import { useEffect, useState } from "react";
import { getUsers, getUserById, createUser, updateUser, patchUser, deleteUser } from "../api/users";

export type UserFormData = {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
};

export const useUsers = (userId?: string) => {
  const [users, setUsers] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setError("Données des utilisateurs invalides");
      }
    } catch {
      setError("Erreur lors du chargement des utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserById = async (id: string) => {
    try {
      const data = await getUserById(id);
      setUser(data);
    } catch {
      setError("Erreur de chargement de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) fetchUserById(userId);
    else fetchUsers();
  }, [userId]);

  const create = async (formData: UserFormData) => {
    try {
      await createUser(formData);
      await fetchUsers(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la création de l'utilisateur");
    }
  };

  const update = async (id: string, formData: Partial<UserFormData>) => {
    try {
      await updateUser(id, formData);
      await fetchUsers(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    }
  };

  const patch = async (id: string, formData: Partial<UserFormData>) => {
    try {
      await patchUser(id, formData);
      await fetchUsers(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la mise à jour partielle de l'utilisateur");
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteUser(id);
      await fetchUsers(); // Refresh data
    } catch (err: any) {
      throw new Error("Erreur lors de la suppression de l'utilisateur");
    }
  };

  return { users, user, loading, error, create, update, patch, remove, refresh: fetchUsers };
};
