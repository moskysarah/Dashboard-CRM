import React from "react";

interface CommissionKPIProps {
  title: string;
  value: number | string;
  color?: string;
  icon?: React.ReactNode;
}

const CommissionKPI: React.FC<CommissionKPIProps> = ({ title, value, color = "bg-white", icon }) => {
  return (
    <div className={`p-4 rounded-lg shadow ${color} flex items-center justify-between`}>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold text-gray-800">{value}</p>
      </div>
      {icon && <div className="text-2xl">{icon}</div>}
    </div>
  );
};

export default CommissionKPI;
