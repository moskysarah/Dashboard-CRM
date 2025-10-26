// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart, Users, Settings, ShoppingCart, Store , Briefcase } from "lucide-react";
import LogoPostSmart from "./logoPostSmart";
import T from "./translatespace";
import { useAuth } from "../store/auth";

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role;

  return (
    <div className="w-48 md:w-64 h-screen bg-[#0176D3] border-r border-blue-200 shadow-sm p-2 md:p-4">
      <div className="flex items-center gap-2 text-yellow-200 font-bold text-base md:text-lg mt-3">
        <LogoPostSmart /> <T>Poste Smart</T>
      </div>
      <nav className="space-y-2 mt-6">
        {/* Dashboard général accessible à tous */}
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
              isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
            }`
          }
        >
          <LayoutDashboard size={18} /> <T>Tableau de bord général</T>
        </NavLink>

        {/* Dashboard Admin uniquement pour Admin/SuperAdmin */}
        {(role === "admin" || role === "superadmin" ) && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
                isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
              }`
            }
          >
            <LayoutDashboard size={18} /> <T>Dashboard Admin</T>
          </NavLink>
        )}
        {(role === "superadmin" || role === "partner" ) && (
          <NavLink
            to="/distributor"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
                isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
              }`
            }
          >
            <Briefcase size={18} /> <T>Distributeur</T>
          </NavLink>
        )}

        {/* Autres liens comme Users, Merchants, Finance, Sales */}
        {(role === "superadmin"  ||  role === "user") && (
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center gap-2 p-2 rounded-lg text-sm md:text-base ${
                isActive ? "bg-indigo-500 text-white" : "text-white hover:bg-indigo-500"
              }`
            }
          >
            <Users size={18} /> <T>Clients</T>
          </NavLink>
        )}

        {( role === "admin" || role === "superadmin") && (
          <>
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
          </>
        )}

        {(role === "admin" || role === "superadmin") && (
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
        )}
      </nav>
    </div>
  );
}
