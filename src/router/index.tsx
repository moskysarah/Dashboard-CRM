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
import DashboardDistributor from "../pages/DashboardDistributor";
import type { JSX } from "react";

// === PROTECTION AUTH ===
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// === PROTECTION PAR ROLE ===
const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase(); // minuscule
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;

  return children;
};

// === ROUTES ===
export const router = createBrowserRouter([
  { path: "/", element: <RequireAuth><RedirectByRole /></RequireAuth> },
  { path: "/login", element: <SplashLogin /> },

  // === ADMIN ===
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["superadmin"]}>
          <Dashboard />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === AGENT ===
  {
    path: "/users",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["user", "superadmin"]}>
          <UsersPage />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === MARCHAND ===
  {
    path: "/merchants",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["superadmin", "admin"]}>
          <Merchants />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === FINANCE ===
  {
    path: "/finance",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["superadmin"]}>
          <Finance />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === SALES ===
  {
    path: "/sales",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["superadmin"]}>
          <Sales />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === IT ===
  {
    path: "/it",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["superadmin"]}>
          <IT />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === DISTRIBUTEUR ===
  {
    path: "/distributor",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["partner"]}>
          <DashboardDistributor distributorId="123" />
        </RoleProtectedRoute>
      </RequireAuth>
    ),
  },

  // === ERREUR ===
  { path: "*", element: <ErrorPage /> },
]);
