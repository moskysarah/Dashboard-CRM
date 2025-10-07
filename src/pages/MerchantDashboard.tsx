import React, { useMemo } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransaction";
import { useMerchantPerformance } from "../hooks/useMerchantPerformance";

const MerchantDashboard: React.FC = () => {
  const { performanceData, loading, error, refresh } = useMerchantPerformance();

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

  if (loading) {
    return <DashboardLayout><p className="p-6">Chargement des performances...</p></DashboardLayout>;
  }

  if (error) return <DashboardLayout><p className="p-6 text-red-500">{error}</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mt-6 ml-6">Marchand</h1>
      <p className="text-gray-600 mt-4 ml-6">Performance et transactions des marchands.</p>

      {/* KPIs marchands */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 ml-6 w-300 ">
        <MerchantKPI
          title="Ventes totales"
          value={kpis.totalAmount}
          color="bg-green-100 shadow text-green-700"
        />
        <MerchantKPI
          title="Transactions réussies"
          value={kpis.totalSuccess}
          color="bg-blue-100 shadow text-blue-700"
        />
        <MerchantKPI
          title="En attente"
          value={kpis.totalPending}
          color="bg-yellow-100 shadow text-yellow-700"
        />
        <MerchantKPI
          title="Échouées"
          value={kpis.totalFailed}
          color="bg-red-100 shadow text-red-700"
        />
      </div>

      {/* Suivi de performance */}
      <div className="bg-white p-4 rounded-lg shadow mt-6 w-300 ml-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Suivi des performances</h2>
          <button
            onClick={refresh}
            className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md hover:bg-blue-600 transition"
          >
            🔄 Rafraîchir
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto overflow-x-auto rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="border-b sticky top-0 text-center">
              <tr>
                <th className="py-2 px-4">Nom</th>
                <th className="py-2 px-4">Sous-magasin</th>
                <th className="py-2 px-4">Transactions</th>
                <th className="py-2 px-4">Succès</th>
                <th className="py-2 px-4">En attente</th>
                <th className="py-2 px-4">Échouées</th>
                <th className="py-2 px-4">Total (€)</th>
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

        <button
          onClick={exportCSV}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Exporter CSV
        </button>
      </div>

      {/* Transactions des marchands */}
      <MerchantTransactions />
    </DashboardLayout>
  );
};

export default MerchantDashboard;
