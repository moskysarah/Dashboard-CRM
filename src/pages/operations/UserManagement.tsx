import React, { useEffect, useState } from "react";
import TransactionsList from "./TransactionsList";
import ReportsList from "./RapportsList";
import { ArrowUpRight } from "lucide-react";
import api from "../../services/api";

// === Types ==
type Permission = "Editeur" | "Lecteur";
type Role = "Admin" | "Marchand" | "Distributeur";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  createdDate: string;
  createdAt: string;
  role: Role;
  status: "Active" | "Suspended";
  permission: Permission;
  avatar: string;
};

// ===== Options =====
const roleOptions: Role[] = ["Admin", "Marchand", "Distributeur"];
const permissionOptions: Permission[] = ["Editeur", "Lecteur"];

const roleColors: Record<Role, string> = {
  Admin: "bg-blue-400 text-white text-xs px-2 py-0.5 rounded-full",
  Marchand: "bg-yellow-300 text-gray-800 text-xs px-2 py-0.5 rounded-full",
  Distributeur: "bg-purple-400 text-white text-xs px-2 py-0.5 rounded-full",
};

const permissionColors: Record<Permission, string> = {
  Editeur: "bg-green-400 text-white text-xs px-2 py-0.5 rounded-full",
  Lecteur: "bg-orange-400 text-white text-xs px-2 py-0.5 rounded-full",
};

const statusColors: Record<User["status"], string> = {
  Active: "bg-green-400 text-white text-xs px-2 py-0.5 rounded-full",
  Suspended: "bg-red-400 text-white text-xs px-2 py-0.5 rounded-full",
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
  const [users, setUsers] = useState<User[]>([]);
  const [roleDropdown, setRoleDropdown] = useState<string | null>(null);
  const [permDropdown, setPermDropdown] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/users"); // j adapte mon backend
        setUsers(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs :", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u
    ));
  };

  const changeRole = (id: string, role: Role) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
    setRoleDropdown(null);
  };

  const changePermission = (id: string, perm: Permission) => {
    setUsers(users.map(u => (u.id === id ? { ...u, permission: perm } : u)));
    setPermDropdown(null);
  };

  const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

  // Stats
  const totalUsers = users.length;
  const activeUsers = users.filter(u => u.status === "Active").length;
  const suspendedUsers = totalUsers - activeUsers;
  const admins = users.filter(u => u.role === "Admin").length;

  // Drawer
  const openDrawer = (filter: string, title: string) => {
    if (filter === "total") setFilteredUsers(users);
    if (filter === "active") setFilteredUsers(users.filter(u => u.status === "Active"));
    if (filter === "suspended") setFilteredUsers(users.filter(u => u.status === "Suspended"));
    if (filter === "admins") setFilteredUsers(users.filter(u => u.role === "Admin"));
    setDrawerTitle(title);
    setDrawerOpen(true);
  };

  if (loading) {
    return <div className="p-6">Chargement des utilisateurs...</div>;
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
          <p className="text-xl font-bold">{totalUsers}</p>
        </div>
        {/* Actifs */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("active", "Utilisateurs Actifs")}
          />
          <h3 className="text-gray-500 text-sm">Actif</h3>
          <p className="text-xl font-bold text-green-600">{activeUsers}</p>
        </div>
        {/* Suspendus */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("suspended", "Utilisateurs Suspendus")}
          />
          <h3 className="text-gray-500 text-sm">Suspendu</h3>
          <p className="text-xl font-bold text-red-600">{suspendedUsers}</p>
        </div>
        {/* Admins */}
        <div className="bg-white rounded-xl shadow-lg p-6 relative">
          <ArrowUpRight
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => openDrawer("admins", "Administrateurs")}
          />
          <h3 className="text-gray-500 text-sm">Admin</h3>
          <p className="text-xl font-bold text-blue-600">{admins}</p>
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
                  {["Profil", "Nom", "Email", "Téléphone", "Entreprise", "Date", "Heure", "Statut", "Rôle", "Permission"].map((h) => (
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
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                    </td>
                    <td className="px-3 py-2">{capitalize(u.name)}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">{u.phone}</td>
                    <td className="px-3 py-2">{u.company}</td>
                    <td className="px-3 py-2">{u.createdDate}</td>
                    <td className="px-3 py-2">{u.createdAt}</td>
                    <td className="px-3 py-2">
                      <span className={`${statusColors[u.status]}`}>{u.status}</span>
                    </td>
                    <td className="px-3 py-2">{u.role}</td>
                    <td className="px-3 py-2">{u.permission}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Gestion des utilisateurs */}
      <SectionCard title="Gestion des Utilisateurs">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 text-center text-xs">
            <thead className="sticky top-0 z-20 bg-gray-50">
              <tr>
                {["Profil", "Nom", "Email", "Date", "Heure", "Rôle", "Permission", "Statut", "Actions"].map((h) => (
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
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                    </div>
                  </td>
                  {/* Nom */}
                  <td className="px-3 py-2 whitespace-nowrap font-medium">{capitalize(u.name)}</td>
                  {/* Email */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.email}</td>
                  {/* Date */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.createdDate}</td>
                  {/* Heure */}
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">{u.createdAt}</td>
                  {/* Rôle */}
                  <td className="px-3 py-2 text-center relative">
                    <span
                      className={`${roleColors[u.role]} cursor-pointer`}
                      onClick={() => setRoleDropdown(roleDropdown === u.id ? null : u.id)}
                    >
                      {u.role}
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
                              onClick={() => changeRole(u.id, r)}
                              className={`cursor-pointer ${roleColors[r]} text-center hover:opacity-80`}
                            >
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>
                  {/* Permission */}
                  <td className="px-3 py-2 text-center relative">
                    <span
                      className={`${permissionColors[u.permission]} cursor-pointer`}
                      onClick={() => setPermDropdown(permDropdown === u.id ? null : u.id)}
                    >
                      {u.permission}
                    </span>

                    {permDropdown === u.id && (
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-56 bg-white border shadow-lg rounded-lg z-30">
                        {/* Barre de recherche */}
                        <input
                          type="text"
                          placeholder="Rechercher une option"
                          className="w-full px-3 py-2 text-xs border-b outline-none"
                        />
                        <div className="max-h-48 overflow-y-auto p-2 space-y-2">
                          {permissionOptions.map((p) => (
                            <div
                              key={p}
                              onClick={() => changePermission(u.id, p)}
                              className={`cursor-pointer ${permissionColors[p]} text-center hover:opacity-80`}
                            >
                              {p}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </td>

                  {/* Statut */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={`${statusColors[u.status]} font-semibold`}>{u.status}</span>
                  </td>
                  {/* Actions */}
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => toggleStatus(u.id)}
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-colors ${
                        u.status === "Active"
                          ? "bg-red-400 hover:bg-red-500 text-white"
                          : "bg-green-400 hover:bg-green-500 text-white"
                      }`}
                    >
                      {u.status === "Active" ? "Suspendre" : "Activer"}
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
