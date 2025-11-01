import React, { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import type { User, UserRole } from "../../types/domain";
import Avatar from "../../components/avatar";
import SectionCard from "../../components/sectionCard";

// Tes composants spécifiques
import CommissionTable from "../../components/admin/commissionTable";
import AgentStat from "../../components/admin/agentStats";
import PartnerTable from "../../components/admin/partnerTable";
import AgentATable from "../../components/admin/agentTable";

const roleOptions: UserRole[] = ["superadmin", "admin", "agent", "partner", "user"];
const statusColors: Record<"Active" | "Suspended", string> = {
  Active: "bg-green-400 text-white",
  Suspended: "bg-red-400 text-white",
};

const capitalize = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const DashboardSuperAdmin: React.FC = () => {
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    <div className="relative min-h-screen p-4">
      {/* Gestion Utilisateurs */}
      <SectionCard title="Gestion des Utilisateurs">
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
                {["Profil", "Nom", "Email", "Date Inscription", "Rôle", "Statut", "Actions"].map(
                  (h, i) => (
                    <th
                      key={i}
                      className="px-3 py-2 font-medium text-gray-500 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-center">
                    <Avatar firstName={u.first_name || ""} lastName={u.last_name || ""} role={u.role || "admin"} size="w-8 h-8" />
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
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedUserIdForRoleChange(
                          selectedUserIdForRoleChange === u.id ? null : u.id
                        )
                      }
                    >
                      <Avatar firstName={u.first_name || ""} lastName={u.last_name || ""} role={u.role || "admin"} size="w-16 h-6 text-xs" />
                    </span>
                    {selectedUserIdForRoleChange === u.id && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-40 bg-white border shadow-lg rounded-lg z-30">
                        {roleOptions.map((r) => (
                          <div
                            key={r}
                            onClick={() => handleChangeRole(u.id, r)}
                            className="cursor-pointer text-xs px-2 py-1 rounded-full text-center hover:opacity-80"
                          >
                            <Avatar firstName={u.first_name || ""} lastName={u.last_name || ""} role={r} size="w-16 h-6 text-xs" />
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      u.is_active ? statusColors["Active"] : statusColors["Suspended"]
                    }`}>
                      {u.is_active ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap relative z-40">
                    <div className="flex gap-1 flex-wrap justify-center">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                          u.is_active ? "bg-red-400 hover:bg-red-500 text-white" : "bg-green-400 hover:bg-green-500 text-white"
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
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600 text-xs"
            >
              Créer un utilisateur
            </button>
            <span className="text-xs text-gray-600">
              Page {currentPage} sur {totalPages} ({totalUsers} utilisateurs)
            </span>
          </div>
        </div>
      </SectionCard>

      {/* Commission */}
      <SectionCard title="Commissions">
        <CommissionTable />
      </SectionCard>

      {/* Statistiques Agents */}
      <SectionCard title="Statistiques des Agents">
        <AgentStat />
      </SectionCard>

      {/* Partenaires */}
      <SectionCard title="Partenaires">
        <PartnerTable />
      </SectionCard>

      {/* Agents détaillés */}
      <SectionCard title="Agents">
        <AgentATable />
      </SectionCard>

      {/* Modal Création */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Créer un nouvel utilisateur</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Prénom" value={newUserData.first_name} onChange={e => setNewUserData({...newUserData, first_name: e.target.value})} className="w-full p-2 border rounded"/>
              <input type="text" placeholder="Nom" value={newUserData.last_name} onChange={e => setNewUserData({...newUserData, last_name: e.target.value})} className="w-full p-2 border rounded"/>
              <input type="email" placeholder="Email" value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} className="w-full p-2 border rounded"/>
              <input type="password" placeholder="Mot de passe" value={newUserData.password} onChange={e => setNewUserData({...newUserData, password: e.target.value})} className="w-full p-2 border rounded"/>
              <select value={newUserData.role || ""} onChange={e => setNewUserData({...newUserData, role: e.target.value as UserRole})} className="w-full p-2 border rounded">
                <option value="">Sélectionner un rôle</option>
                {roleOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Annuler</button>
              <button onClick={handleCreateUser} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Créer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-96 border border-gray-200">
            <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
            <p className="mb-4 text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Annuler</button>
              <button onClick={handleDeleteUser} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardSuperAdmin;
