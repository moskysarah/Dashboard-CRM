import React from "react";

interface AnalyticsCardProps {
  title: string;
  value: string | number;
  color?: string;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, color }) => (
  <div className={`rounded-xl shadow p-4 text-center ${color || "bg-white"}`}>
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default AnalyticsCard;
