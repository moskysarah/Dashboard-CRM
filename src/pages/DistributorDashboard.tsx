import React, { useState, useEffect } from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import DistributorKPI from "../components/distributorKPI";

import CommissionManagement from "../components/CommissionManagement";
import SalesStockManagement from "../components/SalesStockManagement";
import T from "../components/T";
import { ShoppingCart, DollarSign, Package, TrendingUp } from "lucide-react";
import { getDistributors } from "../services/api";

type Distributor = {
  id: string;
  name: string;
  commission: number;
  sales: number;
  stock: number;
};

const DistributorDashboard: React.FC = () => {
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const response = await getDistributors();
        setDistributors(response.data);
      } catch (err) {
        console.error("Erreur fetching distributors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  const getIconColor = (value: number) => {
    if (value > 500) return "text-green-500";
    if (value > 10) return "text-yellow-500";
    return "text-blue-500";
  };

  const totalSales = distributors.reduce((sum, d) => sum + d.sales, 0);
  const averageCommission = distributors.length > 0 ? distributors.reduce((sum, d) => sum + d.commission, 0) / distributors.length : 0;
  const totalStock = distributors.reduce((sum, d) => sum + d.stock, 0);
  const totalCommissionsEarned = distributors.reduce((sum, d) => sum + (d.sales * d.commission / 100), 0);

  if (loading) return <div className="flex justify-center items-center h-32"><T>Chargement du tableau de bord...</T></div>;

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold mb-3"><T>Distributeur</T></h1>
        <p className="text-gray-600 mb-6 text-sm md:text-base">
          <T>Performance et transactions des distributeurs.</T>
        </p>

        {/* KPIs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
          <DistributorKPI
            title={<T>Ventes Totales</T>}
            value={totalSales}
            color="bg-white text-gray-700 shadow-lg"
            icon={<ShoppingCart size={16} className={getIconColor(totalSales)} />}
          />
          <DistributorKPI
            title={<T>Commission Moyenne</T>}
            value={Math.round(averageCommission)}
            color="bg-white text-gray-700 shadow-lg"
            icon={<DollarSign size={16} className={getIconColor(averageCommission)} />}
          />
          <DistributorKPI
            title={<T>Stock Disponible</T>}
            value={totalStock}
            color="bg-white text-gray-700 shadow-lg"
            icon={<Package size={16} className={getIconColor(totalStock)} />}
          />
          <DistributorKPI
            title={<T>Commissions Totales Gagnées</T>}
            value={Math.round(totalCommissionsEarned)}
            color="bg-white text-gray-700 shadow-lg"
            icon={<TrendingUp size={16} className={getIconColor(totalCommissionsEarned)} />}
          />
        </div>

        {/* Management Sections */}
        <div className="space-y-6">
          <CommissionManagement />
          <SalesStockManagement />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;
