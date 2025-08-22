// src/components/DistributorKPI.tsx
import React from "react";

type KPIProps = {
  title: string;
  value: number;
  color?: string;
};

const DistributorKPI: React.FC<KPIProps> = ({ title, value, color = "bg-purple-500" }) => {
  return (
    <div className={`p-4 rounded-lg shadow ${color} text-white`}>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
};

export default DistributorKPI;
