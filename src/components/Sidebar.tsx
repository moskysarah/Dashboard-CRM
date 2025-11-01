// src/components/Sidebar.tsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart,
  Users,
  Settings,
  ShoppingCart,
  Store,
  UserCheck,
  Handshake ,
  Menu,
  X,
} from "lucide-react";
import LogoPostSmart from "./logoPostSmart";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  // Détecter la taille d’écran pour adapter automatiquement
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const links = [
    { label: "Tableau de bord admin", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Partenaire", to: "/distributor", icon: <Handshake  size={18} /> },
    { label: "Agent", to: "/agent", icon: <UserCheck size={18} /> },
    { label: "Client", to: "/users", icon: <Users size={18} /> },
    { label: "Marchands", to: "/merchants", icon: <Store size={18} /> },
    { label: "Finance", to: "/finance", icon: <BarChart size={18} /> },
    { label: "Vente", to: "/sales", icon: <ShoppingCart size={18} /> },
    { label: "Paramètre", to: "/it", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Barre supérieure mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between bg-[#0176D3] p-3 z-50">
        <div className="flex items-center gap-2 text-yellow-200 font-semibold">
          <LogoPostSmart /> Poste Smart
        </div>
        <button onClick={toggleSidebar} className="text-white">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Sidebar Desktop */}
      {!isMobile && (
        <div
          className="fixed top-0 left-0 h-full bg-[#0176D3] border-r border-blue-200 shadow-sm 
          p-4 w-64 z-40 text-white flex flex-col"
        >
          <div className="flex items-center gap-2 text-yellow-200 font-semibold text-lg mb-6">
            <LogoPostSmart /> Poste Smart
          </div>

          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    isActive ? "bg-indigo-500 text-white" : "hover:bg-indigo-500"
                  }`
                }
              >
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}

      {/* Sidebar Mobile plein écran */}
      {isMobile && (
        <div
          className={`fixed inset-0 bg-[#0176D3] text-white flex flex-col items-center justify-center transition-transform duration-300 z-50
            ${isOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Bouton X pour fermer */}
          <button
            onClick={closeSidebar}
            className="absolute top-5 right-5 text-white"
          >
            <X size={30} />
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 text-yellow-200 font-semibold text-xl mb-8">
            <LogoPostSmart /> Poste Smart
          </div>

          {/* Liens verticaux */}
          <nav className="flex flex-col items-center gap-5 text-lg font-medium">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `transition-colors ${
                    isActive ? "text-yellow-300" : "hover:text-yellow-200"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
