import type { UserRole } from "../types/domain";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  size?: string; // exemple: "w-12 h-12"
}

// Couleurs des avatars selon le rôle
const roleColors: Record<UserRole, string> = {
  superadmin: "bg-blue-500 text-white",
  admin: "bg-green-500 text-white",
  agent: "bg-purple-500 text-white",
  partner: "bg-yellow-500 text-white",
  user: "bg-gray-500 text-white",
};

const AvatarRole: React.FC<AvatarProps> = ({
  firstName = "",
  lastName = "",
  role = "user",
  size = "w-12 h-12",
}) => {
  const letters = `${firstName?.[0] || "?"}${lastName?.[0] || "?"}`.toUpperCase();

  return (
    <div
      className={`flex items-center justify-center rounded-full ${size} ${roleColors[role]} font-bold text-lg`}
      title={`${firstName || "Unknown"} ${lastName || "user"}`} // Tooltip au survol
    >
      {letters}
    </div>
  );
};

export default AvatarRole;
