import type { ReactNode } from "react";

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  return <>{children}</>;
};
