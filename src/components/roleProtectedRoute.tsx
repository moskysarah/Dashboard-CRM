// src/components/RoleProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { UserRole } from "../types/domain";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Marchand" | "Agent PMC" | "SuperAdmin")[];
}

// Mapper les rôles API vers les rôles affichés dans l'app
function mapRole(
  role: UserRole
): "Admin" | "Marchand" | "Agent PMC" | "SuperAdmin" | null {
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

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    // Non connecté
    return <Navigate to="/login" replace />;
  }

  const mappedRole = mapRole(user.role);

  if (!mappedRole || !allowedRoles.includes(mappedRole)) {
    // Connecté mais mauvais rôle
    return <Navigate to="/dashboard" replace />;
    
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
