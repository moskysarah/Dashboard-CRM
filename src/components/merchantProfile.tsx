import React from "react";

type Profile = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
};

interface Props {
  profile: Profile | null;
}

const MerchantProfile: React.FC<Props> = ({ profile }) => {
  if (!profile) return null;

  // Première lettre du prénom ou du nom
  const initial =
    profile.first_name?.charAt(0)?.toUpperCase() ||
    profile.last_name?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
      {/* Avatar ou cercle dynamique */}
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
          {initial}
        </div>
      )}

      {/* Informations du profil */}
      <h3 className="text-lg font-semibold text-gray-800">
        {profile.first_name} {profile.last_name}
      </h3>

      <p className="text-sm text-gray-600">{profile.email}</p>

      {/* Rôle en dessous */}
      <p className="mt-2 text-sm font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
        {profile.role ? profile.role.toUpperCase() : "MARCHAND"}
      </p>
    </div>
  );
};

export default MerchantProfile;
