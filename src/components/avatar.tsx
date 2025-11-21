import type { FC } from 'react';

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  role?: string;
  size?: string;
}

const Avatar: FC<AvatarProps> = ({ firstName, lastName, role, size = "w-10 h-10" }) => {
  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return "";
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500 text-white";
      case "superadmin":
        return "bg-purple-500 text-white";
      case "agent":
        return "bg-blue-500 text-white";
      case "merchant":
        return "bg-green-500 text-white";
      case "user":
        return "bg-gray-500 text-white";
      case "partner":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const displayText = firstName && lastName ? getInitials() : role?.toUpperCase() || "N/A";
  const bgColor = getRoleColor(role);

  return (
    <div
      className={`${size} ${bgColor} rounded-full flex items-center justify-center font-semibold text-sm`}
    >
      {displayText}
    </div>
  );
};

export default Avatar;
