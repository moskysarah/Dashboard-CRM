import  { createContext, useState, } from "react";
import type { ReactNode } from "react";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name:string;
  date_created: string;
  date_joined:string;
  date_update:string;
  profile_image:string;
  phone:string;
  user_permissions: any [];
  settings:any;
  is_active:boolean;
  is_email_verified:boolean;
  is_phone_verified:boolean;
  is_superuser:boolean;
  last_login:string;
  merchant:any  | null;
  user:any  | null;
  email?: string;
  city : string;
  country: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
