import React, { useMemo, useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { DollarSign, CheckCircle, Clock, XCircle } from "lucide-react";
import DashboardLayout from "../layouts/dashboardLayout";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransactions";
import MerchantWallet from "../components/merchantWallet";
import MerchantProfile from "../components/merchantProfile";
import { getProfileMerchants, getMerchantWallets, getMerchantTransactions } from "../services/api";
import * as XLSX from "xlsx";
import T from "../components/translatespace";
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

  // === Fetch API général pour transactions, profil et wallets
  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const transactionsRes = await getMerchantTransactions();
        setTransactions(transactionsRes.data.results ?? transactionsRes.data);

        const profileRes = await getProfileMerchants(user.id);
        setProfile(profileRes.data);

        const walletsRes = await getMerchantWallets();
        setWallets(walletsRes.data.results || walletsRes.data);

        setError(null);
      } catch (err: any) {
        console.error("Erreur lors du chargement des données :", err);
        setError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // === Calcul KPIs globaux
  const kpis = useMemo(
    () => ({
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalSuccess: transactions.filter((t) => t.status === "Réussi").length,
      totalPending: transactions.filter((t) => t.status === "En attente").length,
      totalFailed: transactions.filter((t) => t.status === "Échoué").length,
    }),
    [transactions]
  );

  // === Calcul performance par sous-magasin
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

  // === Export CSV
  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Produit,Montant ($),Statut,Date,Sous-magasin", ...transactions.map((t) =>
        `${t.product},${t.amount},${t.status},${t.date},${t.subStore || "Inconnu"}`
      )].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions_merchant.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // === Export Excel
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
      <DashboardLayout>
        <p className="p-6">
          <T>Chargement des données...</T>
        </p>
      </DashboardLayout>
    );

  if (error)
    return (
      <DashboardLayout>
        <p className="p-6 text-red-500">{error}</p>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mt-6 px-4 md:px-6">
        <T>Marchand</T>
      </h1>
      <p className="text-gray-600 mt-4 px-4 md:px-6">
        <T>Vos transactions et performances.</T>
      </p>

      {/* Profil marchand */}
      {profile && <MerchantProfile profile={profile} />}

      {/* Wallets */}
      {wallets.length > 0 && <MerchantWallet wallets={wallets} />}

      {/* KPIs globaux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-4 md:px-6">
        <MerchantKPI
          title={<T>Ventes totales</T>}
          value={kpis.totalAmount}
          color="bg-white shadow text-blue-700"
          icon={<DollarSign size={24} />}
          iconColor="text-blue-700"
        />
        <MerchantKPI
          title={<T>Transactions réussies</T>}
          value={kpis.totalSuccess}
          color="bg-white shadow text-green-700"
          icon={<CheckCircle size={24} />}
          iconColor="text-green-700"
        />
        <MerchantKPI
          title={<T>En attente</T>}
          value={kpis.totalPending}
          color="bg-white shadow text-yellow-700"
          icon={<Clock size={24} />}
          iconColor="text-yellow-700"
        />
        <MerchantKPI
          title={<T>Échouées</T>}
          value={kpis.totalFailed}
          color="bg-white shadow text-red-700"
          icon={<XCircle size={24} />}
          iconColor="text-red-700"
        />
      </div>
      {/* Transactions */}
      <div className="bg-white shadow-lg rounded-lg mt-6 mx-4 md:mx-6 p-4 flex flex-col">
        <MerchantTransactions
          transactions={transactions}
          exportCSV={exportCSV}
          exportExcel={exportExcel}
        />
        
      </div>

      {/* Performance par sous-magasin */}
      <div className="bg-white p-4 rounded-lg shadow-lg mt-6 mx-4 md:mx-6 overflow-x-auto">
        <h2 className="text-xl font-bold mb-4">
          <T>Performance par sous-magasin</T>
        </h2>
        <table className="w-full text-left border-collapse min-w-[600px] md:min-w-full">
          <thead className="border-b sticky top-0 text-center bg-gray-50">
            <tr>
              <th className="py-2 px-4 font-semibold"><T>Sous-magasin</T></th>
              <th className="py-2 px-4 font-semibold"><T>Transactions</T></th>
              <th className="py-2 px-4 font-semibold"><T>Montant total ($)</T></th>
              <th className="py-2 px-4 font-semibold"><T>Réussies</T></th>
              <th className="py-2 px-4 font-semibold"><T>En attente</T></th>
              <th className="py-2 px-4 font-semibold "><T>Échouées</T></th>
            </tr>
          </thead>
          <tbody>
            {performanceData.map((perf) => (
              <tr key={perf.subStore} className="border-b hover:bg-gray-50 text-center">
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
      <div className="bg-white p-4 rounded-lg shadow-lg mt-6 mx-4 md:mx-6">
        <h2 className="text-xl font-bold mb-4">
          <T>Transactions par sous-magasin</T>
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

    </DashboardLayout>
  );
};

export default DashboardMerchant;
