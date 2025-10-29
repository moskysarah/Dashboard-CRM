import React, { useEffect, useState } from "react";
import Avatar from "../components/avatar";
import WalletCard from "../components/agentWallet";
import TransactionsTable from "../components/agentTransactionTable";
import AgentForm from "../components/agentForm";
import { getAgentWallet, getAgentTransactions } from "../services/api";
import { useAuth } from "../store/auth";

const DashboardAgent: React.FC = () => {
  const user = useAuth((state) => state.user);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [walletRes, txRes] = await Promise.all([
          getAgentWallet(),
          getAgentTransactions(),
        ]);

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
    return <div className="p-6 text-center text-gray-600">Chargement en cours...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-8">
      {/* Profil agent */}
      {user && (
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
          {/* Avatar gère déjà l’affichage par rôle */}
          <Avatar
            firstName={user.first_name}
            lastName={user.last_name}
            role={user.role}
            size="w-20 h-20"
          />
          <h2 className="mt-3 text-xl font-semibold text-gray-800">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <p className="text-gray-600 mt-1 capitalize">{user.role}</p>
        </div>
      )}

      {/* Carte du portefeuille */}
      <WalletCard wallet={wallet} loading={loading} />

      {/* Historique des transactions */}
      <TransactionsTable transactions={transactions} loading={loading} error={error} />
      <AgentForm />

    </div>
  );
};

export default DashboardAgent;
