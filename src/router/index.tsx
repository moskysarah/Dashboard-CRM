// src/router/index.tsx
import { createBrowserRouter } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import Dashboard from "../pages/PageMain";
import Merchants from "../pages/DashboardMerchant";
//import Distributors from "../pages/DistributorDashboard";
import TransactionsList from "../pages/operations/TransactionsList";
import ReportsList from "../pages/operations/RapportsList";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
import UserManagement from "../pages/operations/DashboardAdmin";
import DashboardLayout from "../layouts/dashboardLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <SplashLogin /> },

  // Pages protégées par rôle
  {
    path: "/dashboard",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin",  "SuperAdmin" ,"Marchand", "Agent PMC"]}>
        <Dashboard />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <RoleProtectedRoute allowedRoles={["Agent PMC"]}>
        <UsersPage />
      </RoleProtectedRoute>
    ),
  },
   {
    path: "/finance",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        <Finance />
      </RoleProtectedRoute>
    ),
  },
   {
    path: "/sales",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        <Sales />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/merchants",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        <Merchants />
      </RoleProtectedRoute>
    ),
  },
   {
    path: "/transactionList",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin","SuperAdmin",]}>
        <TransactionsList />
      </RoleProtectedRoute>
    ),
  },
   {
    path: "/reportsList",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin" , "SuperAdmin",]}>
        <ReportsList/>
      </RoleProtectedRoute>
    ),
  },
  
  

 

  

  {
    path: "/it",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <IT />
      </RoleProtectedRoute>
    ),
  },
  {
    path: "/usermanagement",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin"]}>
        <DashboardLayout>
          <UserManagement />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
  },
]);
     
