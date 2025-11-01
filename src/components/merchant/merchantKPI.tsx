// components/merchantKPI.tsx
import React from "react";

interface MerchantKPIProps {
  title: string;
  value: number | string;
  color?: string;       // couleur du fond et texte
  icon?: React.ReactNode; // icône à afficher
  iconColor?: string;   // couleur de l'icône
}

const MerchantKPI: React.FC<MerchantKPIProps> = ({
  title,
  value,
  color = "bg-white text-gray-800 shadow",
  icon,
  iconColor = "text-gray-500",
}) => {
  return (
    <div className={`flex items-center justify-between p-4 rounded-lg ${color}`}>
      <div className="flex flex-col">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xl font-bold mt-1">{value}</span>
      </div>
      {icon && <div className={`ml-4 ${iconColor}`}>{icon}</div>}
    </div>
  );
};

export default MerchantKPI;
