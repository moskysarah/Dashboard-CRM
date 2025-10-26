import React from "react";

interface SalesStatsProps {
  stats: {
    totalSales: number;
    totalRevenue: number;
    totalCommissions: number;
    averageSaleAmount: number;
  };
}

export const SalesStats: React.FC<SalesStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Ventes Totales</h3>
      <p className="text-2xl font-bold text-blue-600">{stats.totalSales}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Chiffre d'Affaires</h3>
      <p className="text-2xl font-bold text-green-600">{stats.totalRevenue.toFixed(2)} €</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Commissions</h3>
      <p className="text-2xl font-bold text-purple-600">{stats.totalCommissions.toFixed(2)} €</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Vente Moyenne</h3>
      <p className="text-2xl font-bold text-orange-600">{stats.averageSaleAmount.toFixed(2)} €</p>
    </div>
  </div>
);
