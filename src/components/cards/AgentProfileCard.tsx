import React from 'react';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { useAgentProfile } from '../../hooks/useAgents';

const AgentProfileCard: React.FC = () => {
  const { profile, loading, error } = useAgentProfile();

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg animate-pulse  ">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    //   <div className="bg-white p-6 rounded-xl shadow-lg w-150">
         <div className="bg-gradient-to-br h-80 from-green-600 via-teal-600 to-blue-700 p-4 md:p-6 lg:p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 md:hover:scale-102">

        <div className="text-center text-red-500">
          <p>Erreur de chargement du profil</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="bg-white p-3 md:p-4 lg:p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Mon Profil</h3>
            <p className="text-gray-500 text-sm">Informations personnelles</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <User className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Nom complet</p>
            <p className="font-medium text-gray-800">
              {profile.first_name} {profile.last_name}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium text-gray-800">{profile.email}</p>
          </div>
        </div>

        {profile.phone && (
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              <p className="font-medium text-gray-800">{profile.phone}</p>
            </div>
          </div>
        )}

        {profile.region && (
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Région</p>
              <p className="font-medium text-gray-800">{profile.region}</p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">Statut</p>
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              profile.is_active
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {profile.is_active ? 'Actif' : 'Inactif'}
            </span>
          </div>
        </div>

        {profile.created_at && (
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Membre depuis</p>
              <p className="font-medium text-gray-800">
                {new Date(profile.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentProfileCard;
