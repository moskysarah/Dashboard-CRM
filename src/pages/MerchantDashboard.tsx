import React, { useMemo, useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransaction";
import api from "../services/api";
import * as XLSX from "xlsx";
import T from "../components/T";
import type { MerchantPerformanceData } from "../hooks/useMerchantPerformance";

const MerchantDashboard: React.FC = () => {
  const [performanceData, setPerformanceData] = useState<MerchantPerformanceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const response = await api.get("/merchants/performance");
        setPerformanceData(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des performances des marchands:", err);
        setError("Impossible de charger les performances.");
        setPerformanceData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, []);

  const kpis = useMemo(() => {
    return {
      totalAmount: performanceData.reduce((sum, m) => sum + m.totalAmount, 0),
      totalSuccess: performanceData.reduce((sum, m) => sum + m.success, 0),
      totalPending: performanceData.reduce((sum, m) => sum + m.pending, 0),
      totalFailed: performanceData.reduce((sum, m) => sum + m.failed, 0),
    };
  }, [performanceData]);

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        "Nom,Sous-magasin,Transactions,Ventes réussies,En attente,Échouées,Total (€)",
        ...performanceData.map(
          (m) =>
            `${m.merchantName},${m.subStore},${m.transactionsCount},${m.success},${m.pending},${m.failed},${m.totalAmount}`
        ),
      ].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapport_performance_merchants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(performanceData.map(m => ({
      "Nom": m.merchantName,
      "Sous-magasin": m.subStore,
      "Transactions": m.transactionsCount,
      "Ventes réussies": m.success,
      "En attente": m.pending,
      "Échouées": m.failed,
      "Total (€)": m.totalAmount
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rapport Performance");
    XLSX.writeFile(workbook, "rapport_performance_merchants.xlsx");
  };

  if (loading) {
    return <DashboardLayout><p className="p-6"><T>Chargement des performances...</T></p></DashboardLayout>;
  }

  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mt-6 ml-6"><T>Marchand</T></h1>
      <p className="text-gray-600 mt-4 ml-6"><T>Performance et transactions des marchands.</T></p>

      {/* KPIs marchands */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 ml-6">
        <MerchantKPI
          title={<T>Ventes totales</T>}
          value={kpis.totalAmount}
          color="bg-green-100 shadow text-green-700"
        />
        <MerchantKPI
          title={<T>Transactions réussies</T>}
          value={kpis.totalSuccess}
          color="bg-blue-100 shadow text-blue-700"
        />
        <MerchantKPI
          title={<T>En attente</T>}
          value={kpis.totalPending}
          color="bg-yellow-100 shadow text-yellow-700"
        />
        <MerchantKPI
          title={<T>Échouées</T>}
          value={kpis.totalFailed}
          color="bg-red-100 shadow text-red-700"
        />
      </div>

      {/* Suivi de performance */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 ml-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold"><T>Suivi des performances</T></h2>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="border-b sticky top-0 text-center">
              <tr>
                <th className="py-2 px-4"><T>Nom</T></th>
                <th className="py-2 px-4"><T>Sous-magasin</T></th>
                <th className="py-2 px-4"><T>Transactions</T></th>
                <th className="py-2 px-4"><T>Succès</T></th>
                <th className="py-2 px-4"><T>En attente</T></th>
                <th className="py-2 px-4"><T>Échouées</T></th>
                <th className="py-2 px-4"><T>Total (€)</T></th>
              </tr>
            </thead>
            <tbody>
              {performanceData.map((m) => (
                <tr key={m.merchantId} className="border-b hover:bg-gray-50 text-center">
                  <td className="py-2 px-4">{m.merchantName}</td>
                  <td className="py-2 px-4">{m.subStore}</td>
                  <td className="py-2 px-4">{m.transactionsCount}</td>
                  <td className="py-2 px-4 text-green-600 font-semibold">{m.success}</td>
                  <td className="py-2 px-4 text-yellow-600 font-semibold">{m.pending}</td>
                  <td className="py-2 px-4 text-red-600 font-semibold">{m.failed}</td>
                  <td className="py-2 px-4 font-bold">{m.totalAmount}</td>
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

      {/* Transactions des marchands */}
      <MerchantTransactions />
    </DashboardLayout>
  );
};

export default MerchantDashboard;
