import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransaction";
import api from "../services/api";
import * as XLSX from "xlsx";
import T from "../components/T";
import { useAuth } from "../store/auth";
import { useMerchantPerformance } from "../hooks/useMerchantPerformance";

type Transaction = {
  id: string;
  product: string;
  amount: number;
  status: "Réussi" | "En attente" | "Échoué";
  date: string;
};

const MerchantDashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuth((state) => state.user);
  const { performanceData, loading: performanceLoading, error: performanceError } = useMerchantPerformance();

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await api.get("/me/transactions");
        setTransactions(response.data.results ?? response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des transactions:", err);
        setError("Impossible de charger les transactions.");
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchTransactions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const kpis = useMemo(() => {
    return {
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      totalSuccess: transactions.filter((t) => t.status === "Réussi").length,
      totalPending: transactions.filter((t) => t.status === "En attente").length,
      totalFailed: transactions.filter((t) => t.status === "Échoué").length,
    };
  }, [transactions]);

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Produit,Montant ($),Statut,Date",
        ...transactions.map(
          (t) =>
            `${t.product},${t.amount},${t.status},${t.date}`
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

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(transactions.map(t => ({
      "Produit": t.product,
      "Montant ($)": t.amount,
      "Statut": t.status,
      "Date": t.date
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    XLSX.writeFile(workbook, "transactions_merchant.xlsx");
  };

  if (loading) {
    return <DashboardLayout><p className="p-6"><T>Chargement des transactions...</T></p></DashboardLayout>;
  }

  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mt-6 px-4 md:px-6"><T>Marchand</T></h1>
      <p className="text-gray-600 mt-4 px-4 md:px-6"><T>Vos transactions et performances.</T></p>

      {/* KPIs marchands */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 px-4 md:px-6">
        <MerchantKPI
          title={<T>Ventes totales</T>}
          value={kpis.totalAmount}
          color="bg-white shadow text-green-700"
        />
        <MerchantKPI
          title={<T>Transactions réussies</T>}
          value={kpis.totalSuccess}
          color="bg-white shadow text-blue-700"
        />
        <MerchantKPI
          title={<T>En attente</T>}
          value={kpis.totalPending}
          color="bg-white shadow text-yellow-700"
        />
        <MerchantKPI
          title={<T>Échouées</T>}
          value={kpis.totalFailed}
          color="bg-white shadow text-red-700"
        />
      </div>

      {/* Transactions */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 mx-4 md:mx-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold"><T>Mes Transactions</T></h2>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="border-b sticky top-0 text-center">
              <tr>
                <th className="py-2 px-4"><T>Produit</T></th>
                <th className="py-2 px-4"><T>Montant ($)</T></th>
                <th className="py-2 px-4"><T>Statut</T></th>
                <th className="py-2 px-4"><T>Date</T></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="py-2 px-4">{t.product}</td>
                  <td className="py-2 px-4">{t.amount}</td>
                  <td className="py-2 px-4">{t.status}</td>
                  <td className="py-2 px-4">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            onClick={exportCSV}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <T>Exporter CSV</T>
          </button>
          <button
            onClick={exportExcel}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            <T>Exporter Excel</T>
          </button>
        </div>
      </div>

      {/* Suivi des performances par sous-magasin */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 mx-4 md:mx-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold"><T>Suivi des performances par sous-magasin</T></h2>
        </div>
        {performanceLoading ? (
          <p><T>Chargement des performances...</T></p>
        ) : performanceError ? (
          <p className="text-red-500">{performanceError}</p>
        ) : (
          <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="border-b sticky top-0 text-center">
                <tr>
                  <th className="py-2 px-4"><T>Sous-magasin</T></th>
                  <th className="py-2 px-4"><T>Nombre de transactions</T></th>
                  <th className="py-2 px-4"><T>Montant total ($)</T></th>
                  <th className="py-2 px-4"><T>Réussies</T></th>
                  <th className="py-2 px-4"><T>En attente</T></th>
                  <th className="py-2 px-4"><T>Échouées</T></th>
                </tr>
              </thead>
              <tbody>
                {performanceData.map((perf) => (
                  <tr key={perf.merchantId} className="border-b hover:bg-gray-50 text-center">
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
        )}
      </div>

      {/* Transactions des marchands */}
      <MerchantTransactions />
    </DashboardLayout>
  );
};

export default MerchantDashboard;
