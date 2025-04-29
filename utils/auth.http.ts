import { AuthResponse, LoginCredentials, User } from "@/types/auth";
import { AuthError } from "./errors/auth-error";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new AuthError("Credenciales incorrectas", 401);
      } else if (status === 403) {
        throw new AuthError("Email no verificado", 403);
      }
      throw new AuthError("Error de autenticación", status || 500);
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error de autenticación", 500);
  }
};

export const loginWithGoogle = async (code: string): Promise<AuthResponse> => {
  try {
    const response = await axios.get(`${API_URL}/auth/google-callback?${code}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      throw new AuthError("Error de autenticación con Google", status || 500);
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error de autenticación con Google", 500);
  }
};
  
export const checkToken = async (token: string): Promise<User> => {
  try {
    if (!token) {
      throw new AuthError("Token no encontrado", 401);
    }

    const response = await axios.get(`${API_URL}/auth/check-token`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      throw new AuthError("Token inválido", status || 500);
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error al verificar el token", 500);
  }
};
