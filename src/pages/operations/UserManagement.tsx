import React, { useState, useMemo } from "react";
import TransactionsList from "./TransactionsList";
import ReportsList from "./RapportsList";
import { ArrowUpRight } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import type { User, UserRole } from "../../types/domain";

// ===== Options =====
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

// ===== Section Card Composant =====
interface SectionCardProps {
  title: string;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white w-300 rounded-xl shadow-lg p-6 mb-6 relative">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

// ===== UserManagement Component =====
const UserManagement: React.FC = () => {
  const { users, loading, error, refreshUsers, updateUserStatus, updateUserRole } = useUsers();
  const [roleDropdown, setRoleDropdown] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleToggleStatus = (user: User) => {
    updateUserStatus(user.id, !user.is_active);
  };

  const handleChangeRole = (userId: number, role: UserRole) => {
    updateUserRole(userId, role);
    setRoleDropdown(null);
  };

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  // Stats
  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.is_active).length;
    const suspendedUsers = totalUsers - activeUsers;
    const admins = users.filter(u => u.role === "admin" || u.role === "superadmin").length;
    return { totalUsers, activeUsers, suspendedUsers, admins };
  }, [users]);

  // Drawer
  const openDrawer = (filter: string, title: string) => {
    if (filter === "total") setFilteredUsers(users);
    if (filter === "active") setFilteredUsers(users.filter(u => u.is_active));
    if (filter === "suspended") setFilteredUsers(users.filter(u => !u.is_active));
    if (filter === "admins") setFilteredUsers(users.filter(u => u.role === "admin" || u.role === "superadmin"));
    setDrawerTitle(title);
    setDrawerOpen(true);
  };

  if (loading) {
    return <div className="p-6">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen overflow-y-auto overflow-x-hidden">
      {/* === Statistiques === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Total */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("total", "Total Utilisateurs")}
          />
          <h3 className="text-gray-500 text-sm">Total Utilisateurs</h3>
          <p className="text-xl font-bold">{stats.totalUsers}</p>
        </div>
        {/* Actifs */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("active", "Utilisateurs Actifs")}
          />
          <h3 className="text-gray-500 text-sm">Actif</h3>
          <p className="text-xl font-bold text-green-600">{stats.activeUsers}</p>
        </div>
        {/* Suspendus */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("suspended", "Utilisateurs Suspendus")}
          />
          <h3 className="text-gray-500 text-sm">Suspendu</h3>
          <p className="text-xl font-bold text-red-600">{stats.suspendedUsers}</p>
        </div>
        {/* Admins */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("admins", "Administrateurs")}
          />
          <h3 className="text-gray-500 text-sm">Admin</h3>
          <p className="text-xl font-bold text-blue-600">{stats.admins}</p>
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed top-0 right-0 w-full md:w-[900px] h-full bg-white shadow-2xl p-8 overflow-y-auto overflow-x-hidden z-50">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">{drawerTitle}</h3>
            <button
              className="text-gray-400 hover:text-red-500 text-xl"
              onClick={() => setDrawerOpen(false)}
            >
              ✕
            </button>
          </div>

          {/* Table responsive */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 text-left text-xs">
              <thead className="bg-gray-50 sticky top-0 z-20">
                <tr>
                  {["Profil", "Nom", "Email", "Téléphone", "Date d'inscription", "Statut", "Rôle"].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-2 font-semibold text-gray-600 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2">
                      <img src={u.profile_image || '/images/default-avatar.png'} alt={u.username} className="w-8 h-8 rounded-full" />
                    </td>
                    <td className="px-3 py-2">{capitalize(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username)}</td>
                    <td className="px-3 py-2">{u.email || 'N/A'}</td>
                    <td className="px-3 py-2">{u.phone}</td>
                    <td className="px-3 py-2">{u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}</td>
                    <td className="px-3 py-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColors[u.is_active ? "Active" : "Suspended"]}`}>
                        {u.is_active ? "Actif" : "Suspendu"}
                      </span>
                    </td>
                    <td className="px-3 py-2">{u.role || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gestion des utilisateurs */}
      <SectionCard title="Gestion des Utilisateurs">
        <button
          onClick={refreshUsers}
          className="absolute top-6 right-6 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition"
        >
          🔄 Rafraîchir
        </button>
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 text-center text-xs">
            <thead className="sticky top-0 z-20 bg-gray-50">
              <tr>
                {["Profil", "Nom", "Email", "Date Inscription", "Rôle", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-3 py-2 font-medium text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                  {/* Profil */}
                  <td className="px-3 py-2 text-center">
                    <div className="flex justify-center items-center">
                      <img src={u.profile_image || '/images/default-avatar.png'} alt={u.username} className="w-8 h-8 rounded-full" />
                    </div>
                  </td>
                  {/* Nom */}
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{capitalize(`${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username)}</td>
                  {/* Email */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.email || 'N/A'}</td>
                  {/* Date */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.date_joined ? new Date(u.date_joined).toLocaleDateString() : 'N/A'}</td>
                  {/* Rôle */}
                  <td className="px-3 py-2 text-center relative">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full cursor-pointer ${roleColors[u.role || 'user']}`}
                      onClick={() => setRoleDropdown(roleDropdown === u.id ? null : u.id)}
                    >
                      {u.role || 'user'}
                    </span>

                    {roleDropdown === u.id && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-56 bg-white border shadow-lg rounded-lg z-30">
                        {/* Barre de recherche */}
                        <input
                          type="text"
                          placeholder="Rechercher une option"
                          className="w-full px-3 py-2 text-xs border-b outline-none"
                        />
                        <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                          {roleOptions.map((r) => (
                            <div
                              key={r}
                              onClick={() => handleChangeRole(u.id, r)}
                              className={`cursor-pointer text-xs px-2 py-0.5 rounded-full ${roleColors[r]} text-center hover:opacity-80`}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Statut */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusColors[u.is_active ? "Active" : "Suspended"]}`}>
                      {u.is_active ? "Actif" : "Suspendu"}
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-3 py-2 whitespace-nowrap">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
