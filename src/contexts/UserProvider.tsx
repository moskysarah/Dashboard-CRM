import React from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../store/auth';
import { UserContext, type UserContextType } from './userContext.ts';

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const value: UserContextType = {
    user,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
