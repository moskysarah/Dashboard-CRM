import React, { useEffect, useState } from "react";
import Avatar from "../components/avatar";
import WalletCard from "../components/userWallet";
import TransactionsTable from "../components/userTransactions";
import { getClientWallet, getClientTransactions } from "../services/api";
import { useAuth } from "../store/auth";

const DashboardUser: React.FC = () => {
  const user = useAuth((state) => state.user);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const [wallet, setWallet] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setError("Utilisateur non authentifié.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [walletRes, txRes] = await Promise.all([
          getClientWallet(),
          getClientTransactions(),
        ]);
        // setProfile(null);
        setWallet(walletRes.data);
        setTransactions(txRes.data.results);
      } catch (err: any) {
        console.error(err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAuthenticated, user]);

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      {user && (
        <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
          <Avatar
            firstName={user.first_name}
            lastName={user.last_name}
            role={user.role}
            size="w-20 h-20"
          />
          <h2 className="mt-3 text-xl font-semibold">{user.first_name} {user.last_name}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-gray-600 mt-1 capitalize">{user.role}</p>
        </div>
      )}

      <WalletCard wallet={wallet} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
};

export default DashboardUser;
