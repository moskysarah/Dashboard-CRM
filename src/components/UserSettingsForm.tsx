import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { useUserSettings } from "../hooks/useUserSettings";

interface UserSettingsFormProps {
  onSuccess?: () => void;
}

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ onSuccess }) => {
  const { fetchUserSettings, settings, loading, error } = useUserSettings();
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const handleRefresh = async () => {
    setSuccess(null);
    try {
      await fetchUserSettings();
      setSuccess("Paramètres utilisateur mis à jour!");
      onSuccess?.();
    } catch (err: any) {
      // Error is handled by the hook
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Paramètres utilisateur</h3>

      {settings.length > 0 ? (
        <div className="space-y-4">
          {settings.map((setting: any, index: number) => (
            <div key={index} className="border-b pb-2">
              <p className="text-sm text-gray-600">{setting.key}: {setting.value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Aucun paramètre trouvé.</p>
      )}

      {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-4">{success}</p>}

      <Button onClick={handleRefresh} disabled={loading} className="w-full mt-4">
        {loading ? "Chargement..." : "Actualiser"}
      </Button>
    </div>
  );
};

export default UserSettingsForm;
