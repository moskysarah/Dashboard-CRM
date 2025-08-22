// src/pages/Dashboard.tsx
import React from "react";
import UserManagement from "./operations/UserManagement";
import DashboardLayout from "../layouts/dashboardLayout";
import TransactionsList from "./operations/TransactionsList";
import ReportsList from "./operations/RaportsList";

const Dashboard: React.FC = () => {
  return (
    <DashboardLayout>
      
      <UserManagement />
      <TransactionsList />
      <ReportsList />

    </DashboardLayout>
  );
};

export default Dashboard;
