import React, { useState } from "react";
import { useUserSettings } from "../hooks/useUserSettings";
import { useUsers } from "../hooks/useUsers";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Bell, Globe, Clock } from "lucide-react";

const DashboardSettings: React.FC = () => {
  const { users } = useUsers();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const { settings, loading, error, canViewOthers } = useUserSettings(selectedUserId || undefined);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleViewOwnSettings = () => {
    setSelectedUserId("");
  };

  if (loading) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Paramètres utilisateur</h1>
        <div>Chargement...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl font-bold">Paramètres utilisateur</h1>
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Paramètres utilisateur</h1>

      {/* Admin controls for viewing other users' settings */}
      {canViewOthers && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Voir les paramètres</h2>
          <div className="flex space-x-4 mb-4">
            <Button onClick={handleViewOwnSettings} variant={selectedUserId === "" ? "primary" : "secondary"}>
              Mes paramètres
            </Button>
            <select
              value={selectedUserId}
              onChange={(e) => handleUserSelect(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="">Selectionnez un  utilisateur</option>
              {users?.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.first_name} {u.last_name} ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Settings display */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">
          {selectedUserId ? `Settings for User ID: ${selectedUserId}` : "Tes paramètres"}
        </h2>

        {settings ? (
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Notifications Activées
              </label>
              <Input
                type="checkbox"
                checked={settings.notifications_enabled}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Globe className="w-5 h-5 mr-2 text-green-500" />
                Language
              </label>
              <Input
                value={settings.language}
                readOnly
                className="mt-1"
              />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Clock className="w-5 h-5 mr-2 text-purple-500" />
                Fuseau horaire
              </label>
              <Input
                value={settings.timezone}
                readOnly
                className="mt-1"
              />
            </div>
          </div>
        ) : (
          <div>Pas de paramètre trouvé</div>
        )}
      </div>
    </div>
  );
};

export default DashboardSettings;
