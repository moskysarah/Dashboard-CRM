import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

/**
 * Redirige automatiquement l'utilisateur selon son rôle.
 * Compatible avec les rôles : superadmin, admin, agent, partner, user
 */
const RedirectByRole = () => {
  const { user } = useAuth();

  // Si pas connecté → page de login
  if (!user) return <Navigate to="/login" replace />;

  // Vérification du rôle renvoyé par l'API
  const apiRole = user.role?.toLowerCase();

  // Table de correspondance entre le rôle API et la route de destination
  const roleRoutes: Record<string, string> = {
    superadmin: "/dashboard",   // Gestionnaire de plateforme
    admin: "/merchants",        // Marchand
    agent: "/agent",            // Agent terrain
    partner: "/distributor",    // Partenaire / distributeur
    user: "/users",             // Client
  };

  // Si le rôle est reconnu → rediriger
  if (apiRole && roleRoutes[apiRole]) {
    return <Navigate to={roleRoutes[apiRole]} replace />;
  }

  // Si rôle inconnu → retour login
  return <Navigate to="/login" replace />;
};

export default RedirectByRole;
