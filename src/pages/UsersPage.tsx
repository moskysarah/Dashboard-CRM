import React, { useState, useMemo, useEffect } from "react";
import { useUsers } from "../hooks/useUsers";
import { useTranslate } from "../contexts/translateContext";
import type { User, UserRole } from "../types/domain";
import DashboardLayout from "../layouts/dashboardLayout";
import T from "../components/T";

// ===== Options (copiées depuis UserManagement) =====
const roleOptions: UserRole[] = ["admin", "user", "superadmin"];

const roleColors: Record<UserRole, string> = {
  admin: "bg-blue-400 text-white",
  user: "bg-yellow-300 text-gray-800",
  superadmin: "bg-purple-400 text-white",
};

const statusColors: Record<"Active" | "Suspended", string> = {
  Active: "bg-green-400 text-white",
  Suspended: "bg-red-400 text-white",
};

// ===== Section Card Composant (copié depuis UserManagement) =====
interface SectionCardProps {
  title: React.ReactNode;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative w-full">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// ===== UsersPage Component =====
const UsersPage: React.FC = () => {
  const { users, loading, error, refreshUsers, updateUserStatus, updateUserRole, currentPage, totalUsers, pageSize } = useUsers();
  const { translate } = useTranslate();
  const [selectedUserIdForRoleChange, setSelectedUserIdForRoleChange] = useState<number | null>(null);
  const [placeholderText, setPlaceholderText] = useState<string>("Rechercher une option");

  useEffect(() => {
    const performTranslation = async () => {
      try {
        const result = await translate("Rechercher une option");
        setPlaceholderText(result);
      } catch (error) {
        console.error('Translation error for placeholder:', error);
        setPlaceholderText("Rechercher une option"); // Fallback
      }
    };

    performTranslation();
  }, [translate]);

  const handleToggleStatus = (user: User) => {
    updateUserStatus(user.id, !user.is_active);
  };

  const handleChangeRole = (userId: number, role: UserRole) => {
    updateUserRole(userId, role);
    setSelectedUserIdForRoleChange(null);
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  // Logique pour générer les numéros de page à afficher
  const paginationItems = useMemo(() => {
    const items: (number | string)[] = [];
    const siblings = 1;
    const totalPageNumbers = siblings * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      const leftSiblingIndex = Math.max(currentPage - siblings, 1);
      const rightSiblingIndex = Math.min(currentPage + siblings, totalPages);
      const shouldShowLeftDots = leftSiblingIndex > 2;
      const shouldShowRightDots = rightSiblingIndex < totalPages - 1;

      items.push(1);
      if (shouldShowLeftDots) items.push("...");
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        if (i > 1 && i < totalPages) items.push(i);
      }
      if (shouldShowRightDots) items.push("...");
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen">
        <SectionCard title={<T>Gestion des Utilisateurs</T>}>
          <div className="overflow-x-auto">
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-30">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
              {error && !loading && (
                <div className="text-center py-4 text-red-500">{error}</div>
              )}
              <table className="w-full divide-y divide-gray-200 text-center text-xs">
                <thead className="sticky top-0 z-20 bg-gray-50">
                  <tr>
                    {[<T>Profil</T>, <T>Nom</T>, <T>Email</T>, <T>Date Inscription</T>, <T>Rôle</T>, <T>Statut</T>, <T>Actions</T>].map((h, index) => (
                      <th key={index} className="px-3 py-2 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-2 text-center">
                        <div className="flex justify-center items-center">
                          <img src={u.profile_image || '/images/default-avatar.png'} alt={u.username} className="w-8 h-8 rounded-full" />
                        </div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">{capitalize(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.email || 'N/A'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}</td>
                      <td className="px-3 py-2 text-center relative">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${roleColors[u.role || 'user']}`}
                          onClick={() => setSelectedUserIdForRoleChange(selectedUserIdForRoleChange === u.id ? null : u.id)}
                        >
                          <T>{u.role || 'user'}</T>
                        </span>
                        {selectedUserIdForRoleChange === u.id && (
                          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-56 bg-white border shadow-lg rounded-lg z-30">
                            <input type="text" placeholder={placeholderText} className="w-full px-3 py-2 text-xs border-b outline-none" />
                            <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                              {roleOptions.map((r) => (
                                <div key={r} onClick={() => handleChangeRole(u.id, r)} className={`cursor-pointer text-xs px-2 py-0.5 rounded-full ${roleColors[r]} text-center hover:opacity-80`}>
                                  <T>{r}</T>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[u.is_active ? "Active" : "Suspended"]}`}>
                          {u.is_active ? <T>Actif</T> : <T>Suspendu</T>}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${u.is_active ? "bg-red-400 hover:bg-red-500 text-white" : "bg-green-400 hover:bg-green-500 text-white"}`}
                        >
                          {u.is_active ? <T>Suspendre</T> : <T>Activer</T>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-600">
                <T>Page</T> {currentPage} <T>sur</T> {totalPages} ({totalUsers} <T>utilisateurs</T>)
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => refreshUsers(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  <T>Précédent</T>
                </button>
                {paginationItems.map((item, index) =>
                  typeof item === "string" ? (
                    <span key={`dots-${index}`} className="px-2 py-1 text-xs text-gray-500">...</span>
                  ) : (
                    <button
                      key={item}
                      onClick={() => refreshUsers(item)}
                      disabled={item === currentPage}
                      className={`px-2 py-1 text-xs font-semibold rounded-md ${item === currentPage ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
                    >
                      {item}
                    </button>
                  )
                )}
                <button
                  onClick={() => refreshUsers(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-2 py-1 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                >
                  <T>Suivant</T>
                </button>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
};

export default UsersPage;