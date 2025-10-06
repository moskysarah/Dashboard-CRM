import React from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import DistributorKPI from "../components/distributorKPI";
import DistributorNetwork from "../components/distributorNetwork";

const DistributorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="max-h-screen p-6">
        <h1 className="text-2xl font-bold mb-3 ml-2">Distributeur</h1>
        <p className="text-gray-600 mb-3 ml-2">
          Performance et transactions des distributeurs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 ml-2 w-300">
          <DistributorKPI
            title="Ventes totales"
            value={1200}
            color="bg-purple-100 text-purple-500"
          />
          <DistributorKPI
            title="Commission moyenne"
            value={10}
            color="bg-indigo-100 text-indigo-500"
          />
          <DistributorKPI
            title="Stock disponible"
            value={450}
            color="bg-pink-100 text-pink-500"
          />
        </div>

        <DistributorNetwork />
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;
