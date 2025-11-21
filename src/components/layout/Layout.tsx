import React from "react";
import { Sidebar } from "../Sidebar";
import { useState, useEffect } from "react";
import { Bell, Mail, Menu, X } from "lucide-react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../store/auth";
import { getNotifications, type AppNotification } from "../../services/notification";

type Props = {
  children?: React.ReactNode;
};

const Layout: React.FC<Props> = ({ children }) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Charger les notifications depuis ton API (seulement pour admin/superadmin)
  useEffect(() => {
    const loadNotifications = async () => {
      if (!user || !['admin', 'superadmin'].includes(user.role || '')) {
        return;
      }
      try {
        const data = await getNotifications({ user: user?.id });
        setNotifications(data.results);
      } catch (error) {
        console.error("Erreur lors du chargement des notifications:", error);
      }
    };

    if (user?.id) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user?.id, user?.role]);

  const markNotifRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_sent: true } : n))
    );
  };

  // Génère une couleur basée sur le rôle de l'utilisateur
  const getProfileColor = (role: string): string => {
    switch (role) {
      case 'admin':
      case 'superadmin':
        return 'bg-blue-500';
      case 'merchant':
        return 'bg-yellow-500';
      case 'agent':
        return 'bg-green-500';
        case 'client':
        return 'bg-purple-500';
        case 'partner':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Génère la lettre de profil
  const getInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex h-screen bg-gray-100 max-w-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-48 bg-[#0176D3] border-r border-blue-200 shadow-lg transform transition-transform duration-300 ease-in-out">
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow border-b border-blue-200 p-2 md:p-4 flex flex-wrap justify-between items-center h-16 md:h-20 max-w-full">
          <div className="flex items-center gap-2">
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h2 className="font-bold text-sm md:text-base">Dashboard</h2>
          </div>

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
                      user.role || "user"
                    )}`}
                  >
                    {getInitial(user.first_name || user.username || "U")}
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
                  {notifications.length === 0 && <p>Aucune notification</p>}
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

            {/* Déconnexion */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-2 md:px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Déconnexion
            </button>
          </div>
        </header>

        <main className="p-2 md:p-4 flex-1 overflow-y-auto overflow-x-hidden h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] md:ml-64">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default Layout;
