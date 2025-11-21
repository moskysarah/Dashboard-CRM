// // src/context/AuthContext.tsx
// import { createContext, useContext, useState } from "react";

// interface User {
//   id: number;
//   email: string;
//   role: string;
// }

// interface AuthContextType {
//   user: User | null;
//   login: (data: User) => void;
//   logout: () => void;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   login: () => {},
//   logout: () => {},
// });

// export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);

//   const login = (data: User) => {
//     setUser(data);
//     localStorage.setItem("user", JSON.stringify(data));
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);
// src/context/AuthContext.tsx



import { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // 🔥 Récupérer le user depuis localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (data: User) => {
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
