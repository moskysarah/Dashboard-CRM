// src/pages/distributor/DistributorDashboard.tsx
import React from "react";
import DashboardLayout from "../layouts/dashboardLayout";
import DistributorKPI from "../components/distributorKPI";
import DistributorNetwork from "../components/distributorNetwork";

const DistributorDashboard: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <DistributorKPI title="Ventes totales" value={1200} color="bg-purple-500" />
        <DistributorKPI title="Commission moyenne" value={10} color="bg-indigo-500" />
        <DistributorKPI title="Stock disponible" value={450} color="bg-pink-500" />
      </div>

      <DistributorNetwork />
   
    </DashboardLayout>
  );
};

export default DistributorDashboard;
