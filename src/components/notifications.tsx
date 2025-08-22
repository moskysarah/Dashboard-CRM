// src/components/Notifications.tsx
import { useState } from "react";
import { Bell } from "lucide-react";

export default function Notifications() {
  const [open, setOpen] = useState(false);

  const [notifications] = useState([
    { id: 1, message: "Nouvelle vente enregistrée : 1200$", date: "19/08/2025" },
    { id: 2, message: "Un client a envoyé un message", date: "18/08/2025" },
    { id: 3, message: "Rapport hebdomadaire généré", date: "17/08/2025" },
  ]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Notifications</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {notifications.map((n) => (
              <li
                key={n.id}
                className="p-2 rounded bg-gray-50 hover:bg-gray-100"
              >
                <p className="text-sm">{n.message}</p>
                <span className="text-xs text-gray-500">{n.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
