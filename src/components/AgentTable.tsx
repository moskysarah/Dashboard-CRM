import React, { useState } from "react";
import { useAgents } from "../hooks/useAgents";
import { deleteAgent, activateAgent, getAgentStats } from "../api/agents";
import { Button } from "./ui/Button";
import AgentForm from "./AgentForm.tsx";
import { Users, Edit, Trash2, UserCheck, UserX, BarChart3 } from "lucide-react";
import type { Agent, AgentStats } from "../types/Agent";
const AgentTable: React.FC = () => {
  const { data: agents, loading, error, refetch } = useAgents();
  const [updating, setUpdating] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>();
  const [showStats, setShowStats] = useState<AgentStats | null>(null);

  const handleDelete = async (agentId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet agent ?")) return;

    setUpdating(agentId);
    try {
      await deleteAgent(agentId);
      refetch();
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression de l'agent");
    } finally {
      setUpdating(null);
    }
  };

  const handleActivate = async (agentId: string) => {
    setUpdating(agentId);
    try {
      await activateAgent(agentId);
      refetch();
    } catch (err) {
      console.error("Erreur lors de l'activation:", err);
      alert("Erreur lors de l'activation de l'agent");
    } finally {
      setUpdating(null);
    }
  };

  const handleViewStats = async (agent: Agent) => {
    try {
      const stats = await getAgentStats(agent.id);
      setShowStats(stats);
    } catch (err) {
      console.error("Erreur lors de la récupération des statistiques:", err);
      alert("Erreur lors de la récupération des statistiques");
    }
  };

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setShowForm(true);
  };

  const handleCreate = () => {
    setEditingAgent(undefined);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    refetch();
    setShowForm(false);
    setEditingAgent(undefined);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAgent(undefined);
  };

  if (loading) return <p>Chargement des agents...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center">
          <Users className="w-6 h-6 mr-2 text-blue-600" />
          Gestion des Agents
        </h3>
        <Button
          onClick={handleCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white text-center"
        >
          Ajouter un Agent
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <tr>
              <th className="p-4 font-semibold text-gray-700">Nom</th>
              <th className="p-4 font-semibold text-gray-700">Email</th>
              <th className="p-4 font-semibold text-gray-700">Téléphone</th>
              <th className="p-4 font-semibold text-gray-700">Région</th>
              <th className="p-4 font-semibold text-gray-700">Statut</th>
              <th className="p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents?.map((agent: Agent) => (
              <tr key={agent.id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200">
                <td className="p-4 font-medium text-gray-900">
                  {agent.first_name} {agent.last_name}
                </td>
                <td className="p-4 text-gray-600">{agent.email}</td>
                <td className="p-4 text-gray-600">{agent.phone || "-"}</td>
                <td className="p-4 text-gray-600">{agent.region || "-"}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      agent.is_active
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {agent.is_active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-4 space-x-2">
                  <Button
                    onClick={() => handleViewStats(agent)}
                    variant="outline"
                    size="sm"
                    title="Voir les statistiques"
                  >
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleEdit(agent)}
                    variant="outline"
                    size="sm"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleActivate(agent.id)}
                    disabled={updating === agent.id}
                    variant="outline"
                    size="sm"
                    title={agent.is_active ? "Suspendre" : "Activer"}
                  >
                    {agent.is_active ? (
                      <UserX className="w-4 h-4" />
                    ) : (
                      <UserCheck className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleDelete(agent.id)}
                    disabled={updating === agent.id}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {agents?.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          Aucun agent trouvé
        </div>
      )}

      {/* Agent Form Modal */}
      {showForm && (
        <AgentForm
          agent={editingAgent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Stats Modal */}
      {showStats && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                Statistiques de l'Agent
              </h3>
              <Button
                onClick={() => setShowStats(null)}
                variant="ghost"
                size="sm"
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <UserX className="w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Transactions Totales</h4>
                <p className="text-2xl font-bold text-blue-600">{showStats.total_transactions}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Montant Total</h4>
                <p className="text-2xl font-bold text-green-600">{showStats.total_amount} FC</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-gray-800 mb-4">Statistiques Mensuelles</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 font-semibold text-gray-700">Mois</th>
                      <th className="p-3 font-semibold text-gray-700">Transactions</th>
                      <th className="p-3 font-semibold text-gray-700">Montant</th>
                    </tr>
                  </thead>
                  <tbody>
                    {showStats.monthly_stats.map((stat, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="p-3 text-gray-900">{stat.month}</td>
                        <td className="p-3 text-gray-600">{stat.transactions}</td>
                        <td className="p-3 text-gray-600">{stat.amount} FC</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentTable;
