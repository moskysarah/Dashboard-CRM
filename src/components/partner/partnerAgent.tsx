import { useEffect, useState } from "react";
import { getPartnerAgents } from "../../services/partners";

const PartnerAgents = ({ id }: { id: number | string }) => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    getPartnerAgents(id).then((res) => setAgents(res.data));
  }, [id]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-bold mb-2">Agents du partenaire</h3>
      <ul className="bg-white p-4 rounded-lg shadow-md">
        {agents.map((agent: any) => (
          <li key={agent.id} className="border-b py-2">
            {agent.name} — {agent.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PartnerAgents;
