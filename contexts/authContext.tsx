'use client';
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType, LoginCredentials } from '../types/auth';
import authClient from '@/utils/auth-client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');

      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
          setAuthToken(token);
        } catch (e) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('userData');
        }
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const data = await authClient.login(credentials);

      if (!data) throw new Error('Error de autenticación');

      const { token, user } = data;

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      setUser(user);
      setAuthToken(token);

      return true;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const logout = (): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    setUser(null);
    setAuthToken(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, authToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};