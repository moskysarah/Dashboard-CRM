import React, { useState, useEffect } from "react";
import { useUserSettings } from "../hooks/useUserSettings";
import UserSettingsForm from "../components/UserSettingsForm";
import { useAuth } from "../store/auth";

const DashboardSettings: React.FC = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    if (user) {
      setUserId(user.id.toString());
    }
  }, [user]);

  const { loading, error, canViewOthers } = useUserSettings(userId);

  if (loading) return <div className="p-6">Chargement des paramètres...</div>;
  if (error) return <div className="p-6 text-red-500">Erreur: {error}</div>;

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 min-w-0 overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Paramètres</h2>

      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <UserSettingsForm
          canViewOthers={canViewOthers}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default DashboardSettings;
