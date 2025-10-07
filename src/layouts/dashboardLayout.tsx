// src/layouts/DashboardLayout.tsx
import type { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect, useContext } from "react";
import { Bell, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../store/auth";

type Props = {
  children?: ReactNode;
};

type Notification = {
  id: number;
  message: string;
  read: boolean;
};

type Message = {
  id: number;
  from: string;
  content: string;
  read: boolean;
};

const DashboardLayout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
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

    const msgInterval = setInterval(() => {
      setMessages(prev => [
        { id: prev.length + 1, from: ["Alice", "Bob", "Charlie"][Math.floor(Math.random() * 3)], content: `Message aléatoire ${prev.length + 1}`, read: false },
        ...prev,
      ]);
    }, 10000);

    return () => {
      clearInterval(notifInterval);
      clearInterval(msgInterval);
    };
  }, []);

  const markNotifRead = (id: number) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markMsgRead = (id: number) => {
    setMessages(prev => prev.map(m => (m.id === id ? { ...m, read: true } : m)));
  };

  return (
  <div className="flex h-screen bg-gray-100 overflow-hidden overflow-x-hidden">
    <Sidebar />

    <div className="flex-1 flex flex-col">
      <header className="bg-white shadow border-b border-blue-200 p-4 flex justify-between items-center h-16">
        <h2 className="font-bold">Dashboard</h2>

        <div className="flex items-center gap-4">
          {/* Profil utilisateur */}
          {user && (
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <img
                src={user.profile_image || '/images/default-avatar.png'}
                alt="Avatar"
                className="w-10 h-10 rounded-full border-2 border-gray-300"
              />
              <div className="text-left">
                <p className="font-semibold text-sm">{user.username}</p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
            </div>
          )}

          {/* Sélecteur de langue */}
          <select
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
                  {notifications.length === 0 && <p>{t("notifications")}</p>}
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
                <button className="relative" onClick={() => setMsgOpen(false)}>
                  <Mail size={24} />
                  {messages.some(m => !m.read) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
                </button>
              </Link>
              {/* La logique du dropdown de messages est retirée pour privilégier la page dédiée */}
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="ml-auto mr-6 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              {t("logout")}
            </button>
          </div>
        </header>

        <main className="p-4 flex-1 overflow-y-auto h-[calc(100vh-64px)]">
             {children}
       </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
