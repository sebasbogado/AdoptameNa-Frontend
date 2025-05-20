'use client';
import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User, AuthContextType, LoginCredentials } from '../types/auth';
import * as authServices from '@/utils/auth.http';
import { getFullUser } from '@/utils/user-profile.http';
import Cookies from 'js-cookie';
import { UserProfile } from '@/types/user-profile';
import { soundService } from '@/utils/sound-service';

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
  
  const createLocationFromUserData = (userData: UserProfile) => ({
    lat: userData.latitude || null,
    lon: userData.longitude || null,
    neighborhoodId: userData.neighborhoodId || null,
    districtId: userData.districtId || null,
    departmentId: userData.departmentId || null,
    neighborhoodName: userData.neighborhoodName || null,
    districtName: userData.districtName || null,
    departmentName: userData.departmentName || null,
  });

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

      try {
        const fullUserData = await getFullUser(userData.id.toString());
        const enhancedUserData = {
          ...userData,
          location: createLocationFromUserData(fullUserData),
        };
        
        setUser(enhancedUserData);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(userData);
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

    if (token) {      // Cargar sonidos del servidor
      soundService.setAuthToken(token)
        .then(() => fetchUserData(token))
        .catch((err: unknown) => {
          console.error("Error al cargar sonidos:", err);
          fetchUserData(token);
        });
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
      
      // Cargar los sonidos desde el servidor
      await soundService.setAuthToken(token);

      try {
        const fullUserData = await getFullUser(user.id.toString());
        const enhancedUser = {
          ...user,
          location: createLocationFromUserData(fullUserData),
        };
        setUser(enhancedUser);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(user);
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
      const { token, user } = await authServices.loginWithGoogle(code);      if (!token || !user) throw new Error('Error de autenticación con Google');

      Cookies.set(TOKEN_COOKIE_NAME, token, { expires: COOKIE_EXPIRATION_DAYS });
      
      // Cargar los sonidos desde el servidor
      await soundService.setAuthToken(token);

      try {
        const fullUserData = await getFullUser(user.id.toString());
        const enhancedUser = {
          ...user,
          location: createLocationFromUserData(fullUserData),
        };
        setUser(enhancedUser);
      } catch (error) {
        console.error("Error obteniendo datos completos del usuario:", error);
        setUser(user); 
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