import React from 'react';
import type { User } from '../types/domain';

interface UserContextType {
  user: User | null;
}

export const UserContext = React.createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export type { UserContextType };
