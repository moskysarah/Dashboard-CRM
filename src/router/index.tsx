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
import ProtectedRoute from "../components/ProtectedRoute";

export const router = createBrowserRouter([
  { path: "/login", element: <SplashLogin /> },

  // Les superadmins ont accès à tout. Les admins ont accès à ces pages.
  { path: "/dashboard", element: <ProtectedRoute allowedRoles={['admin', 'user']}><Dashboard /></ProtectedRoute>},
  { path: "/it", element: <ProtectedRoute allowedRoles={['admin']}><IT /></ProtectedRoute> },
  { path: "/transactionslist", element: <ProtectedRoute allowedRoles={['admin', 'user']}><TransactionsList /></ProtectedRoute> },
  { path: "/reportslist", element: <ProtectedRoute allowedRoles={['admin', 'user']}><ReportsList /></ProtectedRoute> },
  { path: "/finance", element: <ProtectedRoute allowedRoles={['admin']}><Finance /></ProtectedRoute> },
  
  // Les utilisateurs de type 'user' (marchands, distributeurs) ont accès à ces pages.
  { path: "/sales", element: <ProtectedRoute allowedRoles={['user']}><Sales /></ProtectedRoute> },
  { path: "/merchants", element: <ProtectedRoute allowedRoles={['user']}><Merchants /></ProtectedRoute> },
  { path: "/distributors", element: <ProtectedRoute allowedRoles={['user']}><Distributors /></ProtectedRoute> },

  { path: "*", element: <SplashLogin /> },
]);
