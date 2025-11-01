import React, { useState, useEffect } from "react";
import { User, Mail, Phone, Save } from "lucide-react";
import { getUserSettings, updateUserSettings } from "../services/setting";

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les paramètres utilisateur
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const response: any = await getUserSettings();
        setSettings(response.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des paramètres utilisateur.");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  // Gérer la modification des champs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  // Sauvegarder les paramètres
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserSettings(settings);
      alert("Paramètres mis à jour avec succès !");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la sauvegarde des paramètres.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Chargement...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <User className="w-6 h-6 text-blue-600" />
          Paramètres de l’utilisateur
        </h1>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Nom d'utilisateur */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Nom d’utilisateur
            </label>
            <input
              type="text"
              name="username"
              value={settings?.username || ""}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Entrez votre nom"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Adresse e-mail
            </label>
            <div className="flex items-center border rounded-lg p-2">
              <Mail className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="email"
                name="email"
                value={settings?.email || ""}
                onChange={handleChange}
                className="w-full focus:outline-none"
                placeholder="Entrez votre email"
              />
            </div>
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Numéro de téléphone
            </label>
            <div className="flex items-center border rounded-lg p-2">
              <Phone className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="tel"
                name="phone"
                value={settings?.phone || ""}
                onChange={handleChange}
                className="w-full focus:outline-none"
                placeholder="Ex: +243..."
              />
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {saving ? "Enregistrement..." : "Sauvegarder les modifications"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
