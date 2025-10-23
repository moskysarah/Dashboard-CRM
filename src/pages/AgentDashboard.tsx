import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import AgentProfile from "../components/agentProfile";
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

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-100 min-h-screen space-y-8">
        <AgentProfile agent={agent} />
        <WalletCard wallet={wallet} loading={loading} />
        <TransactionsTable transactions={transactions} loading={loading} error={error} />
      </div>
    </DashboardLayout>
  );
};

export default AgentDashboard;
