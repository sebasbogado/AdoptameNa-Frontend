'use client';
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType, LoginCredentials } from '../types/auth';
import * as authServices from '@/utils/auth.http';
import { getFullUser } from '@/utils/user-profile.http';
import Cookies from 'js-cookie';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const TOKEN_COOKIE_NAME = 'authToken';
const COOKIE_EXPIRATION_DAYS = 7;

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
    }
  };

  const fetchUserData = async (token: string) => {
    try {
      const userData = await authServices.checkToken(token);

      if (userData.isProfileCompleted === undefined) {
        userData.isProfileCompleted = false;
      }

      // Obtener información completa del usuario incluyendo datos de ubicación
      try {
        const fullUserData = await getFullUser(userData.id.toString());
        // Combinar la información básica con la información completa (incluida la ubicación)
        const enhancedUserData = {
          ...userData,
          location: {
            lat: fullUserData.latitude || null,
            lon: fullUserData.longitude || null,
            neighborhoodId: fullUserData.neighborhoodId || null,
            districtId: fullUserData.districtId || null,
            departmentId: fullUserData.departmentId || null,
            neighborhoodName: fullUserData.neighborhoodName || null,
            districtName: fullUserData.districtName || null,
            departmentName: fullUserData.departmentName || null,
          }
   
        };
        
        setUser(enhancedUserData);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(userData); // En caso de error, mantenemos los datos básicos
      }

      if (userData.isProfileCompleted === false) {
        router.push('/auth/create-profile');
      }

      setAuthToken(token);
    } catch (error) {
      console.error("Error verificando token:", error);
      Cookies.remove(TOKEN_COOKIE_NAME);
      setUser(null);
      setAuthToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get(TOKEN_COOKIE_NAME);

    if (token) {
      fetchUserData(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const data = await authServices.login(credentials);

      if (!data) throw new Error('Error de autenticación');

      const { token, user } = data;

      Cookies.set(TOKEN_COOKIE_NAME, token, { expires: COOKIE_EXPIRATION_DAYS });

      try {
        // Obtener información completa del usuario incluyendo datos de ubicación
        const fullUserData = await getFullUser(user.id.toString());
        // Combinar la información básica con la información completa
        const enhancedUser = {
          ...user,
          location: {
            lat: fullUserData.latitude || null,
            lon: fullUserData.longitude || null,
            neighborhoodId: fullUserData.neighborhoodId || null,
            districtId: fullUserData.districtId || null,
            departmentId: fullUserData.departmentId || null,
            neighborhoodName: fullUserData.neighborhoodName || null,
            districtName: fullUserData.districtName || null,
            departmentName: fullUserData.departmentName || null,
          }

        };
        setUser(enhancedUser);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(user); // En caso de error, mantenemos los datos básicos
      }
      
      setAuthToken(token);

      return true;
    } catch (error) {
      console.error('Error de login:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (code: string): Promise<void> => {
    try {
      const { token, user } = await authServices.loginWithGoogle(code);

      if (!token || !user) throw new Error('Error de autenticación con Google');

      Cookies.set(TOKEN_COOKIE_NAME, token, { expires: COOKIE_EXPIRATION_DAYS });

      try {
        // Obtener información completa del usuario incluyendo datos de ubicación
        const fullUserData = await getFullUser(user.id.toString());
        // Combinar la información básica con la información completa
        const enhancedUser = {
          ...user,
          location: {
            lat: fullUserData.latitude || null,
            lon: fullUserData.longitude || null,
            neighborhoodId: fullUserData.neighborhoodId || null,
            districtId: fullUserData.districtId || null,
            departmentId: fullUserData.departmentId || null,
            neighborhoodName: fullUserData.neighborhoodName || null,
            districtName: fullUserData.districtName || null,
            departmentName: fullUserData.departmentName || null,
          }
        };
        setUser(enhancedUser);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(user); // En caso de error, mantenemos los datos básicos
      }
      
      setAuthToken(token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error de login con Google:', error);
      throw error;
    }
  }

  const logout = (): void => {
    Cookies.remove(TOKEN_COOKIE_NAME);

    setUser(null);
    setAuthToken(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      authToken, 
      loginWithGoogle, 
      updateUserProfileCompletion, 
      isProfileCompleted: user?.isProfileCompleted ?? false 
    }}>
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