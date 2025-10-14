// src/components/MerchantKPI.tsx
import React from "react";

type KPIProps = {
  title: string | React.ReactNode;
  value: number;
  color?: string;
};

const MerchantKPI: React.FC<KPIProps> = ({ title, value, color = "bg-blue-500" }) => {
  return (
    <div className={`p-4 rounded-2xl shadow ${color} text-black`}>
      <p className="text-sm font-bold ">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default MerchantKPI;
