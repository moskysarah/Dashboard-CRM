// src/pages/Profile.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, changePassword } from "../services/api";
import { useAuth } from "../store/auth";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface ProfileData {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

const Profile: React.FC = () => {
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

  // Change password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordLoading, setChangePasswordLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile(user?.id || 0);
        const data = res.data;
        // Utilise les données de l'API ou celles du store en fallback
        setProfile({
          name: data.name || `${user?.first_name} ${user?.last_name}` || "Utilisateur",
          email: data.email || user?.email || "Pas d'email",
          role: data.role || user?.role || "user",
          avatarUrl: data.avatarUrl || "/images/default-avatar.png",
        });
    } catch (error: unknown) {
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

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError("");
    if (newPassword !== confirmPassword) {
      setChangePasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }
    setChangePasswordLoading(true);
    try {
      await changePassword(oldPassword, newPassword);
      alert("Mot de passe changé avec succès !");
      setShowChangePassword(false);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      console.error("Erreur lors du changement de mot de passe :", error);
      if (error instanceof Error && 'response' in error && error.response) {
        const response = error.response as { data?: { detail?: string } };
        setChangePasswordError(response?.data?.detail || "Erreur lors du changement de mot de passe.");
      } else {
        setChangePasswordError("Erreur inconnue lors du changement de mot de passe.");
      }
    } finally {
      setChangePasswordLoading(false);
    }
  };

  if (loading) return <p className="p-4">Chargement du profil...</p>;

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white rounded-lg shadow">
        {profile.avatarUrl && profile.avatarUrl !== "/images/default-avatar.png" ? (
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
              profile.role === 'admin' || profile.role === 'superadmin' ? 'bg-blue-500' :
              profile.role === 'merchant' ? 'bg-yellow-500' :
              profile.role === 'user' ? 'bg-green-500' : 'bg-gray-500'
            }`}
          >
            {profile.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
        )}
        <div className="text-center md:text-left">
          <p className="font-semibold">{profile.name}</p>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm text-gray-400">{profile.role}</p>
        </div>
        <button onClick={handleLogout} className="mt-2 md:mt-0 md:ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-4">
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="w-full text-left font-semibold text-blue-600 hover:text-blue-800"
        >
          Changer le mot de passe
        </button>
        {showChangePassword && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
            <Input
              isPassword
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="L’ancien mot de passe actuel"
              required
            />
            <Input
              isPassword
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Le nouveau mot de passe"
              required
            />
            <Input
              isPassword
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Pour confirmer le nouveau mot de passe"
              required
            />
            {changePasswordError && <p className="text-red-500 text-sm">{changePasswordError}</p>}
            <Button
              type="submit"
              variant="primary"
              disabled={changePasswordLoading}
              className="flex justify-center items-center"
            >
              {changePasswordLoading ? "Chargement..." : "Changer le mot de passe"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
