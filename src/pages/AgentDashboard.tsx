import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import AvatarRole from "../components/AvatarRole";
import WalletCard from "../components/agentwallet";
import TransactionsTable from "../components/agentTransactionTable";
import { getAgentProfile, getAgentWallet, getAgentTransactions } from "../services/api";

const AgentDashboard: React.FC = () => {
  const [agent, setAgent] = useState<any>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [profileRes, walletRes, txRes] = await Promise.all([
          getAgentProfile(),
          getAgentWallet(),
          getAgentTransactions(),
        ]);

        setAgent(profileRes.data);
        setWallet(walletRes.data);
        setTransactions(txRes.data);
      } catch (err: any) {
        console.error(err);
        if (err.response?.status === 403) {
          setError("Accès refusé : permissions insuffisantes.");
        } else {
          setError("Impossible de charger les données.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">Chargement en cours...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-red-500">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen space-y-8">
        {/* Profil simplifié avec AvatarRole */}
        {agent && (
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
            <AvatarRole
              firstName={agent.first_name}
              lastName={agent.last_name}
              role={agent.role}
              size="w-20 h-20"
            />
            <h2 className="mt-3 text-xl font-semibold text-gray-800">
              {agent.first_name} {agent.last_name}
            </h2>
            <p className="text-gray-500 text-sm">{agent.email}</p>
            <p className="text-gray-600 mt-1 capitalize">{agent.role}</p>
          </div>
        )}

        {/* Carte du portefeuille */}
        <WalletCard wallet={wallet} loading={loading} />

        {/* Historique des transactions */}
        <TransactionsTable
          transactions={transactions}
          loading={loading}
          error={error}
        />
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
