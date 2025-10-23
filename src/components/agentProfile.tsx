import React from "react";

type Agent = {
  id: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string;
  avatar_url?: string;
};

interface Props {
  agent: Agent | null;
}

const AgentProfile: React.FC<Props> = ({ agent }) => {
  if (!agent) return null;

  const initial =
    agent.first_name?.charAt(0)?.toUpperCase() ||
    agent.last_name?.charAt(0)?.toUpperCase() ||
    "?";

  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md p-6 flex flex-col items-center text-center">
      {agent.avatar_url ? (
        <img
          src={agent.avatar_url}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover mb-3"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-3">
          {initial}
        </div>
      )}

      <h3 className="text-lg font-semibold text-gray-800">
        {agent.first_name} {agent.last_name}
      </h3>
      <p className="text-sm text-gray-600">{agent.email}</p>
      <p className="mt-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
        {agent.role ? agent.role.toUpperCase() : "AGENT"}
      </p>
    </div>
  );
};

export default AgentProfile;
