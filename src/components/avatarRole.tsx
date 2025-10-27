import React from "react";

interface AvatarRoleProps {
  firstName: string;
  lastName: string;
  userName: string;
  role: string;
  size: string; // ex: "w-10 h-10"
}

const AvatarRole: React.FC<AvatarRoleProps> = ({
  firstName,
  lastName,
  userName ,
  role,
  size,
}) => {
  // Initiales (ex: Sarah Ngoya → SN)
  const initials = `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}${userName?.charAt(0) || ""}`.toUpperCase();

  // Couleurs selon le rôle
  const roleColors: Record<string, string> = {
    superadmin: "bg-purple-600",
    admin: "bg-blue-600",
    agent: "bg-green-600",
    partner: "bg-yellow-500",
    user: "bg-yellow-500",
    distributor: "bg-orange-600",
    default: "bg-gray-500",
  };

  // Sélection automatique de la couleur
  const bgColor = roleColors[role.toLowerCase()] || roleColors.default;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${size} ${bgColor} text-white rounded-full flex items-center justify-center font-bold uppercase shadow-md`}
      >
        {initials}
      </div>
      <span className="text-gray-700 font-medium capitalize">{role}</span>
    </div>
  );
};

export default AvatarRole;
