import { createBrowserRouter } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin"; 
import Dashboard from "../pages/Dashboard";
import Merchants from "../pages/MerchantDashboard";
import Distributors from "../pages/DistributorDashboard";
import TransactionsList from "../pages/operations/TransactionsList";
import ReportsList from "../pages/operations/RapportsList";
import Sales from "../pages/Sales"; 
import Finance from "../pages/Finance"; 
import IT from "../pages/IT";
import ProtectedRoute from "../components/protectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <SplashLogin /> },

  { path: "/dashboard", element: <Dashboard />},
  { path: "/it", element: <ProtectedRoute allowedRoles={["Admin"]}><IT /></ProtectedRoute> },
  { path: "/transactionslist", element: <ProtectedRoute allowedRoles={["Admin","Marchand"]}><TransactionsList /></ProtectedRoute> },
  { path: "/reportslist", element: <ProtectedRoute allowedRoles={["Admin","Marchand"]}><ReportsList /></ProtectedRoute> },
  { path: "/sales", element: <ProtectedRoute allowedRoles={["Marchand","Distributeur"]}><Sales /></ProtectedRoute> },
  { path: "/finance", element: <ProtectedRoute allowedRoles={["Admin"]}><Finance /></ProtectedRoute> },
  { path: "/merchants", element: <ProtectedRoute allowedRoles={["Marchand"]}><Merchants /></ProtectedRoute> },
  { path: "/distributors", element: <ProtectedRoute allowedRoles={["Distributeur"]}><Distributors /></ProtectedRoute> },

  { path: "*", element: <SplashLogin /> },
]);
