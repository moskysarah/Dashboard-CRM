import type { FC, ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  children?: ReactNode;
}

const SectionCard: FC<SectionCardProps> = ({ title, children }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 relative">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">{title}</h2>
      {children}
    </div>
  );
};

export default SectionCard;
