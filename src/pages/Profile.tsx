import React from "react";
import { useTranslation } from "react-i18next";

interface ProfileProps {
  name?: string;
  email?: string;
  role?: string;
  avatarUrl?: string;
}

const Profile: React.FC<ProfileProps> = ({ 
  name = "sarah Ngoya", 
  email = "sarahmosky@gmail.com", 
  role = "User", 
  avatarUrl 
}) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={avatarUrl || "/images/default-avatar.png"}
        alt={name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div>
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-gray-500">{email}</p>
        <p className="text-sm text-gray-400">{role}</p>
      </div>
      <button className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
        {t("logout")}
      </button>
    </div>
  );
};

export default Profile;
