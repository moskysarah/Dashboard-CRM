import React, { useState } from "react";
import { notifications } from "../api/fakeAPI";
import { useTranslation } from "react-i18next";

const Notification: React.FC = () => {
  const { t } = useTranslation();
  const [notifs, setNotifs] = useState(notifications);

  const markAsRead = (id: number) => {
    setNotifs(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h2 className="text-lg font-semibold mb-4">{t("notifications")}</h2>
      <ul>
        {notifs.map(n => (
          <li
            key={n.id}
            className={`border-b py-2 last:border-b-0 cursor-pointer ${n.read ? "text-gray-400" : "font-medium"}`}
            onClick={() => markAsRead(n.id)}
          >
            <p>{t(n.message)}</p>
            <p className="text-xs text-gray-500">{n.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notification;
