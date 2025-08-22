
// Protected route
import { createBrowserRouter } from "react-router-dom";
// Pages
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Merchants from "../pages/MerchantDashboard";
import Distributors from "../pages/DistributorDashboard";
import TransactionsList from "../pages/operations/TransactionsList";
import ReportsList from "../pages/operations/RaportsList";
import Sales from "../pages/Sales"; 
import Finance from "../pages/Finance"; 
import IT from "../pages/IT";

// Protected route

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/it", element: <IT /> },
  { path: "/transactionslist", element: <TransactionsList /> },
  { path: "/reportslist", element: <ReportsList /> },
  { path: "/sales", element: <Sales /> },
  { path: "/finance", element: <Finance /> },
  { path: "/merchants", element: <Merchants /> },
  { path: "/distributors", element: <Distributors /> },
  { path: "*", element: <Login /> }, // si route inconnue => login
]);
