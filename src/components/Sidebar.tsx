// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart, Users, Settings, ShoppingCart,Store } from "lucide-react"; //Truck
import LogoPostSmart from "./logoPostSmart"; // import logo post smart
import T from "./translatespace";

export function Sidebar() {
  return (
    <div className="w-48 md:w-64 h-screen bg-[#0176D3] border-r border-blue-200 shadow-sm p-2 md:p-4">
      <div className="flex items-center gap-2 text-yellow-200 font-bold text-base md:text-lg mt-3">
        <LogoPostSmart /> <T>Poste Smart</T>
      </div>
      <nav className="space-y-2 mt-6">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <LayoutDashboard size={18} /> <T>Tableau de bord</T>
        </NavLink>



        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <Users size={18} /> <T>Utilisateurs</T>
        </NavLink>

        <NavLink
          to="/merchants"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <Store size={18} /> <T>Marchand</T>
        </NavLink>

        <NavLink
          to="/finance"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <BarChart size={18} /> <T>Finance</T>
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <ShoppingCart size={18} /> <T>Vente</T>
        </NavLink>

        {/* <NavLink
          to="/distributors"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <Truck size={18} /> <T>distributeur</T> */}

       <NavLink
          to="/it"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <Settings size={18} /> <T>Paramètre</T>
        </NavLink>
      </nav>
    </div>
  );
}
