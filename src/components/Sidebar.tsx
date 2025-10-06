// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart, Users, Settings, ShoppingCart, Truck } from "lucide-react";
import { useTranslation } from "react-i18next"; 
import LogoPostSmart from "./logoPostSmart"; // import logo post smart


export function Sidebar() {
  const { t } = useTranslation(); 

  return (
    <div className="w-64  bg-[#0176D3] border-r- border-blue-200 shadow-sm p-4 ">
           <div className="flex items-center gap-2 text-yellow-200 font-bold text-lg">
             <LogoPostSmart /> Poste Smart
           </div>
      <nav className="space-y-2 mt-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            }`
          }
        >
          <LayoutDashboard size={18} /> {t("Tableau de bord")}
        </NavLink>

        <NavLink
          to="/finance"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            }`
          }
        >
          <BarChart size={18} /> {t("Finance")}
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            
            }`
          }
        >
          <ShoppingCart size={18} /> {t("Vente")}
        </NavLink>

        <NavLink
          to="/merchants"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            }`
          }
        >
          <Users size={18} /> {t("Marchand")}
        </NavLink>

        <NavLink
          to="/distributors"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            }`
          }
        >
          <Truck size={18} /> {t("distributeur")}
        </NavLink>

        <NavLink
          to="/it"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-500 text-white  w-50 " : "text-white  hover:text-white w-50   hover:bg-indigo-500"
            }`
            
          }
        >
          <Settings size={18} /> {t("Paramètre")}
        </NavLink>
      </nav>
    </div>
  );
}
