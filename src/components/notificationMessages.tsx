import React from "react";
import { useNotifications } from "../hooks/useOtpNotifications";
import type { Message } from "../types/domain";

const NotificationMessages: React.FC = () => {
  const { notifications, loading } = useNotifications({ is_for: "merchant" });

  if (loading)
    return <div className="text-center py-6 text-gray-600">Chargement des notifications...</div>;

  return (
    <div className="p-4 bg-white rounded-2xl shadow-md max-w-3xl mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">📩 Notifications internes</h2>

      {notifications.length === 0 ? (
        <p className="text-gray-500">Aucune notification pour l’instant.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((notif: Message) => (
            <li key={notif.id} className="py-3">
              <div className="flex justify-between items-center">
                <p className="text-gray-700">{notif.message}</p>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    notif.is_sent ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {notif.is_sent ? "Envoyé" : "En attente"}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(notif.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationMessages;
