
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
import DashboardSettings from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
import UserManagement from "../pages/operations/DashboardAdmin";
import DashboardLayout from "../layouts/dashboardLayout";

export const router = createBrowserRouter([
  { path: "/login", element: <SplashLogin /> },

  // Toutes les pages sont maintenant accessibles sans restriction
  { path: "/users", element: <UsersPage /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/usermanagement", element: <DashboardLayout><UserManagement /></DashboardLayout> },
  { path: "/it", element: <DashboardSettings/> },
  { path: "/transactionslist", element: <TransactionsList /> },
  { path: "/reportslist", element: <ReportsList /> },
  { path: "/finance", element: <Finance /> },
  { path: "/sales", element: <Sales /> },
  { path: "/merchants", element: <Merchants /> },
  //{ path: "/distributors", element: <Distributors /> },


  // Redirection par défaut
  { path: "*", element: <SplashLogin /> },
]);
