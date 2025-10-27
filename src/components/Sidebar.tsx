// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart, Users, Settings, ShoppingCart, Store , Briefcase } from "lucide-react";
import LogoPostSmart from "./logoPostSmart";
import T from "./translatespace";

export function Sidebar() {
  const links = [
    //{ label: "Tableau de bord général", to: "/", icon: <LayoutDashboard size={18} /> },
    { label: "Dashboard Admin", to: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Distributeur", to: "/distributor", icon: <Briefcase size={18} /> },
    { label: "Clients", to: "/users", icon: <Users size={18} /> },
    { label: "Marchand", to: "/merchants", icon: <Store size={18} /> },
    { label: "Finance", to: "/finance", icon: <BarChart size={18} /> },
    { label: "Vente", to: "/sales", icon: <ShoppingCart size={18} /> },
    { label: "Paramètre", to: "/it", icon: <Settings size={18} /> },
  ];

  return (
    <div className="w-48 md:w-64 h-screen bg-[#0176D3] border-r border-blue-200 shadow-sm p-2 md:p-4">
      <div className="flex items-center gap-2 text-yellow-200 font-bold text-base md:text-lg mt-3">
        <LogoPostSmart /> <T>Poste Smart</T>
      </div>
      <nav className="space-y-2 mt-6">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
                isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
              }`
            }
          >
            {link.icon} <T>{link.label}</T>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
