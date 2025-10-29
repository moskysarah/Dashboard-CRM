import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/auth";

/**
 * Redirige automatiquement l'utilisateur selon son rôle.
 * Compatible avec : superadmin, admin, agent, partner, user
 */
const RedirectByRole: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation(); // route actuelle

  // Si pas connecté → login
  if (!user) return <Navigate to="/login" replace />;

  // Convertit le rôle API en minuscule pour uniformité
  const apiRole = user.role?.toLowerCase();

  // Table de correspondance rôle → route
  const roleRoutes: Record<string, string> = {
    superadmin: "/dashboard",
    admin: "/merchants",
    agent: "/agent",
    partner: "/distributor",
    user: "/users",
  };

  // Détermine la route cible ou login si rôle inconnu
  const targetRoute = apiRole && roleRoutes[apiRole] ? roleRoutes[apiRole] : "/login";

  //  Ne redirige que si on n’est pas déjà sur la route cible
  if (location.pathname !== targetRoute) {
    return <Navigate to={targetRoute} replace />;
  }

  // Si on est déjà sur la bonne route, rien ne se passe
  return null;
};

export default RedirectByRole;
