// src/pages/Dashboard.tsx
import React from "react";
import DashboardAdmin from "./operations/DashboardAdmin";
import DashboardLayout from "../layouts/dashboardLayout";

const PageMain: React.FC = () => {
  return (
  
    <DashboardLayout> 
      <DashboardAdmin />

    </DashboardLayout>
  );
};

export default PageMain;
