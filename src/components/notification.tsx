import React, { useState, useEffect } from "react";
import API from "../services/api";
import { useTranslationContext } from "../contexts/translateContext";

// Typage notification
export type NotificationType = {
  id: string | number;
  message: string;
  date: string;
  read: boolean;
};

const Notification: React.FC = () => {
  const { translate } = useTranslationContext();
  const [notifs, setNotifs] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);

  // 1 Récupération notifications depuis ton API
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notification/messages/");
      setNotifs(res.data);
    } catch (err) {
      console.error("Erreur fetch notifications API:", err);
    }
  };

  // 2 Exemple : récupération notifications Google API
  const fetchGoogleNotifications = async () => {
    try {
      const token = localStorage.getItem("GOOGLE_ACCESS_TOKEN"); // OAuth
      if (!token) return;

      const response = await fetch(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const googleNotifs: NotificationType[] = data.items.map((item: any) => ({
        id: item.id,
        message: item.summary || "Événement Google",
        date: item.start?.dateTime || item.start?.date || "",
        read: false,
      }));

      setNotifs((prev) => [...googleNotifs, ...prev]);
    } catch (err) {
      console.error("Erreur fetch Google API:", err);
    }
  };

  // Marquer notification comme lue
  const handleMarkAsRead = async (id: string | number) => {
    try {
      await API.patch(`/notification/messages/${id}/`, { is_read: true });
      setNotifs((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Erreur mark as read:", err);
    }
  };

  useEffect(() => {
    const loadAllNotifications = async () => {
      setLoading(true);
      await fetchNotifications();
      await fetchGoogleNotifications();
      setLoading(false);
    };
    loadAllNotifications();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow mt-6 text-center">
        {translate("loading")}...
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6 max-w-full md:max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">{translate("Notifications")}</h2>
      <ul className="divide-y divide-gray-200">
        {notifs.map((n) => (
          <li
            key={n.id}
            className={`py-2 px-2 cursor-pointer ${
              n.read ? "text-gray-400" : "font-medium"
            } hover:bg-gray-50 rounded`}
            onClick={() => handleMarkAsRead(n.id)}
          >
            <p className="truncate">{translate(n.message)}</p>
            <p className="text-xs text-gray-500">{n.date}</p>
          </li>
        ))}
        {notifs.length === 0 && (
          <li className="py-2 text-center text-gray-500">
            {translate("No notifications")}
          </li>
        )}
      </ul>
    </div>
  );
};

export default Notification;
