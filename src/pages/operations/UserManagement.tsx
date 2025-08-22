// src/pages/Users.tsx
import React, { useState } from "react";

type Permission = "read" | "write" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "merchant" | "distributor";
  status: "active" | "suspended";
  permission: Permission;
};

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Alice", email: "alice@example.com", role: "admin", status: "active", permission: "admin" },
    { id: "2", name: "Bob", email: "bob@example.com", role: "merchant", status: "active", permission: "write" },
    { id: "3", name: "Charlie", email: "charlie@example.com", role: "distributor", status: "suspended", permission: "read" },
  ]);

  const toggleStatus = (id: string) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: u.status === "active" ? "suspended" : "active" } : u
    ));
  };

  const changeRole = (id: string, role: User["role"]) => {
    setUsers(users.map(u => (u.id === id ? { ...u, role } : u)));
  };

  const changePermission = (id: string, permission: Permission) => {
    setUsers(users.map(u => (u.id === id ? { ...u, permission } : u)));
  };

  return (
    <div className="p-6 bg-white p-4 rounded-lg shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="py-2 px-4 text-center">Nom</th>
            <th className="py-2 px-4 text-center">Email</th>
            <th className="py-2 px-4 text-center">Rôle</th>
            <th className="py-2 px-4 text-center">Permission</th>
            <th className="py-2 px-4 text-center">Statut</th>
            <th className="py-2 px-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 text-center">{u.name}</td>
              <td className="py-2 px-4 text-center">{u.email}</td>
              <td className="py-2 px-4 text-center">
                <select
                  value={u.role}
                  onChange={(e) => changeRole(u.id, e.target.value as User["role"])}
                  className="border rounded px-2 py-1"
                >
                  <option value="admin">Admin</option>
                  <option value="merchant">Marchand</option>
                  <option value="distributor">Distributeur</option>
                </select>
              </td>
              <td className="py-2 px-4 text-center">
                <select
                  value={u.permission}
                  onChange={(e) => changePermission(u.id, e.target.value as Permission)}
                  className="border rounded px-2 py-1"
                >
                  <option value="read">Lecture</option>
                  <option value="write">Écriture</option>
                  <option value="erase">Supprimer</option>
                </select>
              </td>
              <td className="py-2 px-4 text-center">{u.status}</td>
              <td className="py-2 px-4 text-center">
                <button
                  onClick={() => toggleStatus(u.id)}
                  className={`px-2 py-1 rounded ${
                    u.status === "active" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  }`}
                >
                  {u.status === "active" ? "Suspendre" : "Activer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
