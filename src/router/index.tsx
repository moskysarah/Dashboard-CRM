// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import Dashboard from "../pages/operations/DashboardAdmin";
import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
import ErrorPage from "../pages/ErrorPage";
import RedirectByRole from "../components/redirectByRole";
import { useAuth } from "../store/auth";
import type { JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <RequireAuth>
        <RedirectByRole />
      </RequireAuth>
    ),
  },
  { path: "/login", element: <SplashLogin /> },
  { path: "/dashboard", element:<Dashboard /> },
  { path: "/users", element: <UsersPage /> },
  { path: "/merchants", element: <Merchants />},
  { path: "/finance", element: <Finance /> },
  { path: "/sales", element: <Sales />},
  { path: "/it", element: <IT />},

  { path: "*", element: <ErrorPage /> },
]);