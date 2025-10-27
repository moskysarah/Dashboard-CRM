import React, { useState, useEffect, type JSX } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { Server, Bug, Key, Wifi, Database, Download } from "lucide-react";
import type { Ticket } from "../types/domain";
import { fetchTicketsIT } from "../services/api";
import {
  ticketStatusToLabel,
  ticketPriorityToLabel,
} from "../utils/ticketStatusLabel";

// Icônes par type de ticket
const typeIcon: Record<string, JSX.Element> = {
  "Problème de serveur": <Server className="inline-block mr-2 w-6 h-6 text-red-500" />,
  "Bug CRM module ventes": <Bug className="inline-block mr-2 w-6 h-6 text-yellow-500" />,
  "Demande d'accès VPN": <Key className="inline-block mr-2 w-6 h-6 text-green-500" />,
  "Erreur base de données": <Database className="inline-block mr-2 w-6 h-6 text-purple-500" />,
  "Problème de réseau": <Wifi className="inline-block mr-2 w-6 h-6 text-blue-500" />,
  "Mise à jour logiciel": <Download className="inline-block mr-2 w-6 h-6 text-indigo-500" />,
};

const Settings: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filter, setFilter] = useState<"Tous" | "Ouvert" | "En cours" | "Résolu">("Tous");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les tickets depuis l’API
  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const response = await fetchTicketsIT();
        setTickets(response.data || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des tickets.");
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  // Filtrage en français (mais comparaison via statut API)
  const filteredTickets =
    filter === "Tous"
      ? tickets
      : tickets.filter(
          (t) => ticketStatusToLabel[t.status] === filter
        );

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Module IT - Support & Gestion</h1>

        {/* Filtres de statut */}
        <div className="mb-6 flex gap-3 flex-wrap">
          {["Tous", "Ouvert", "En cours", "Résolu"].map((status) => (
            <button
              key={status}
              onClick={() =>
                setFilter(status as "Tous" | "Ouvert" | "En cours" | "Résolu")
              }
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

        {/* Contenu principal */}
        {loading ? (
          <p>Chargement des tickets...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : (
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {filteredTickets.length === 0 ? (
              <p className="text-gray-500">Aucun ticket trouvé.</p>
            ) : (
              filteredTickets.map((ticket) => (
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
                    {/* Statut */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.status === "OPEN"
                          ? "bg-red-100 text-red-600"
                          : ticket.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {ticketStatusToLabel[ticket.status]}
                    </span>

                    {/* Priorité */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        ticket.priority === "HIGH"
                          ? "bg-red-500 text-white"
                          : ticket.priority === "MEDIUM"
                          ? "bg-yellow-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {ticketPriorityToLabel[ticket.priority]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Settings;
