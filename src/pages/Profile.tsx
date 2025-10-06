// src/pages/Profile.tsx
import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import { UserContext } from "../contexts/userContext";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, setUser } = useContext(UserContext); // si tu utilises un contexte global
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
        const res = await api.get("/profile"); // ta route backend
        const data = res.data;
        setProfile({
          name: data.name || (user as any)?.name || "sarah Ngoya",
          email: data.email || (user as any)?.email || "sarahmosky@gmail.com",
          role: data.role || user?.role || "User",
          avatarUrl: data.avatarUrl || "/images/default-avatar.png",
        });
        // si tu veux mettre à jour le contexte global
        if (setUser) setUser(data);
      } catch (error) {
        console.error("Erreur lors du chargement du profil :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user, setUser]);

  const handleLogout = () => {
    // Implement logout logic here, e.g., clear auth tokens, redirect, etc.
    console.log("Logout clicked");
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
