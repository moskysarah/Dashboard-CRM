// src/components/ProtectedRoute.tsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import type { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
  allowedRoles?: ("Admin" | "Marchand" | "Distributeur")[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const { user } = useContext(UserContext);
  const isAuthenticated = Boolean(user);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role as "Admin" | "Marchand" | "Distributeur"))) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
