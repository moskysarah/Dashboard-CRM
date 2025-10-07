import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
}

const baseClasses = "w-full py-2 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "border-2 border-white text-white hover:bg-white hover:text-indigo-600",
  success: "bg-green-600 text-white hover:bg-green-700",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-indigo-600 hover:underline",
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, ...props }) => {
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className || ''}`;

  return <button className={combinedClasses} {...props}>{children}</button>;
};