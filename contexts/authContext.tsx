"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/appContext";

type AuthContextType = {
  authToken: string | null;
  setAuthToken: (token: string | null) => void;
  logout: () => void;
  singIn: (token: string, user: { fullName: string, email: string }) => void;
  currentUser: { fullName: string, email: string } | null;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  authToken: null,
  setAuthToken: () => { },
  logout: () => { },
  singIn: () => { },
  currentUser: null
});

// Helper function to check if code is running in the browser
const isBrowser = () => typeof window !== "undefined";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setCurrentUser } = useAppContext();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUser, setLocalCurrentUser] = useState<{ fullName: string, email: string } | null>(null);
  const router = useRouter();

  // Load user data and token on initial mount
  useEffect(() => {
    // Only run on the client-side
    if (!isBrowser()) return;

    // Retrieve token and user from localStorage
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthToken(storedToken);
        setLocalCurrentUser(parsedUser);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        // Handle corrupted data by clearing it
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      }
    }
  }, [setCurrentUser]); // Add setCurrentUser as dependency

  // Handle token updates
  useEffect(() => {
    if (!isBrowser()) return;

    if (authToken) {
      localStorage.setItem("authToken", authToken);
    } else {
      localStorage.removeItem("authToken");
    }
  }, [authToken]);

  // Handle user updates in local storage
  useEffect(() => {
    if (!isBrowser()) return;

    if (currentUser) {
      localStorage.setItem("user", JSON.stringify(currentUser));
      setCurrentUser(currentUser);
    } else {
      localStorage.removeItem("user");
      setCurrentUser(null);
    }
  }, [currentUser, setCurrentUser]);

  const singIn = (token: string, user: { fullName: string, email: string }) => {
    setAuthToken(token);
    setLocalCurrentUser(user);

    if (isBrowser()) {
      router.push("/dashboard");
    }
  }

  const logout = () => {
    setAuthToken(null);
    setLocalCurrentUser(null);

    if (isBrowser()) {
      router.push("/auth/login");
    }
  };

  return (
    <AuthContext.Provider value={{
      authToken,
      setAuthToken,
      logout,
      singIn,
      currentUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}