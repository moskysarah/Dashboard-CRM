import React from "react";
import { Bell, User } from "lucide-react";
import { useTranslationContext } from "../contexts/translateContext";

export function Header() {
  const { translate } = useTranslationContext();

  const [translatedUserLabel, setTranslatedUserLabel] = React.useState("Admin");

  React.useEffect(() => {
    const translateLabel = async () => {
      const translated = await translate("Admin");
      setTranslatedUserLabel(translated);
    };
    translateLabel();
  }, [translate]);

  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Notifications + Avatar */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          {/* Pastille rouge pour notification */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <User size={22} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {translatedUserLabel}
          </span>
        </div>
      </div>
    </header>
  );
}
