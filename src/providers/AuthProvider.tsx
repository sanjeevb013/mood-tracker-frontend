"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id?: string;
  email?: string;
  // add more fields as needed
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (accessToken: string, refreshToken: string, user?: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, restore tokens and user if available
    const access = localStorage.getItem("accessToken");
    const refresh = localStorage.getItem("refreshToken");
    const storedUser = localStorage.getItem("user");

    if (access && refresh) {
      setUser(storedUser ? JSON.parse(storedUser) : { email: "unknown" });
    }
    setLoading(false);
  }, []);

  const login = (accessToken: string, refreshToken: string, user?: User) => {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    if (user) localStorage.setItem("user", JSON.stringify(user));

    setUser(user ?? { email: "unknown" });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/auth/login");
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
