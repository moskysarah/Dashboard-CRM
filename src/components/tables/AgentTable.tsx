import { useState, useEffect } from "react";
import { getMyAgents } from "../../services/agents";

const AgentTable = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyAgents = async () => {
      try {
        setLoading(true);
        const response = await getMyAgents();
        // Handle different response structures
        const agentsData = Array.isArray(response) ? response : (response?.data?.results || response?.data || []);
        setAgents(agentsData);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Erreur de chargement des agents");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAgents();
  }, []);

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!agents || !Array.isArray(agents)) return <p>No agents data available</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Gestion des agents</h3>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Nom</th>
            <th className="text-left">Email</th>
            <th className="text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent: any) => (
            <tr key={agent.id}>
              <td>{agent.name}</td>
              <td>{agent.email}</td>
              <td>{agent.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AgentTable;
