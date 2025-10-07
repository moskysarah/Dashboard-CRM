import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // On pourra ajouter des props custom plus tard (ex: état d'erreur)
}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  const baseClasses = "w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none";
  const combinedClasses = `${baseClasses} ${className || ''}`;

  return <input className={combinedClasses} {...props} />;
};