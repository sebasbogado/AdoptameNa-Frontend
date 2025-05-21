import { AuthResponse, LoginCredentials, User } from "@/types/auth";
import { AuthError } from "./errors/auth-error";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`;

interface ResetPasswordRequestParams {
  email: string;
}

interface ResetPasswordParams {
  newPassword: string;
}

export const login = async (
  credentials: LoginCredentials
): Promise<AuthResponse> => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, {
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
    const response = await axios.get(`${API_URL}/google-callback?${code}`, {
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

    const response = await axios.get(`${API_URL}/check-token`, {
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

export const requestPasswordReset = async (params: ResetPasswordRequestParams) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password-request?email=${params.email}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      throw new AuthError(
        "Error al solicitar restablecimiento de contraseña",
        status || 500
      );
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError(
      "Error al solicitar restablecimiento de contraseña",
      500
    );
  }
};

export const resetPassword = async (token: string, params: ResetPasswordParams) => {
  try {
    const response = await axios.post(
      `${API_URL}/reset-password?token=${token}`,
      params.newPassword,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      throw new AuthError("Error al restablecer la contraseña", status || 500);
    }
    if (error instanceof AuthError) {
      throw error;
    }
    throw new AuthError("Error al restablecer la contraseña", 500);
  }
};
