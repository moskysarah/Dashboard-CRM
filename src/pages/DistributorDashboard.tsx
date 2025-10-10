import React from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import DistributorKPI from "../components/distributorKPI";
import DistributorNetwork from "../components/distributorNetwork";

const DistributorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      {/* ✅ Conteneur principal responsive avec scroll vertical fluide */}
      <div className="h-full max-h-screen overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {/* ✅ Titre et sous-titre adaptatifs */}
        <div className="text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">Distributeur</h1>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            Performance et transactions des distributeurs.
          </p>
        </div>

        {/*  Section des KPI : responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
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

        {/* partie (responsive aussi) */}
        <div className="mt-6">
          <DistributorNetwork />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DistributorDashboard;
