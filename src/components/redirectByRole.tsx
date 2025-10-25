// src/components/RedirectByRole.tsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const RedirectByRole: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  // On peut mettre un petit délai pour spinner (optionnel)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-sm">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
    case "superadmin":
      return <Navigate to="/dashboard" replace />;
    case "agent":
      return <Navigate to="/users" replace />; // pour Agent PMC
    case "marchand":
      return <Navigate to="/merchants" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export default RedirectByRole;
