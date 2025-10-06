// src/pages/Dashboard.tsx
import React from "react";
import UserManagement from "./operations/UserManagement";
import DashboardLayout from "../layouts/dashboardLayout";
const Dashboard: React.FC = () => {
  return (
  
    <DashboardLayout> 
      <UserManagement />

    </DashboardLayout>
  );
};

export default Dashboard;
