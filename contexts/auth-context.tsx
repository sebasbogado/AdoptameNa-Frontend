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
  const updateUserProfileCompletion = (isCompleted: boolean): void => {
    if (user) {
      const updatedUser = { ...user, isProfileCompleted: isCompleted };
      setUser(updatedUser);
  
      // Guardar el usuario actualizado en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('userData', JSON.stringify(updatedUser));  // Esto debe guardar correctamente el nuevo estado
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
  
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
  
          // Solo asignar false si isProfileCompleted es undefined, no si es null
          if (parsedUser.isProfileCompleted === undefined) {
            parsedUser.isProfileCompleted = false;
          }
  
          setUser(parsedUser);
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

  const loginWithGoogle = async (code: string): Promise<void> => {
    try {
      const { token, user } = await authClient.loginWithGoogle(code);

      if (!token || !user) throw new Error('Error de autenticación con Google');

      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
      }

      setUser(user);
      setAuthToken(token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error de login con Google:', error);
      throw error;
    }
  }

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
    <AuthContext.Provider value={{ user, login, logout, loading, authToken, loginWithGoogle, updateUserProfileCompletion,  isProfileCompleted: user?.isProfileCompleted ?? false  }}>
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