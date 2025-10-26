import React from "react";

interface StockStatsProps {
  stock: {
    totalProducts: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  };
}

export const StockStats: React.FC<StockStatsProps> = ({ stock }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Produits Totaux</h3>
      <p className="text-2xl font-bold text-blue-600">{stock.totalProducts}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Stock Faible</h3>
      <p className="text-2xl font-bold text-yellow-600">{stock.lowStockItems}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Rupture de Stock</h3>
      <p className="text-2xl font-bold text-red-600">{stock.outOfStockItems}</p>
    </div>
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Valeur Totale</h3>
      <p className="text-2xl font-bold text-green-600">{stock.totalValue.toFixed(2)} €</p>
    </div>
  </div>
);
