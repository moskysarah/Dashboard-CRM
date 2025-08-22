// src/pages/merchant/MerchantDashboard.tsx
import React, { useState } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import MerchantKPI from "../components/merchantKPI";
import MerchantTransactions from "../components/merchantTransaction";

type Merchant = {
  id: string;
  name: string;
  subStore: string;
  sales: number;
};

const MerchantDashboard: React.FC = () => {
  const [merchants] = useState<Merchant[]>([
    { id: "1", name: "Marchand A", subStore: "Sous-magasin 1", sales: 1200 },
    { id: "2", name: "Marchand B", subStore: "Sous-magasin 2", sales: 900 },
    { id: "3", name: "Marchand C", subStore: "Sous-magasin 3", sales: 1500 },
  ]);

  const exportCSV = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["Nom,Sous-magasin,Ventes", ...merchants.map(m => `${m.name},${m.subStore},${m.sales}`)].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "rapport_merchants.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <MerchantKPI title="Ventes totales" value={2500} color="bg-green-500" />
        <MerchantKPI title="Transactions réussies" value={150} color="bg-blue-500" />
        <MerchantKPI title="En attente" value={20} color="bg-yellow-500" />
      </div>

      {/* ici je fais le suivi de chaque performances par sous-magasin */}
      <div className="bg-white p-4 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4">Suivi des performances</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b bg-gray-100 text-center">
              <th className="py-2 px-4">Nom</th>
              <th className="py-2 px-4">Sous-magasin</th>
              <th className="py-2 px-4">Ventes</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map(m => (
              <tr key={m.id} className="border-b hover:bg-gray-50 text-center">
                <td className="py-2 px-4">{m.name}</td>
                <td className="py-2 px-4">{m.subStore}</td>
                <td className="py-2 px-4">{m.sales}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={exportCSV}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Exporter CSV
        </button>
      </div>

      {/* La liste des transactions de marchand */}
      <MerchantTransactions />
    </DashboardLayout>
  );
};

export default MerchantDashboard;
