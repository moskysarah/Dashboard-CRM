import React, { useEffect, useState } from "react";
import { getMyAgents, getMyAgentsPerformance } from "../services/agent";
import MyStats from "../components/agent/myStats";
import MyTransactions from "../components/agent/myTransaction";
import MyWallet from "../components/agent/myWallet";
import CreateAgentForm from "../components/agent/createAgentForm";

const DashboardAgent: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [agentsRes, perfRes] = await Promise.all([
        getMyAgents(),
        getMyAgentsPerformance(),
      ]);

      setAgents(agentsRes.data.results || agentsRes.data);
      setPerformance(perfRes.data);
    } catch (err) {
      console.error("Erreur chargement agents :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-700">Dashboard Agent</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {showForm ? "Fermer" : "Créer un agent"}
        </button>
      </div>

      {showForm && (
        <CreateAgentForm
          onSuccess={() => {
            setShowForm(false);
            fetchData();
          }}
        />
      )}

      {!loading && (
        <>
          {performance && <MyStats stats={performance} />}
          {agents.length > 0 ? (
            <MyTransactions transactions={agents} />
          ) : (
            <p className="text-gray-600">Aucun agent trouvé.</p>
          )}
          <MyWallet wallets={[]} /> {/* Tu pourras relier ton wallet ici */}
        </>
      )}
    </div>
  );
};

export default DashboardAgent;
