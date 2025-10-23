import React from "react";

interface Props {
  users: { id: number; name: string; email: string }[];
}

const ActiveUsersList: React.FC<Props> = ({ users }) => (
  <div className="bg-white p-4 rounded-2xl shadow w-full mb-6">
    <h2 className="text-lg font-semibold mb-3">Utilisateurs Actifs</h2>
    <ul className="divide-y divide-gray-200">
      {users.map(u => (
        <li key={u.id} className="py-2 flex justify-between">
          <span>{u.name}</span>
          <span className="text-gray-500 text-sm">{u.email}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default ActiveUsersList;
