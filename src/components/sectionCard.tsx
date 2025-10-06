import React from "react";

interface SectionCardProps {
  title: string;
  children?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default SectionCard;
