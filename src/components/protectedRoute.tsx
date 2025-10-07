import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../store/auth';
import type { UserRole } from '../types/domain';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.user);

  if (!isAuthenticated) {
    // Si l'utilisateur n'est pas authentifié, le rediriger vers la page de connexion.
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;
  const isAuthorized = userRole && (allowedRoles.includes(userRole) || userRole === 'superadmin');

  if (!isAuthorized) {
    // Si l'utilisateur est authentifié mais n'a pas le bon rôle, le rediriger vers le dashboard.
    // On pourrait aussi créer une page "Accès non autorisé".
    return <Navigate to="/dashboard" replace />;
  }

  return children; // Si authentifié et autorisé, afficher le contenu.
};

export default ProtectedRoute;