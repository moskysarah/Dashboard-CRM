import React, { useState, useEffect } from "react";
import { DistributionManager } from "../managers/distributorManager";
import { SalesStats } from "../components/distributor/salesStats";
import { StockStats } from "../components/distributor/stockStats";
import { CommissionList } from "../components/distributor/commissionList";

interface DashboardDistributorProps {
  distributorId: string;
}

const DashboardDistributor: React.FC<DashboardDistributorProps> = ({ distributorId }) => {
  const [manager] = useState(() => new DistributionManager());
  const [activeTab, setActiveTab] = useState<"sales" | "stock" | "commissions">("sales");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const salesStats = manager.getSalesStatistics(distributorId);
    const stockReport = manager.getStockReport(distributorId);
    const commissions = manager.getDistributorCommissions(distributorId);
    setStats({ sales: salesStats, stock: stockReport, commissions });
  }, [distributorId, manager]);

  if (!stats) return <div className="p-4">Chargement...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Tableau de Bord Distributeur</h1>

      <div className="flex space-x-4 mb-6">
        {(["sales", "stock", "commissions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {tab === "sales" && "Ventes"}
            {tab === "stock" && "Stock"}
            {tab === "commissions" && "Commissions"}
          </button>
        ))}
      </div>

      {activeTab === "sales" && <SalesStats stats={stats.sales} />}
      {activeTab === "stock" && <StockStats stock={stats.stock} />}
      {activeTab === "commissions" && <CommissionList commissions={stats.commissions} />}
    </div>
  );
};

export default DashboardDistributor;
