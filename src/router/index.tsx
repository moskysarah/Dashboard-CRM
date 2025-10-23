// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import Dashboard from "../pages/PageMain";
import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
// import UserManagement from "../pages/operations/DashboardAdmin";
import DashboardLayout from "../layouts/dashboardLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute";
import ErrorPage from "../pages/ErrorPage"; 
import { useAuth } from "../store/auth";
import type { JSX } from "react";

// Wrapper pour vérifier si l'utilisateur est connecté
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth.getState();

  if (!user) {
    // Si pas connecté, on redirige vers SplashLogin
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <SplashLogin />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin", "Marchand", "Agent PMC"]}>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/users",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Agent PMC"]}>
          <DashboardLayout>
            <UsersPage />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/finance",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Marchand"]}>
          <DashboardLayout>
            <Finance />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/sales",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Marchand"]}>
          <DashboardLayout>
            <Sales />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/merchants",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Marchand"]}>
          <DashboardLayout>
            <Merchants />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/it",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
          <DashboardLayout>
            <IT />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  /*
  {
    path: "/usermanagement",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
          <DashboardLayout>
            <UserManagement />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
  },
  */
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
