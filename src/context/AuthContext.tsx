import React, { createContext, useState, useContext, useEffect } from "react";

type User = {
  email: string;
  role: "user" | "admin" | "broker";
};
type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => User | null;
  logout: () => void;
  signup: (
    email: string,
    password: string,
    role: "user" | "admin" | "broker"
  ) => boolean; 
};
const AuthContext = createContext<AuthContextType | null>(null);
const initialUsers = {
  "user@example.com": { password: "password", role: "user" as const },
  "admin@example.com": { password: "password", role: "admin" as const },
  "broker@example.com": { password: "password", role: "broker" as const },
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch (error) {
      localStorage.removeItem("user");
    }
  }, []);
  const login = (email: string, password: string): User | null => {
    const foundUser = users[email as keyof typeof users];
    if (foundUser && foundUser.password === password) {
      const userData = { email, role: foundUser.role };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    logout();
    return null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const signup = (
    email: string,
    password: string,
    role: "user" | "admin" | "broker"
  ): boolean => {
    if (users[email as keyof typeof users]) {
      return false; 
    }
    const newUsers = { ...users, [email]: { password, role } };
    setUsers(newUsers);
    console.log("Updated users database:", newUsers); 
    return true; 
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
