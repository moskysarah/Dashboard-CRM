// src/layouts/DashboardLayout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Bell, Mail, Globe } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { getNotifications, type Notification } from "../services/notification";
import { useTranslate } from "../contexts/translateContext";
import T from "../components/T";

type Props = {
  children?: ReactNode;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const { language, setLanguage } = useTranslate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Charger les notifications depuis ton API
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data.results);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      }
    };

    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const markNotifRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_sent: true } : n))
    );
  };

  // 🎨 Génère une couleur dynamique basée sur le nom de l'utilisateur
  const getProfileColor = (name: string): string => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-teal-500",
    ];
    const index = name ? name.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  // 🧍 Génère la lettre de profil
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex h-screen bg-gray-100 max-w-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow border-b border-blue-200 p-2 md:p-4 flex flex-wrap justify-between items-center h-16 md:h-20 max-w-full">
          <h2 className="font-bold text-sm md:text-base"><T>Dashboard</T></h2>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Profil utilisateur */}
            {user && (
              <div className="flex items-center gap-2 bg-gray-100 px-2 md:px-3 py-1 rounded-full">
                {user.profile_image ? (
                  <img
                    src={user.profile_image}
                    alt="Avatar"
                    className="w-8 md:w-10 h-8 md:h-10 rounded-full border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div
                    className={`w-8 md:w-10 h-8 md:h-10 rounded-full flex items-center justify-center text-white font-semibold border-2 border-gray-300 ${getProfileColor(
                      user.username || "U"
                    )}`}
                  >
                    {getInitial(user.username || "U")}
                  </div>
                )}

                <div className="text-left hidden md:block">
                  <p className="font-semibold text-sm">{user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
              </div>
            )}

            {/* Notifications */}
            <div className="relative">
              <button className="relative" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={20} />
                {notifications.some((n) => !n.is_sent) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white shadow-lg border rounded p-2 z-10">
                  {notifications.length === 0 && <p><T>Aucune notification</T></p>}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 border-b cursor-pointer text-sm ${
                        n.is_sent ? "bg-gray-100" : "bg-white"
                      }`}
                      onClick={() => markNotifRead(n.id)}
                    >
                      {n.message}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(n.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative">
              <Link to="/messages">
                <button className="relative">
                  <Mail size={20} />
                </button>
              </Link>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button className="relative" onClick={() => setLangOpen(!langOpen)}>
                <Globe size={20} />
              </button>

              {langOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded p-2 z-10">
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${language === 'fr' ? 'bg-blue-100' : ''}`}
                    onClick={() => { setLanguage('fr'); setLangOpen(false); }}
                  >
                    <T>Français</T>
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${language === 'en' ? 'bg-blue-100' : ''}`}
                    onClick={() => { setLanguage('en'); setLangOpen(false); }}
                  >
                    <T>English</T>
                  </button>
                  <button
                    className={`block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 ${language === 'ar' ? 'bg-blue-100' : ''}`}
                    onClick={() => { setLanguage('ar'); setLangOpen(false); }}
                  >
                    <T>العربية</T>
                  </button>
                </div>
              )}
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-2 md:px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              <T>logout</T>
            </button>
          </div>
        </header>

        <main className="p-2 md:p-4 flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-80px)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
