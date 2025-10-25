// src/components/RoleProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { UserRole } from "../types/domain";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Marchand" | "Agent PMC" | "SuperAdmin")[];
}

function mapRole(role: UserRole): "Admin" | "Marchand" | "Agent PMC" | "SuperAdmin" | null {
  switch (role) {
    case "admin":
      return "Admin";
    case "agent":
      return "Agent PMC";
    case "superadmin":
      return "SuperAdmin";
    case "marchand":
      return "Marchand";
    default:
      return null;
  }
}

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }

  const mappedRole = mapRole(user.role);

  if (!mappedRole || !allowedRoles.includes(mappedRole)) {
    // Rediriger vers la page par défaut selon le rôle
    switch (mappedRole) {
      case "Admin":
      case "SuperAdmin":
        return <Navigate to="/dashboard" replace />;
      case "Agent PMC":
        return <Navigate to="/users" replace />;
      case "Marchand":
        return <Navigate to="/merchants" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
