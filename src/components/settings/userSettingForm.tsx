import React, { useEffect, useState } from "react";
import { getUserSettings, updateUserSettings } from "../../services/setting";
import type { UserSettings } from "../../types/domain";

const UserSettingsForm: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserSettings()
      .then((res: any) => {
        if (res.data) {
          setSettings(res.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (settings) {
      setSettings({ ...settings, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (settings) {
      await updateUserSettings(settings);
      alert("Paramètres mis à jour !");
    }
  };

  if (loading) return <p>Chargement...</p>;

  if (!settings) return <p>Erreur de chargement des paramètres.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded shadow">
      <h2 className="text-lg font-semibold">Paramètres utilisateur</h2>

      <input
        type="text"
        name="username"
        value={settings.username}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Nom d’utilisateur"
      />

      <input
        type="email"
        name="email"
        value={settings.email}
        onChange={handleChange}
        className="border p-2 w-full rounded"
        placeholder="Adresse e-mail"
      />

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Sauvegarder
      </button>
    </form>
  );
};

export default UserSettingsForm;
