// src/components/RoleProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { UserRole } from "../types/domain";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: ("Admin" | "Marchand" | "Agent PMC" | "SuperAdmin")[];
}

const mapRole = (role: UserRole): "Admin" | "Marchand" | "Agent PMC" |"SuperAdmin"| null => {
  switch (role) {
    case 'admin':
      return 'Admin';
    case 'agent':
      return 'Marchand';
    case 'superadmin':
      return 'Agent PMC';
    default:
      return null;
  }
};

const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user || !user.role) {
    // non connecté ou rôle non défini
    return <Navigate to="/login" replace />;
  }

  const mappedRole = mapRole(user.role);
  if (!mappedRole || !allowedRoles.includes(mappedRole)) {
    // connecté mais pas le bon rôle
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
