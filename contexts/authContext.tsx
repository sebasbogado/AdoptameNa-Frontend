"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      console.log("Token recuperado del localStorage:", storedToken);
      setAuthToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken, user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
