// src/routes/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import DashboardAdmin from "../pages/operations/DashboardAdmin";
import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
import DashboardLayout from "../layouts/dashboardLayout";
import ErrorPage from "../pages/ErrorPage";
import RedirectByRole from "../components/redirectByRole";
import { useAuth } from "../store/auth";
import type { JSX } from "react";

// Vérifie si l'utilisateur est connecté
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated, hydrated } = useAuth();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <p>Chargement...</p>
      </div>
    );
  }

  if (!user || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

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
  {
    path: "/login",
    element: <SplashLogin />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <DashboardAdmin />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/users",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <UsersPage />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/finance",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Finance />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/sales",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Sales />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/merchants",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <Merchants />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "/it",
    element: (
      <RequireAuth>
        <DashboardLayout>
          <IT />
        </DashboardLayout>
      </RequireAuth>
    ),
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);






{/* 
import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import DashboardAdmin from "../pages/operations/DashboardAdmin";
 import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
import DashboardLayout from "../layouts/dashboardLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute";
import ErrorPage from "../pages/ErrorPage";
import RedirectByRole from "../components/redirectByRole"; // ← Import du redirect
import { useAuth } from "../store/auth";
import type { JSX } from "react";

// Wrapper pour vérifier si l'utilisateur est connecté
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth.getState();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

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
    //errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <SplashLogin />,
    //errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin" ,]}>
          <DashboardLayout>
            <DashboardAdmin />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
    //errorElement: <ErrorPage />,
  },
  {
    path: "/users",
    element: (
      <RequireAuth>
        <RoleProtectedRoute allowedRoles={[ "Agent PMC"]}>
          <DashboardLayout>
            <UsersPage />
          </DashboardLayout>
        </RoleProtectedRoute>
      </RequireAuth>
    ),
   // errorElement: <ErrorPage />,
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
   // errorElement: <ErrorPage />,
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
    //errorElement: <ErrorPage />,
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
    //errorElement: <ErrorPage />,
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
    //errorElement: <ErrorPage />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
 */}
