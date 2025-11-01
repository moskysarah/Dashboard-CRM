import React, { useState, useEffect } from "react";
import { getAllAgents, updateAgentRole, toggleAgentStatus, deleteAgent } from "../../services/superAdmin/agent";
import type { User, UserRole } from "../../types/domain";
import Avatar from "../../components/avatar";

const roleOptions: UserRole[] = ["agent", "admin", "superadmin", "partner", "user"];
const statusColors: Record<"Active" | "Suspended", string> = {
  Active: "bg-green-400 text-white",
  Suspended: "bg-red-400 text-white",
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

const AgentTable: React.FC = () => {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgentIdForRoleChange, setSelectedAgentIdForRoleChange] = useState<number | null>(null);

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await getAllAgents();
      setAgents(res.data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des agents.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleRoleChange = async (agentId: number, role: UserRole) => {
    await updateAgentRole(agentId, role);
    fetchAgents();
    setSelectedAgentIdForRoleChange(null);
  };

  const handleToggleStatus = async (agent: User) => {
    await toggleAgentStatus(agent.id, !agent.is_active);
    fetchAgents();
  };

  const handleDeleteAgent = async (agentId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet agent ? Cette action est irréversible.")) return;
    await deleteAgent(agentId);
    fetchAgents();
  };

  if (loading) return <p className="text-center py-6">Chargement des agents...</p>;
  if (error) return <p className="text-red-600 text-center">{error}</p>;

  return (
    <div className="overflow-x-auto bg-white p-4 rounded-xl shadow-md">
      <table className="w-full divide-y divide-gray-200 text-center text-sm">
        <thead className="sticky top-0 bg-gray-50 z-20">
          <tr>
            {["Profil", "Nom", "Email", "Rôle", "Statut", "Actions"].map((h, i) => (
              <th key={i} className="px-3 py-2 font-medium text-gray-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {agents.map((agent) => (
            <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-3 py-2">
                <Avatar firstName={agent.first_name || ""} lastName={agent.last_name || ""} role={agent.role || "agent"} size="w-8 h-8" />
              </td>
              <td className="px-3 py-2">{capitalize(`${agent.first_name} ${agent.last_name}`)}</td>
              <td className="px-3 py-2 text-gray-500">{agent.email}</td>
              <td className="px-3 py-2 relative">
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    setSelectedAgentIdForRoleChange(
                      selectedAgentIdForRoleChange === agent.id ? null : agent.id
                    )
                  }
                >
                  {agent.role}
                </span>
                {selectedAgentIdForRoleChange === agent.id && (
                  <div className="absolute top-6 left-0 w-40 bg-white border shadow-lg rounded-md z-30">
                    {roleOptions.map((r) => (
                      <div
                        key={r}
                        className="cursor-pointer px-2 py-1 hover:bg-gray-100 text-sm"
                        onClick={() => handleRoleChange(agent.id, r)}
                      >
                        {r}
                      </div>
                    ))}
                  </div>
                )}
              </td>
              <td className="px-3 py-2">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${agent.is_active ? statusColors.Active : statusColors.Suspended}`}
                >
                  {agent.is_active ? "Actif" : "Suspendu"}
                </span>
              </td>
              <td className="px-3 py-2 flex justify-center gap-2">
                <button
                  onClick={() => handleToggleStatus(agent)}
                  className={`text-xs px-2 py-1 rounded-full font-semibold ${agent.is_active ? "bg-red-400 hover:bg-red-500 text-white" : "bg-green-400 hover:bg-green-500 text-white"}`}
                >
                  {agent.is_active ? "Suspendre" : "Activer"}
                </button>
                <button
                  onClick={() => handleDeleteAgent(agent.id)}
                  className="text-xs px-2 py-1 rounded-full font-semibold bg-red-500 hover:bg-red-600 text-white"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
