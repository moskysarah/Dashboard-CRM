import React, { useState, useEffect } from "react";
import {
  fetchNotifications,
  markNotificationAsRead,
  type Notification as NotificationType,
} from "../services/notification";

const Notification: React.FC = () => {
  const [notifs, setNotifs] = useState<NotificationType[]>([]);

  useEffect(() => {
    fetchNotifications()
      .then(setNotifs)
      .catch((err) => console.error(err));
  }, []);

  const handleMarkAsRead = (id: number | string) => {
    markNotificationAsRead(id.toString())
      .then(() => {
        setNotifs((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">Notifications</h2>
      <ul>
        {notifs.map((n) => (
          <li
            key={n.id}
            className={`border-b py-2 last:border-b-0 cursor-pointer ${
              n.read ? "text-gray-400" : "font-medium"
            }`}
            onClick={() => handleMarkAsRead(n.id)}
          >
            <p>{n.message}</p>
            <p className="text-xs text-gray-500">{n.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
