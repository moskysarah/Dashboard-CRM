import type { ReactNode } from "react"; 
import { Sidebar } from "../components/Sidebar";
import { useState, useEffect } from "react";
import { Bell, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom"; 
import { useTranslation } from "react-i18next"; // ✅ import traduction

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [msgOpen, setMsgOpen] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(); 

  // Changer la langue
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = () => {
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
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">{t("dashboard")}</h2>

          <div className="flex items-center gap-4">
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
              <button className="relative" onClick={() => setMsgOpen(!msgOpen)}>
                <Mail size={24} />
                {messages.some(m => !m.read) && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />}
              </button>
              {msgOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg border rounded p-2 z-10">
                  {messages.length === 0 && <p>{t("messages")}</p>}
                  {messages.map(m => (
                    <div
                      key={m.id}
                      className={`p-2 border-b cursor-pointer ${m.read ? "bg-gray-100" : "bg-white"}`}
                      onClick={() => markMsgRead(m.id)}
                    >
                      <strong>{m.from}:</strong> {m.content}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              {t("logout")}
            </button>
          </div>
        </header>

        <main className="p-4 overflow-auto flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
