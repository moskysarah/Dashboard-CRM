// src/components/DistributorKPI.tsx
import React from "react";

type KPIProps = {
  title: string;
  value: number;
  color?: string;
};

const DistributorKPI: React.FC<KPIProps> = ({ title, value, color = "bg-purple-100" }) => {
  return (
    <div className={`p-4 rounded-2xl shadow  ${color} `}>
      <p className="text-sm font-bold ">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DistributorKPI;
