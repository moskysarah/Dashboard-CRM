import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { setUserRole, setUserStatus } from "../services/api";
import { Button } from "./ui/Button";
import { Settings, UserCheck, UserX } from "lucide-react";

const UserTable: React.FC = () => {
  const { users, loading, error, refresh } = useUsers();
  const [updating, setUpdating] = useState<string | null>(null);

  const handleSetRole = async (userId: string, role: string) => {
    setUpdating(userId);
    try {
      await setUserRole(userId, role);
      refresh();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du rôle:", err);
    } finally {
      setUpdating(null);
    }
  };

  const handleSetStatus = async (userId: string, status: string) => {
    setUpdating(userId);
    try {
      await setUserStatus(userId, status);
      refresh();
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <p>Chargement des utilisateurs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <Settings className="w-6 h-6 mr-2 text-blue-600" />
        Gestion des Utilisateurs
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Nom</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Rôle</th>
              <th className="p-4 font-semibold text-gray-700">Statut</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                <td className="p-4 font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                <td className="p-4 text-gray-600">{u.email}</td>
                <td className="p-4 text-gray-600 capitalize">{u.role}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      u.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <select
                    onChange={(e) => handleSetRole(u.id, e.target.value)}
                    disabled={updating === u.id}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                    defaultValue=""
                  >
                    <option value="" disabled>Changer rôle</option>
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="merchant">Marchand</option>
                    <option value="partner">Partenaire</option>
                  </select>
                  <Button
                    onClick={() => handleSetStatus(u.id, u.is_active ? "inactive" : "active")}
                    disabled={updating === u.id}
                    variant="outline"
                    size="sm"
                    className="inline-flex items-center"
                  >
                    {u.is_active ? <UserX className="w-4 h-4 mr-1" /> : <UserCheck className="w-4 h-4 mr-1" />}
                    {u.is_active ? "Suspendre" : "Activer"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {users?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          Aucun utilisateur trouvé
        </div>
      )}
    </div>
  );
};

export default UserTable;
