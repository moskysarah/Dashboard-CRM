import React, { useEffect, useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import { getTransactions, getUserWallet } from "../services/api";
import T from "../components/T";

// ====================== Types ======================
interface Transaction {
  id: number;
  amount: number;
  status: string;
  date: string;
  description?: string;
}

interface Wallet {
  id: number;
  balance: number;
  currency: string;
  last_updated: string;
}

// ====================== Couleurs ======================
const statusColors: Record<string, string> = {
  success: "bg-green-500 text-white",
  pending: "bg-yellow-400 text-white",
  failed: "bg-red-500 text-white",
};

// ====================== Page principale ======================
const UserPage: React.FC = () => {

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger wallet et transactions
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Requêtes API
        const [walletRes, txRes] = await Promise.all([
          getUserWallet(),
          getTransactions(),
        ]);
        setWallet(walletRes.data);
        setTransactions(txRes.data);
      } catch (err: any) {
        console.error("Erreur lors du chargement :", err);
        if (err.response?.status === 403) {
          setError("Accès refusé: Permissions insuffisantes pour accéder aux données.");
        } else {
          setError("Impossible de charger vos informations.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 bg-gray-100 min-h-screen">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* ================= Wallet Section ================= */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg  font-bold mb-4 text-gray-800">
              <T>Mon Portefeuille</T>
            </h2>

            {loading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-4 text-red-500 font-medium">{error}</div>
            )}

            {!loading && wallet && (
              <div className="flex flex-col sm:flex-row justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-lg shadow-md transition-transform hover:scale-[1.01]">
                <div>
                  <p className="text-sm opacity-80"><T>Solde actuel</T></p>
                  <p className="text-3xl font-bold">{wallet.balance.toLocaleString()} {wallet.currency}</p>
                </div>
                <div className="mt-3 sm:mt-0">
                  <p className="text-sm opacity-80"><T>Dernière mise à jour</T></p>
                  <p className="font-semibold">
                    {new Date(wallet.last_updated).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ================= Transactions Section ================= */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg  font-bold mb-4 text-gray-800">
              <T>Mes Transactions</T>
            </h2>

            {loading && (
              <div className="flex justify-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && !loading && (
              <div className="text-center py-4 text-red-500 font-medium">{error}</div>
            )}

            {!loading && !error && transactions.length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm sm:text-base">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                        <T>ID</T>
                      </th>
                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                        <T>Date</T>
                      </th>
                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                        <T>Description</T>
                      </th>
                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                        <T>Montant</T>
                      </th>
                      <th className="px-3 py-2 text-left text-gray-600 font-semibold">
                        <T>Statut</T>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2 font-medium text-gray-700">{tx.id}</td>
                        <td className="px-3 py-2 text-gray-600">
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                        <td className="px-3 py-2 text-gray-600">
                          {tx.description || "—"}
                        </td>
                        <td className="px-3 py-2 font-semibold text-gray-800">
                          {tx.amount} FC
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                              statusColors[tx.status] || "bg-gray-300 text-gray-800"
                            }`}
                          >
                            <T>{tx.status}</T>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && transactions.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <T>Aucune transaction trouvée.</T>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserPage;
