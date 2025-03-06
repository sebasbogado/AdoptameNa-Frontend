"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  useEffect(() => {
    // Recuperar token y usuario desde localStorage
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setAuthToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
