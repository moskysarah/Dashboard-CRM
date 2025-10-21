// src/components/DistributorKPI.tsx
import React from "react";

type KPIProps = {
  title: string | React.ReactNode;
  value: number;
  color?: string;
  icon?: React.ReactNode;
};

const DistributorKPI: React.FC<KPIProps> = ({ title, value, color = "bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-l-4 border-purple-500", icon }) => {
  return (
    <div className={`p-4 rounded-2xl shadow ${color}`}>
      <p className="text-sm font-semibold capitalize tracking-wide flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </p>
      <p className="text-xl font-bold mt-2">{value.toLocaleString()}</p>
    </div>
  );
};

export default DistributorKPI;
