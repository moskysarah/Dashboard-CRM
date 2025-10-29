// import { createBrowserRouter, Navigate } from "react-router-dom";
// import SplashLogin from "../pages/SplashLogin";
// import Dashboard from "../pages/operations/DashboardAdmin";
// import Merchants from "../pages/DashboardMerchant";
// import Sales from "../pages/DashboardSales";
// import Finance from "../pages/DashboardFinance";
// import Settings from "../pages/DashboardSettings";
// import UsersPage from "../pages/AgentDashboard";
// import ErrorPage from "../pages/ErrorPage";
// import RedirectByRole from "../components/redirectByRole";
// import { useAuth } from "../store/auth";
// import DashboardDistributor from "../pages/DashboardDistributor";
// import type { JSX } from "react";

// // === PROTECTION AUTH ===
// const RequireAuth = ({ children }: { children: JSX.Element }) => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;
//   return children;
// };

// // === PROTECTION PAR ROLE ===
// const RoleProtectedRoute = ({
//   children,
//   allowedRoles,
// }: {
//   children: JSX.Element;
//   allowedRoles: string[];
// }) => {
//   const { user } = useAuth();
//   if (!user) return <Navigate to="/login" replace />;

//   const role = user.role?.toLowerCase(); // minuscule
//   if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />;

//   return children;
// };

// // === ROUTES ===
// export const router = createBrowserRouter([
//   { path: "/", element: <RequireAuth><RedirectByRole /></RequireAuth> },
//   { path: "/login", element: <SplashLogin /> },

//   // === ADMIN ===
//   {
//     path: "/dashboard",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["superadmin" ,"user"]}>
//           <Dashboard />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === AGENT ===
//   {
//     path: "/users",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["user", "superadmin"]}>
//           <UsersPage />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === MARCHAND ===
//   {
//     path: "/merchants",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["superadmin", "admin"]}>
//           <Merchants />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === FINANCE ===
//   {
//     path: "/finance",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["superadmin"]}>
//           <Finance />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === SALES ===
//   {
//     path: "/sales",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["superadmin"]}>
//           <Sales />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === IT ===
//   {
//     path: "/it",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["superadmin"]}>
//           <Settings/>
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === DISTRIBUTEUR ===
//   {
//     path: "/distributor",
//     element: (
//       <RequireAuth>
//         <RoleProtectedRoute allowedRoles={["partner"]}>
//           <DashboardDistributor distributorId="123" />
//         </RoleProtectedRoute>
//       </RequireAuth>
//     ),
//   },

//   // === ERREUR ===
//   { path: "*", element: <ErrorPage /> },
// ]);


// src/index.tsx ou src/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import SplashLogin from "../pages/SplashLogin";
import DashboardLayout from "../layouts/dashboardLayout";
import Dashboard from "../pages/operations/DashboardAdmin";
import Merchants from "../pages/DashboardMerchant";
import Sales from "../pages/DashboardSales";
import Finance from "../pages/DashboardFinance";
import Settings from "../pages/DashboardSettings";
import User from "../pages/DashboardUser";
import Agent from "../pages/DashboardAgent";
import DashboardDistributor from "../pages/DashboardDistributor";
import ErrorPage from "../pages/ErrorPage";
import RedirectByRole from "../components/redirectByRole";
import { useAuth } from "../store/auth";
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
  { path: "/login", element: <SplashLogin /> },
  { path: "/", element: <RequireAuth><RedirectByRole /></RequireAuth> },

  // === ROUTES DASHBOARD AVEC LAYOUT ===
  {
    path: "/",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    children: [
      // ADMIN
      { path: "dashboard", element: <RoleProtectedRoute allowedRoles={["superadmin" , "user" ,"admin"]}><Dashboard /></RoleProtectedRoute> },

      // AGENT
      { path: "agent", element: <RoleProtectedRoute allowedRoles={["user", "superadmin" ,"agent"]}><Agent /></RoleProtectedRoute> },

      // USERS
      { path: "users", element: <RoleProtectedRoute allowedRoles={["user", "superadmin"]}><User /></RoleProtectedRoute> },

      // MARCHAND
      { path: "merchants", element: <RoleProtectedRoute allowedRoles={["superadmin", "admin" , "user"]}><Merchants /></RoleProtectedRoute> },

      // FINANCE
      { path: "finance", element: <RoleProtectedRoute allowedRoles={["superadmin" ,"user"]}><Finance /></RoleProtectedRoute> },

      // SALES
      { path: "sales", element: <RoleProtectedRoute allowedRoles={["superadmin", "user"]}><Sales /></RoleProtectedRoute> },
       
      // IT / PARAMS
      { path: "it", element: <RoleProtectedRoute allowedRoles={["superadmin","user"]}><Settings /></RoleProtectedRoute> },
      
      // DISTRIBUTEUR
      { path: "distributor", element: <RoleProtectedRoute allowedRoles={["partner","user"]}><DashboardDistributor /></RoleProtectedRoute> },
    ],
  },

  // ERREUR
  { path: "*", element: <ErrorPage /> },
]);

