import React, { useEffect, useState } from "react";
import { getMyAgentsPerformance } from "../../services/agent";

interface Performance {
  agent_name: string;
  total_sales: number;
  total_transactions: number;
}

const MyAgentPerformance: React.FC = () => {
  const [data, setData] = useState<Performance[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getMyAgentsPerformance();
      setData(res.data.results || res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-lg font-bold mb-2">Performance des agents</h2>
      <table className="w-full border-collapse text-center">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-2">Agent</th>
            <th className="p-2">Total ventes</th>
            <th className="p-2">Transactions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((perf, idx) => (
            <tr key={idx} className="border-b hover:bg-gray-50">
              <td className="p-2">{perf.agent_name}</td>
              <td className="p-2">{perf.total_sales}</td>
              <td className="p-2">{perf.total_transactions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyAgentPerformance;
