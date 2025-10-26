// src/components/RoleProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { UserRole } from "../types/domain";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Ce composant protège une route selon le rôle utilisateur.
 * - Si l'utilisateur n'est pas connecté → redirection login.
 * - Si son rôle n'est pas autorisé → redirection dashboard.
 */
export default function RoleProtectedRoute({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user.role as UserRole;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
