// src/components/Sidebar.tsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, BarChart, Users, Settings, ShoppingCart, Truck } from "lucide-react";
import { useTranslation } from "react-i18next"; 

export function Sidebar() {
  const { t } = useTranslation(); 

  return (
    <div className="w-64 bg-white border-r- border-blue-200 shadow-sm p-4">
      <h2 className="text-2xl font-bold text-indigo-600 mb-8">Post-Smart</h2>

      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <LayoutDashboard size={18} /> {t("dashboard")}
        </NavLink>

        <NavLink
          to="/finance"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <BarChart size={18} /> {t("finance")}
        </NavLink>

        <NavLink
          to="/sales"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <ShoppingCart size={18} /> {t("sales")}
        </NavLink>

        <NavLink
          to="/merchants"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Users size={18} /> {t("merchants")}
        </NavLink>

        <NavLink
          to="/distributors"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Truck size={18} /> {t("distributors")}
        </NavLink>

        <NavLink
          to="/it"
          className={({ isActive }) =>
            `flex items-center gap-2 p-2 rounded-lg ${
              isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          <Settings size={18} /> {t("settings")}
        </NavLink>
      </nav>
    </div>
  );
}
