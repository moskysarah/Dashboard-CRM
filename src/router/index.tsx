import { createBrowserRouter } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import Dashboard from "../pages/PageMain";
import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import IT from "../pages/DashboardSettings";
import UsersPage from "../pages/AgentDashboard";
//import UserManagement from "../pages/operations/DashboardAdmin";
import DashboardLayout from "../layouts/dashboardLayout";
import RoleProtectedRoute from "../components/roleProtectedRoute";
import ErrorPage from "../pages/ErrorPage"; // 

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <SplashLogin />,
    errorElement: <ErrorPage />, //  si erreur ici aussi
  },
  {
    path: "/dashboard",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <DashboardLayout>
        <Dashboard />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/users",
    element: (
      <RoleProtectedRoute allowedRoles={["Agent PMC"]}>
        <DashboardLayout>
          <UsersPage />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/finance",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        <DashboardLayout>
        <Finance />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/sales",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        
        <DashboardLayout>
         <Sales />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/merchants",
    element: (
      <RoleProtectedRoute allowedRoles={["Marchand"]}>
        <DashboardLayout>
          <Merchants />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/it",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
         <DashboardLayout>
          <IT />
         </DashboardLayout>
      
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },

 /*
  {
    path: "/usermanagement",
    element: (
      <RoleProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
        <DashboardLayout>
          <UserManagement />
        </DashboardLayout>
      </RoleProtectedRoute>
    ),
    errorElement: <ErrorPage />,
  },

  */
  {
    path: "*", // pour toutes les routes inconnues
    element: <ErrorPage />,
  },
]);
