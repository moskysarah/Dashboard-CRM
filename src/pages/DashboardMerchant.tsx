import React, { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import Avatar from "../components/avatar";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransactions";
import MerchantWallet from "../components/merchantWallet";
import { getProfileMerchant, getMerchantTransactions, getClientWallet } from "../services/api";
import * as XLSX from "xlsx";
import { useAuth } from "../store/auth";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
  subStore?: string;
};

type Wallet = {
  id: number;
  balance: string;
  devise: {
    codeISO: string;
    name: string;
  };
};

const DashboardMerchant: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = useAuth((state) => state.user);

  // === Récupération des données API ===
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [transactionsRes, profileRes, walletsRes] = await Promise.allSettled([
          getMerchantTransactions(),
          getProfileMerchant(user.id),
          getClientWallet()
        ]);

        // Handle transactions
        if (transactionsRes.status === 'fulfilled') {
          setTransactions(transactionsRes.value.data.results ?? transactionsRes.value.data);
        } else if (transactionsRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux transactions du marchand (403).");
          setTransactions([]);
        } else if (transactionsRes.reason?.response?.status === 404) {
          console.warn("Transactions du marchand non trouvées (404).");
          setTransactions([]);
        } else {
          console.error("Erreur lors du chargement des transactions:", transactionsRes.reason);
        }

        // Handle profile
        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value.data);
        } else if (profileRes.reason?.response?.status === 403) {
          console.warn("Accès refusé au profil du marchand (403).");
          setProfile(null);
        } else if (profileRes.reason?.response?.status === 404) {
          console.warn("Profil du marchand non trouvé (404).");
          setProfile(null);
        } else {
          console.error("Erreur lors du chargement du profil:", profileRes.reason);
        }

        // Handle wallets
        if (walletsRes.status === 'fulfilled') {
          setWallets(walletsRes.value.data.results || walletsRes.value.data);
        } else if (walletsRes.reason?.response?.status === 403) {
          console.warn("Accès refusé aux portefeuilles (403).");
          setWallets([]);
        } else if (walletsRes.reason?.response?.status === 404) {
          console.warn("Portefeuilles non trouvés (404).");
          setWallets([]);
        } else {
          console.error("Erreur lors du chargement des portefeuilles:", walletsRes.reason);
        }

        // Set error only if all requests failed
        if (transactionsRes.status === 'rejected' && profileRes.status === 'rejected' && walletsRes.status === 'rejected') {
          setError("Impossible de charger les données.");
        } else {
          setError(null);
        }
      } catch (err: any) {
        console.error("Erreur lors du chargement des données :", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // === Calcul des KPIs globaux ===
  const kpis = useMemo(
    () => ({
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalSuccess: transactions.filter((t) => t.status === "Réussi").length,
      totalPending: transactions.filter((t) => t.status === "En attente").length,
      totalFailed: transactions.filter((t) => t.status === "Échoué").length,
    }),
    [transactions]
  );

  // === Calcul des performances par sous-magasin ===
  const performanceData = useMemo(() => {
    const map: Record<
      string,
      {
        transactionsCount: number;
        totalAmount: number;
        success: number;
        pending: number;
        failed: number;
      }
    > = {};

    transactions.forEach((t) => {
      const store = t.subStore || "Inconnu";
      if (!map[store])
        map[store] = { transactionsCount: 0, totalAmount: 0, success: 0, pending: 0, failed: 0 };

      map[store].transactionsCount += 1;
      map[store].totalAmount += t.amount;
      if (t.status === "Réussi") map[store].success += 1;
      if (t.status === "En attente") map[store].pending += 1;
      if (t.status === "Échoué") map[store].failed += 1;
    });

    return Object.entries(map).map(([subStore, stats]) => ({ subStore, ...stats }));
  }, [transactions]);

  // === Export CSV ===
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Produit,Montant ($),Statut,Date,Sous-magasin",
        ...transactions.map(
          (t) =>
            `${t.product},${t.amount},${t.status},${t.date},${t.subStore || "Inconnu"}`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_merchant.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === Export Excel ===
  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      transactions.map((t) => ({
        Produit: t.product,
        "Montant ($)": t.amount,
        Statut: t.status,
        Date: t.date,
        "Sous-magasin": t.subStore || "Inconnu",
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions_merchant.xlsx");
  };

  if (loading)
    return (
     
        <p className="p-6">
          Chargement des données...
        </p>
      
    );

  if (error)
    return (
      
        <p className="p-6 text-red-500">{error}</p>
      
    );

  return (
    
      <div className="p-6 bg-gray-100 min-h-screen space-y-8">
        {/* Profil du marchand avec AvatarRole */}
        {profile && (
          <div className="flex flex-col items-center bg-white rounded-xl shadow p-6">
            <Avatar
              firstName={profile.first_name}
              lastName={profile.last_name}
              role={profile.role}
              size="w-20 h-20"
            />
            <h2 className="mt-3 text-xl font-semibold text-gray-800">
              {profile.first_name} {profile.last_name}
            </h2>
            <p className="text-gray-500 text-sm">{profile.email}</p>
            <p className="text-gray-600 mt-1 capitalize">{profile.role}</p>
          </div>
        )}

        {/* Wallets */}
        {wallets.length > 0 && <MerchantWallet wallets={wallets} />}

        {/* KPIs globaux */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MerchantKPI
            title={"Ventes totales"}
            value={kpis.totalAmount}
            color="bg-white shadow text-blue-700"
            icon={<DollarSign size={24} />}
            iconColor="text-blue-700"
          />
          <MerchantKPI
            title={"Transactions réussies"}
            value={kpis.totalSuccess}
            color="bg-white shadow text-green-700"
            icon={<CheckCircle size={24} />}
            iconColor="text-green-700"
          />
          <MerchantKPI
            title={"En attente"}
            value={kpis.totalPending}
            color="bg-white shadow text-yellow-700"
            icon={<Clock size={24} />}
            iconColor="text-yellow-700"
          />
          <MerchantKPI
            title={"Échouées"}
            value={kpis.totalFailed}
            color="bg-white shadow text-red-700"
            icon={<XCircle size={24} />}
            iconColor="text-red-700"
          />
        </div>

        {/* Transactions */}
        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
          <MerchantTransactions
            transactions={transactions}
            exportCSV={exportCSV}
            exportExcel={exportExcel}
          />
        </div>

        {/* Performance par sous-magasin */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Performance par sous-magasin
          </h2>
          <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
            <thead className="border-b sticky top-0 text-center bg-gray-50">
              <tr>
                <th className="py-2 px-4 font-semibold">
                  Sous-magasin
                </th>
                <th className="py-2 px-4 font-semibold">
                  Transactions
                </th>
                <th className="py-2 px-4 font-semibold">
                  Montant total ($)
                </th>
                <th className="py-2 px-4 font-semibold">
                  Réussies
                </th>
                <th className="py-2 px-4 font-semibold">
                  En attente
                </th>
                <th className="py-2 px-4 font-semibold">
                  Échouées
                </th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((perf) => (
                <tr
                  key={perf.subStore}
                  className="border-b hover:bg-gray-50 text-center"
                >
                  <td className="py-2 px-4">{perf.subStore}</td>
                  <td className="py-2 px-4">{perf.transactionsCount}</td>
                  <td className="py-2 px-4">{perf.totalAmount}</td>
                  <td className="py-2 px-4">{perf.success}</td>
                  <td className="py-2 px-4">{perf.pending}</td>
                  <td className="py-2 px-4">{perf.failed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Chart */}
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">
            Transactions par sous-magasin
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <XAxis dataKey="subStore" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="transactionsCount" fill="#0088FE" name="Transactions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
   
  );
};

export default DashboardMerchant;
