import React from "react";
import DashboardLayout from "../layouts/dashboardLayout"; // vérifie le chemin
import DashboardAdmin from "./operations/DashboardSuperadmin";

const PageMain: React.FC = () => {
  return (
    <DashboardLayout>
      <DashboardAdmin />
      
    </DashboardLayout>
  );
};

export default PageMain;
