import React, { useState } from "react";
import { useOverviewStats } from "../../hooks/useOverviewStats";
import { useUsers } from "../../hooks/useUsers";
import type { User, UserRole } from "../../types/domain";
import TransactionsList from "./TransactionsList";
import ReportsList from "./RapportsList";
import T from "../../components/translatespace";

interface SectionCardProps {
  title: string | React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
const SectionCard: React.FC<SectionCardProps> = ({ title, children, className }) => (
  <div className={`bg-white rounded-xl shadow-md p-4 mb-6 w-full ${className || ""}`}>
    <h2 className="text-lg font-bold mb-4">{title}</h2>
    {children}
  </div>
);

const roleOptions: UserRole[] = ["admin", "agent", "superadmin","marchand"];
const roleColors: Record<UserRole, string> = {
  admin: "bg-blue-500 text-white",
  agent: "bg-green-500 text-white",
  marchand : "bg-yellow-500 text-white",
  superadmin: "bg-purple-500 text-white",
};
const statusColors: Record<"Active" | "Suspended", string> = {
  Active: "bg-green-400 text-white",
  Suspended: "bg-red-400 text-white",
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const DashboardAdmin: React.FC = () => {
  const { stats: overviewStats, loading: statsLoading } = useOverviewStats();
  const {
    users = [],
    loading: usersLoading,
    error: usersError,
    updateUserRole,
    updateUserStatus,
    createNewUser,
    deleteUser,
    currentPage,
    totalPages,
    totalUsers,
  } = useUsers();

  const [selectedUserIdForRoleChange, setSelectedUserIdForRoleChange] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // modal suppression
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [newUserData, setNewUserData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: undefined as UserRole | undefined,
  });

  const handleToggleStatus = (user: User) => updateUserStatus(user.id, !user.is_active);

  const handleChangeRole = (userId: number, role: UserRole) => {
    updateUserRole(userId, role);
    setSelectedUserIdForRoleChange(null);
  };

  const handleCreateUser = async () => {
    if (!newUserData.role) return;
    await createNewUser(newUserData as {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
      role: UserRole;
    });
    setShowCreateModal(false);
    setNewUserData({ first_name: "", last_name: "", email: "", password: "", role: undefined });
  };

  const handleDeleteUser = async () => {
    if (userIdToDelete !== null) {
      await deleteUser(userIdToDelete);
      setUserIdToDelete(null);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <div className={`${showCreateModal || showDeleteModal ? "blur-sm pointer-events-none" : ""} p-4`}>
        {/* Statistiques */}
        {statsLoading ? (
          <div className="text-center p-6">
            <T>Chargement des statistiques...</T>
          </div>
        ) : (
          overviewStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl shadow-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm">
                  <T>Total Utilisateurs</T>
                </h3>
                <p className="text-xl font-bold">{overviewStats.users?.total_users ?? 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm">
                  <T>Nouveaux Utilisateurs (30j)</T>
                </h3>
                <p className="text-xl font-bold text-green-600">{overviewStats.users?.new_users_in_period ?? 0}</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm">
                  <T>Volume Total (Entrant)</T>
                </h3>
                <p className="text-xl font-bold text-blue-600">{overviewStats.financials?.total_volume_in ?? 0} $</p>
              </div>
              <div className="bg-white rounded-xl shadow-xl p-4 text-center">
                <h3 className="text-gray-500 text-sm">
                  <T>Taux de Succès (Tx)</T>
                </h3>
                <p className="text-xl font-bold text-purple-600">{overviewStats.transactions?.success_rate_percent ?? 0} %</p>
              </div>
            </div>
          )
        )}

        {/* Gestion Utilisateurs */}
        <SectionCard title={<T>Gestion des Utilisateurs</T>}>
          <div className="overflow-x-auto relative">
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
                  {["Profil", "Nom", "Email", "Date Inscription", "Rôle", "Statut", "Actions"].map((h, i) => (
                    <th key={i} className="px-3 py-2 font-medium text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(Array.isArray(users) ? users : []).map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2 text-center">
                      {capitalize(`${u.first_name} ${u.last_name}` || u.username).charAt(0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium">
                      {capitalize(`${u.first_name} ${u.last_name}` || u.username)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.email}</td>
                    <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                      {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-3 py-2 text-center relative">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${roleColors[u.role || "admin"]}`}
                        onClick={() =>
                          setSelectedUserIdForRoleChange(
                            selectedUserIdForRoleChange === u.id ? null : u.id
                          )
                        }
                      >
                        {u.role || "admin"}
                      </span>
                      {selectedUserIdForRoleChange === u.id && (
                        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 bg-white border shadow-lg rounded-lg z-30">
                          {(Array.isArray(roleOptions) ? roleOptions : []).map((r) => (
                            <div
                              key={r}
                              onClick={() => handleChangeRole(u.id, r)}
                              className={`cursor-pointer text-xs px-2 py-1 rounded-full ${roleColors[r]} text-center hover:opacity-80`}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[u.is_active ? "Active" : "Suspended"]}`}
                      >
                        {u.is_active ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                            u.is_active
                              ? "bg-red-400 hover:bg-red-500 text-white"
                              : "bg-green-400 hover:bg-green-500 text-white"
                          }`}
                        >
                          {u.is_active ? "Suspendre" : "Activer"}
                        </button>
                        <button
                          onClick={() => {
                            setUserIdToDelete(u.id);
                            setShowDeleteModal(true);
                          }}
                          className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination + Boutons */}
            <div className="flex justify-between items-center w-full px-4 py-2 mt-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-xs"
                >
                  <T>Créer un marchand </T>
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600 text-xs"
                >
                  <T>Supprimer un marchand</T>
                </button>
              </div>
              <span className="text-xs text-gray-600">
                Page {currentPage} sur {totalPages} ({totalUsers} marchands)
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard title={<T>Liste des Transactions</T>}>
          <TransactionsList />
        </SectionCard>

        <SectionCard title={<T>Rapports</T>}>
          <ReportsList />
        </SectionCard>
      </div>

      {/* Modal Création Utilisateur */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              <T>Créer un nouvel utilisateur</T>
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Prénom"
                value={newUserData.first_name}
                onChange={(e) => setNewUserData({ ...newUserData, first_name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Nom"
                value={newUserData.last_name}
                onChange={(e) => setNewUserData({ ...newUserData, last_name: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Mot de passe"
                value={newUserData.password}
                onChange={(e) => setNewUserData({ ...newUserData, password: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <select
                value={newUserData.role || ""}
                onChange={(e) => setNewUserData({ ...newUserData, role: e.target.value as UserRole })}
                className="w-full p-2 border rounded"
              >
                <option value="">Sélectionner un rôle</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <T>Annuler</T>
              </button>
              <button
                onClick={handleCreateUser}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <T>Créer</T>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression Utilisateur */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-bold mb-4">
              <T>Confirmer la suppression</T>
            </h3>
            <p className="mb-4">
              <T>Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.</T>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                <T>Annuler</T>
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <T>Supprimer</T>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAdmin;
