

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

const RedirectByRole: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }

    if (user) {
      switch (user.role) {
        case "admin":
        case "superadmin":
          navigate("/dashboard", { replace: true });
          break;
        case "marchand":
          navigate("/merchants", { replace: true });
          break;
        case "agent":
          navigate("/users", { replace: true });
          break;
        default:
          navigate("/login", { replace: true });
      }
    }

    // on laisse un petit délai pour le visuel du spinner
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [user, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          {/* Spinner animé */}
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-sm">Redirection en cours...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectByRole;


