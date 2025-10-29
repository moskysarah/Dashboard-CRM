// src/components/Header.tsx

import { Bell, } from "lucide-react";  // Globe
// import { useTranslate } from "../contexts/translateContext";
import { useAuth } from "../store/auth";
import Avatar from "./avatar";

export function Header() {
  // const { language, setLanguage } = useTranslate();
  const { user } = useAuth();

  // const toggleLanguage = () => {
  //   setLanguage(language === 'fr' ? 'en' : 'fr');
  // };

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      
      {/* Notifications + Avatar + Nom utilisateur */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          {/* Pastille rouge pour notification */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user && (
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              firstName={user.first_name || ""}
              lastName={user.last_name || ""}
              role={user.role || "user"}
              size="w-10 h-10"
            />
            <span className="text-sm font-medium text-gray-700">
              {user.first_name} {user.last_name}
            </span>
          </div>
        )}
      </div>

      {/* Language Switcher
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
        title={`Switch to ${language === 'fr' ? 'English' : 'Français'}`}
      >
        <Globe size={18} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700 uppercase">
          {language === 'fr' ? 'FR' : 'EN'}
           </button>
        </span> */}
     
    </header>
  )
}
