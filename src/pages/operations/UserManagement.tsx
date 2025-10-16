import React, { useState, useMemo, useEffect } from "react";
import TransactionsList from "./TransactionsList";
import ReportsList from "./RapportsList";
import { useOverviewStats } from "../../hooks/useOverviewStats";
import { useUsers } from "../../hooks/useUsers";
import { useTranslate } from "../../contexts/translateContext";
import type { User, UserRole } from "../../types/domain";
import T from "../../components/T";

// ===== Section Card Composant =====
interface SectionCardProps {
  title: string | React.ReactNode;
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

// ===== Options (copiées depuis UserManagement) =====
const roleOptions: UserRole[] = ["admin", "user", "superadmin", "merchant"];

const roleColors: Record<UserRole, string> = {
  admin: "bg-blue-500 text-white",
  user: "bg-green-500 text-white",
  superadmin: "bg-blue-500 text-white",
  merchant: "bg-yellow-500 text-white",
};

const statusColors: Record<"Active" | "Suspended", string> = {
  Active: "bg-green-400 text-white",
  Suspended: "bg-red-400 text-white",
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

// ===== UserManagement Component =====
const UserManagement: React.FC = () => {
  const { stats: overviewStats, loading: statsLoading } = useOverviewStats();
  const { users, loading: usersLoading, error: usersError, refreshUsers, updateUserStatus, updateUserRole, currentPage, totalUsers, pageSize } = useUsers();
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
    <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto overflow-x-hidden">
      {/* === Statistiques === */}
      {statsLoading ? (
        <div className="text-center p-6">Chargement des statistiques...</div>
      ) : overviewStats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Total Utilisateurs */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Total Utilisateurs</h3>
            <p className="text-xl font-bold">{overviewStats.users.total_users}</p>
          </div>
          {/* Nouveaux Utilisateurs */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Nouveaux Utilisateurs (30j)</h3>
            <p className="text-xl font-bold text-green-600">{overviewStats.users.new_users_in_period}</p>
          </div>
          {/* Volume Total Entrant */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Volume Total (Entrant)</h3>
            <p className="text-xl font-bold text-blue-600">{overviewStats.financials.total_volume_in} $</p>
          </div>
          {/* Taux de succès des transactions */}
          <div className="bg-white rounded-xl shadow-lg p-6 relative">
            <h3 className="text-gray-500 text-sm">Taux de Succès (Tx)</h3>
            <p className="text-xl font-bold text-purple-600">{overviewStats.transactions.success_rate_percent} %</p>
          </div>
        </div>
      )}

      {/* === Statistiques Financières et par Devise === */}
      {overviewStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Détails Financiers */}
          <SectionCard title="Détails Financiers (30j)">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenu Estimé:</span>
                <span className="font-bold text-green-600">{overviewStats.financials.estimated_revenue.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume Sortant:</span>
                <span className="font-bold">{overviewStats.financials.total_volume_out.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Valeur Moyenne de Transaction:</span>
                <span className="font-bold">{overviewStats.financials.average_transaction_value.toLocaleString()} $</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Marchands:</span>
                <span className="font-bold">{overviewStats.merchants.total_merchants}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Marchands Actifs:</span>
                <span className="font-bold">{overviewStats.merchants.active_merchants_in_period}</span>
              </div>
            </div>
          </SectionCard>

          {/* Statistiques par Devise */}
          <SectionCard title="Activité par Devise (30j)">
            <div className="max-h-48 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-gray-50">
                  <tr>
                    <th className="py-1 px-2 font-semibold text-gray-600">Devise</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Volume Entrant</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Succès</th>
                    <th className="py-1 px-2 font-semibold text-gray-600">Échecs</th>
                  </tr>
                </thead>
                <tbody>
                  {overviewStats.stats_per_devise.map(devise => (
                    <tr key={devise.devise__codeISO} className="border-t">
                      <td className="py-2 px-2 font-bold">{devise.devise__codeISO}</td>
                      <td className="py-2 px-2">{(devise.volume_in ?? 0).toLocaleString()}</td>
                      <td className="py-2 px-2 text-green-600">{devise.successful_count}</td>
                      <td className="py-2 px-2 text-red-600">{devise.failed_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>
      )}

      {/* === Gestion des Utilisateurs === */}
      <SectionCard title={<T>Gestion des Utilisateurs</T>}>
        <div className="overflow-x-auto">
          <div className="relative">
            {usersLoading && (
              <div className="absolute inset-0 bg-white bg-opacity-50 flex justify-center items-center z-30">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}
            {usersError && !usersLoading && (
              <div className="text-center py-4 text-red-500">{usersError}</div>
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
                        {u.profile_image ? (
                          <img src={u.profile_image} alt={u.username} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${roleColors[u.role || 'user'].split(' ')[0]}`}
                          >
                            {capitalize(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username).charAt(0).toUpperCase()}
                          </div>
                        )}
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

      {/* Transactions */}
      <SectionCard title="Transactions ">
        <TransactionsList />
      </SectionCard>

      {/* Rapports */}
      <SectionCard title="Rapport de transaction">
        <ReportsList />
      </SectionCard>
    </div>
  );
};

export default UserManagement;
