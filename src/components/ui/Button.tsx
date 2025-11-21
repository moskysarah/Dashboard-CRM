import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'outline' | 'destructive';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: React.ReactNode;
  href?: string;
  size?: string;
}

const baseClasses = "py-2 rounded-lg font-semibold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-offset-2";

const sizeClasses: Record<string, string> = {
  small: "px-4 text-sm",
  medium: "px-4 ",
  large: "px-8 text-lg",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-indigo-600 text-white hover:bg-indigo-700",
  secondary: "border-2 border-white text-white hover:bg-white hover:text-indigo-600",
  success: "bg-green-600 text-white hover:bg-green-700",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-indigo-600 hover:underline",
  outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  destructive: "bg-red-600 text-white hover:bg-red-700",
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className, href, size = 'medium', ...props }) => {
  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return <button className={combinedClasses} {...props}>{children}</button>;
};
