import React, { useState, useEffect } from "react";
import api, { getMerchantWallets, getProfile } from "../services/api";
import { useUser } from "../contexts/userContext.ts";
import { useAuth } from "../store/auth";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
};

type Wallet = {
  id: number;
  balance: string;
  devise: {
    codeISO: string;
    name: string;
  };
};

type Profile = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

const MerchantTransactions: React.FC = () => {
  const user = useUser();
  const { user: authUser } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!authUser) {
        setError("Utilisateur non authentifié.");
        setLoading(false);
        setProfileLoading(false);
        setWalletsLoading(false);
        return;
      }

      try {
        // Fetch transactions
        const transactionsResponse = await api.get("/me/transactions", {
          params: { role: user?.user?.role },
        });
        setTransactions(Array.isArray(transactionsResponse.data) ? transactionsResponse.data : []);

        // Fetch profile
        if (user?.user?.id) {
          const profileResponse = await getProfile(user.user.id);
          setProfile(profileResponse.data);
        }

        // Fetch wallets
        const walletsResponse = await getMerchantWallets();
        setWallets(walletsResponse.data.results || walletsResponse.data);
      } catch (err: any) {
        console.error("Erreur fetching data:", err);
        if (err.response?.status === 403) {
          setError("Accès refusé: Permissions insuffisantes pour accéder aux données.");
        } else {
          setError("Erreur lors du chargement des données.");
        }
      } finally {
        setLoading(false);
        setProfileLoading(false);
        setWalletsLoading(false);
      }
    };

    fetchData();
  }, [user, authUser]);

  const filteredTransactions =
    filter === "Tous" ? transactions : transactions.filter((t) => t.status === filter);

  if (loading || profileLoading || walletsLoading) return <p className="p-6">Chargement des données...</p>;

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 mx-4 md:mx-6">
      <h2 className="text-lg font-semibold mb-4">Transactions Marchand</h2>

      {/* Profile Information */}
      {profile && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4 ${
              profile.role === 'admin' ? 'bg-blue-500' :
              profile.role === 'merchant' ? 'bg-yellow-500' :
              profile.role === 'user' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          >
            {profile.first_name?.charAt(0)?.toUpperCase()}{profile.last_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Informations du Profil</h3>
            <p><strong>Nom:</strong> {profile.first_name} {profile.last_name}</p>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Rôle:</strong> {profile.role}</p>
          </div>
        </div>
      )}

      {/* Wallet Balance */}
      {wallets.length > 0 && (
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <h3 className="text-md font-semibold mb-2">Solde du Portefeuille</h3>
          {wallets.map((wallet) => (
            <p key={wallet.id}>
              <strong>{wallet.devise.codeISO}:</strong> {wallet.balance} {wallet.devise.name}
            </p>
          ))}
        </div>
      )}

      {/* Transactions Filter */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Filtrer les Transactions</h3>
        <div className="flex space-x-2">
          {["Tous", "Réussi", "En attente", "Échoué"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as typeof filter)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Liste des Transactions</h3>
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 border-b text-left">Produit</th>
                  <th className="px-4 py-2 border-b text-left">Montant</th>
                  <th className="px-4 py-2 border-b text-left">Statut</th>
                  <th className="px-4 py-2 border-b text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{transaction.product}</td>
                    <td className="px-4 py-2 border-b">{transaction.amount}</td>
                    <td className="px-4 py-2 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "Réussi"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "En attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 border-b">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">Aucune transaction trouvée.</p>
        )}
      </div>
    </div>
  );
};

export default MerchantTransactions;
