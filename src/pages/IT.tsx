import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { Server, Bug, Key, Wifi, Database, Download } from "lucide-react";
import type { Ticket } from "../types/domain";
import fetchTicketsIT from "../services/api";

const typeIcon = {
  "Problème de serveur": <Server className="inline-block mr-2 w-6 h-6 text-red-500" />,
  "Bug CRM module ventes": <Bug className="inline-block mr-2 w-6 h-6 text-yellow-500" />,
  "Demande d'accès VPN": <Key className="inline-block mr-2 w-6 h-6 text-green-500" />,
  "Erreur base de données": <Database className="inline-block mr-2 w-6 h-6 text-purple-500" />,
  "Problème de réseau": <Wifi className="inline-block mr-2 w-6 h-6 text-blue-500" />,
  "Mise à jour logiciel": <Download className="inline-block mr-2 w-6 h-6 text-indigo-500" />,
};

const IT: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Ouvert" | "En cours" | "Résolu">("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const response = await fetchTicketsIT({});
        setTickets(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des tickets:", err);
        setError("Erreur lors du chargement des tickets.");
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
  }, []);

  const filteredTickets =
    filter === "Tous" ? tickets : tickets.filter((t) => t.status === filter);

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Module IT - Support & Gestion</h1>

        <div className="mb-6 flex gap-3">
          {["Tous", "Ouvert", "En cours", "Résolu"].map((status) => (
            <button
              key={status}
            onClick={() => setFilter(status as "Tous" | "Ouvert" | "En cours" | "Résolu")}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Chargement des tickets...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-4 bg-white rounded-2xl shadow hover:shadow-xl transition"
              >
                <div className="flex items-center gap-4">
                  <div>{typeIcon[ticket.title as keyof typeof typeIcon]}</div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{ticket.title}</h3>
                    <p className="text-sm text-gray-500">{ticket.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.status === "Ouvert"
                        ? "bg-red-100 text-red-600"
                        : ticket.status === "En cours"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {ticket.status}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ticket.priority === "Haute"
                        ? "bg-red-500 text-white"
                        : ticket.priority === "Moyenne"
                        ? "bg-yellow-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default IT;
