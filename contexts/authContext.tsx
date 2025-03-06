"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/appContext";

type AuthContextType = {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => { },
  logout: () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useAppContext();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Retrieve token from localStorage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  // Handle token updates
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("authToken", authToken);
    }
  }, [authToken]);

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("authToken");
    // Update state
    setAuthToken(null);
    // Redirect to login page
    setCurrentUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}