import React, { useState, useEffect } from "react";
import api, { getMerchantWallets, getProfile } from "../services/api";
import { useUser } from "../contexts/userContext.ts";

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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const transactionsResponse = await api.get("/me/transactions", {
          params: { role: user?.user?.role },
        });
        setTransactions(transactionsResponse.data);

        // Fetch profile
        if (user?.user?.id) {
          const profileResponse = await getProfile(user.user.id);
          setProfile(profileResponse.data);
        }

        // Fetch wallets
        const walletsResponse = await getMerchantWallets();
        setWallets(walletsResponse.data.results || walletsResponse.data);
      } catch (err) {
        console.error("Erreur fetching data:", err);
      } finally {
        setLoading(false);
        setProfileLoading(false);
        setWalletsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredTransactions =
    filter === "Tous" ? transactions : transactions.filter((t) => t.status === filter);

  if (loading || profileLoading || walletsLoading) return <p className="p-6">Chargement des données...</p>;

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 ml-6 w-300">
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
            {profile.first_name?.charAt(0)}{profile.last_name?.charAt(0)}
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

      <div className="mb-4 flex gap-2">
        {["Tous", "Réussi", "En attente", "Échoué"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status as "Tous" | "Réussi" | "En attente" | "Échoué")}
            className={`px-3 py-1 rounded ${
              filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="py-2">Produit</th>
            <th className="py-2">Montant ($)</th>
            <th className="py-2">Statut</th>
            <th className="py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((t) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2">{t.product}</td>
              <td className="py-2">{t.amount}</td>
              <td className="py-2">{t.status}</td>
              <td className="py-2">{t.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MerchantTransactions;
