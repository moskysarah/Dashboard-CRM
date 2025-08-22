// src/pages/IT.tsx
import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";

interface Ticket {
  id: number;
  title: string;
  status: "Ouvert" | "En cours" | "Résolu";
  priority: "Haute" | "Moyenne" | "Basse";
}

const initialTickets: Ticket[] = [
  { id: 1, title: "Problème de serveur", status: "En cours", priority: "Haute" },
  { id: 2, title: "Bug CRM module ventes", status: "Ouvert", priority: "Moyenne" },
  { id: 3, title: "Demande d'accès VPN", status: "Résolu", priority: "Basse" },
];

const IT: React.FC = () => {
  const [tickets] = useState<Ticket[]>(initialTickets);
  const [filter, setFilter] = useState<"Tous" | "Ouvert" | "En cours" | "Résolu">("Tous");

  const filteredTickets =
    filter === "Tous" ? tickets : tickets.filter(t => t.status === filter);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Module IT - Support & Gestion</h1>

        <div className="mb-4 flex gap-2">
          {["Tous", "Ouvert", "En cours", "Résolu"].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-3 py-1 rounded ${
                filter === status ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Tickets IT</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-2">Titre</th>
                <th className="py-2">Statut</th>
                <th className="py-2">Priorité</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.map(ticket => (
                <tr key={ticket.id} className="border-b hover:bg-gray-50">
                  <td className="py-2">{ticket.title}</td>
                  <td className="py-2">{ticket.status}</td>
                  <td className="py-2">{ticket.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default IT;
