// src/pages/Profile.tsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getProfile } from "../services/api";
import { useAuth } from "../store/auth";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const logout = useAuth((state) => state.logout);
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    role: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.data;
        // Utilise les données de l'API ou celles du store en fallback
        setProfile({
          name: data.name || `${user?.first_name} ${user?.last_name}` || "Utilisateur",
          email: data.email || user?.email || "Pas d'email",
          role: data.role || user?.role || "user",
          avatarUrl: data.avatarUrl || "/images/default-avatar.png",
        });
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
        // En cas d'erreur, on utilise les données du store
        if (user) {
          setProfile({ name: `${user.first_name} ${user.last_name}`, email: user.email || '', role: user.role || 'user' });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) return <p className="p-4">Chargement du profil...</p>;

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={profile.avatarUrl}
        alt={profile.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{profile.name}</p>
        <p className="text-sm text-gray-500">{profile.email}</p>
        <p className="text-sm text-gray-400">{profile.role}</p>
      </div>
      <button onClick={handleLogout} className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        {t("logout")}
      </button>
    </div>
  );
};

export default Profile;
