// src/layouts/DashboardLayout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { useTranslationContext } from "../contexts/translateContext";
import T from "../components/T";

type Props = {
  children?: ReactNode;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ Utilisation du contexte global
  const { language, setLanguage } = useTranslationContext();

  const getColorFromUsername = (username: string) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  // ✅ Modifier la langue via le select
  const changeLanguage = (lang: string) => {
    if (lang === "fr" || lang === "en") {
      setLanguage(lang);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const notifInterval = setInterval(() => {
      setNotifications(prev => [
        { id: prev.length + 1, message: `Nouvelle notification ${prev.length + 1}`, read: false },
        ...prev,
      ]);
    }, 8000);

    return () => {
      clearInterval(notifInterval);
    };
  }, []);

  const markNotifRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow border-b border-blue-200 p-4 flex justify-between items-center h-16 max-w-full">
          <h2 className="font-bold">Dashboard</h2>

          <div className="flex items-center gap-4">
            {/* Profil utilisateur */}
            {user && (
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full border-2 border-gray-300"
                  />
                ) : (
                  <div
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: getColorFromUsername(user.username) }}
                  >
                    {user.username[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <p className="font-semibold text-sm">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            )}

            {/* Sélecteur de langue */}
            <select
              value={language} //je  synchronise avec le contexte global
              onChange={(e) => changeLanguage(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>

            {/* Notifications */}
            <div className="relative">
              <button className="relative" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={24} />
                {notifications.some(n => !n.read) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded p-2 z-10">
                  {notifications.length === 0 && <p><T text="No notifications" /></p>}
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2 border-b cursor-pointer ${n.read ? "bg-gray-100" : "bg-white"}`}
                      onClick={() => markNotifRead(n.id)}
                    >
                      {n.message}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <Link to="/messages">
                <button className="relative">
                  <Mail size={24} />
                </button>
              </Link>
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="ml-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              <T text="Logout" />
            </button>
          </div>
        </header>

        <main className="p-4 flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
