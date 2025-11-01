import React, { useEffect, useState } from "react";
import { getMyAgents } from "../../services/agent";

interface Agent {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

interface Props {
  onSelect?: (agentId: number) => void;
}

const MyAgentsList: React.FC<Props> = ({ onSelect }) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  const fetchAgents = async () => {
    const res = await getMyAgents();
    setAgents(res.data.results || res.data);
  };

  useEffect(() => { fetchAgents(); }, []);

  return (
    <table className="w-full bg-white shadow rounded">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2">Nom</th>
          <th className="p-2">Email</th>
          <th className="p-2">Rôle</th>
          <th className="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {agents.map(agent => (
          <tr key={agent.id} className="border-b hover:bg-gray-50">
            <td className="p-2">{agent.first_name} {agent.last_name}</td>
            <td className="p-2">{agent.email}</td>
            <td className="p-2 capitalize">{agent.role}</td>
            <td className="p-2">
              <button
                onClick={() => onSelect?.(agent.id)}
                className="px-2 py-1 bg-blue-500 text-white rounded"
              >
                Voir Performance
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MyAgentsList;
