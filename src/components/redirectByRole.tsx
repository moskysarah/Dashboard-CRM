import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const RedirectByRole = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  // Mapper la valeur API vers le rôle interne
  const roleMap: Record<string, string> = {
    superadmin: "SuperAdmin",
    admin: "Admin",
    user: "Agent PMC", // ← on mapper ici l'Agent PMC est renvoyé comme "user"
    marchand: "Marchand",
  };

  const role = user.role || '';
  const appRole = roleMap[role] || null;
  if (!appRole) return <Navigate to="/login" replace />;

  switch (appRole) {
    case "SuperAdmin":
    case "Admin":
      return <Navigate to="/dashboard" replace />;
    case "Agent PMC":
      return <Navigate to="/users" replace />;
    case "Marchand":
      return <Navigate to="/merchants" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RedirectByRole;
