import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import DistributorKPI from "../components/distributorKPI";
import T from "../components/T";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";
import { getDistributors, getProfile, getMerchantWallets } from "../services/api";
import { useUser } from "../contexts/userContext";
import { useTransactions } from "../hooks/useTransactions";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

type Profile = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
};

type Wallet = {
  id: number;
  balance: string;
  devise: {
    codeISO: string;
    name: string;
  };
};

const DistributorDashboard: React.FC = () => {
  const user = useUser();
  const { transactions, loading: transactionsLoading, error: transactionsError } = useTransactions();
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [filter, setFilter] = useState<"Tous" | "Réussi" | "En attente" | "Échoué">("Tous");

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await getDistributors();
        setDistributors(response.data);
      } catch (err) {
        console.error("Erreur fetching distributors:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchProfileAndWallets = async () => {
      try {
        if (user?.user?.id) {
          const profileResponse = await getProfile(user.user.id);
          setProfile(profileResponse.data);
        }
        const walletsResponse = await getMerchantWallets();
        setWallets(walletsResponse.data.results || walletsResponse.data);
      } catch (err) {
        console.error("Erreur fetching profile/wallets:", err);
      } finally {
        setProfileLoading(false);
        setWalletsLoading(false);
      }
    };

    fetchDistributors();
    fetchProfileAndWallets();
  }, [user]);

  const getIconColor = (value: number) => {
    if (value > 500) return "text-green-500";
    if (value > 10) return "text-yellow-500";
    return "text-blue-500";
  };

  const totalSales = distributors.reduce((sum, d) => sum + d.sales, 0);
  const averageCommission = distributors.length > 0 ? distributors.reduce((sum, d) => sum + d.commission, 0) / distributors.length : 0;
  const totalStock = distributors.reduce((sum, d) => sum + d.stock, 0);
  const totalCommissionsEarned = distributors.reduce((sum, d) => sum + (d.sales * d.commission / 100), 0);

  const filteredTransactions = filter === "Tous" ? transactions : transactions.filter((t) => {
    const statusMap: Record<string, string> = {
      "Réussi": "SUCCESS",
      "En attente": "PENDING",
      "Échoué": "FAILED"
    };
    return t.status === statusMap[filter];
  });

  if (loading || profileLoading || walletsLoading || transactionsLoading) return <div className="flex justify-center items-center h-32"><T>Chargement du tableau de bord...</T></div>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-3"><T>Distributeur</T></h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          <T>Performance et transactions des distributeurs.</T>
        </p>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <DistributorKPI
            title={<T>Ventes Totales</T>}
            value={totalSales}
            color="bg-white text-gray-700 shadow-lg"
            icon={<ShoppingCart size={16} className={getIconColor(totalSales)} />}
          />
          <DistributorKPI
            title={<T>Commission Moyenne</T>}
            value={Math.round(averageCommission)}
            color="bg-white text-gray-700 shadow-lg"
            icon={<DollarSign size={16} className={getIconColor(averageCommission)} />}
          />
          <DistributorKPI
            title={<T>Stock Disponible</T>}
            value={totalStock}
            color="bg-white text-gray-700 shadow-lg"
            icon={<Package size={16} className={getIconColor(totalStock)} />}
          />
          <DistributorKPI
            title={<T>Commissions Totales Gagnées</T>}
            value={Math.round(totalCommissionsEarned)}
            color="bg-white text-gray-700 shadow-lg"
            icon={<TrendingUp size={16} className={getIconColor(totalCommissionsEarned)} />}
          />
        </div>

        {/* Profile and Wallet Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {profile && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4"><T>Informations du Profil</T></h2>
              <div className="flex items-center">
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
                  <p><strong><T>Nom:</T></strong> {profile.first_name} {profile.last_name}</p>
                  <p><strong><T>Email:</T></strong> {profile.email}</p>
                  <p><strong><T>Rôle:</T></strong> {profile.role}</p>
                </div>
              </div>
            </div>
          )}

          {wallets.length > 0 && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4"><T>Solde du Portefeuille</T></h2>
              {wallets.map((wallet) => (
                <p key={wallet.id}>
                  <strong>{wallet.devise.codeISO}:</strong> {wallet.balance} {wallet.devise.name}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Transactions Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4"><T>Transactions</T></h2>

          {/* Filter Buttons */}
          <div className="mb-4 flex flex-wrap gap-2">
            {["Tous", "Réussi", "En attente", "Échoué"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as "Tous" | "Réussi" | "En attente" | "Échoué")}
                className={`px-3 py-1 rounded text-sm ${
                  filter === status ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="border-b">
                <tr>
                  <th className="py-2 px-2 md:px-4"><T>ID Transaction</T></th>
                  <th className="py-2 px-2 md:px-4"><T>Montant</T></th>
                  <th className="py-2 px-2 md:px-4"><T>Statut</T></th>
                  <th className="py-2 px-2 md:px-4"><T>Type</T></th>
                  <th className="py-2 px-2 md:px-4"><T>Date</T></th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2 md:px-4">{t.codeTransaction || t.id}</td>
                    <td className="py-2 px-2 md:px-4">{t.amount} {t.devise}</td>
                    <td className="py-2 px-2 md:px-4">{t.status}</td>
                    <td className="py-2 px-2 md:px-4">{t.typeOperation}</td>
                    <td className="py-2 px-2 md:px-4">{new Date(t.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {transactionsError && (
            <p className="text-red-500 mt-4"><T>Erreur lors du chargement des transactions.</T></p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;
