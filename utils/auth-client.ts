import { AuthResponse, LoginCredentials } from "@/types/auth";
import { AuthError } from "./errors/AuthError";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

class AuthClient {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new AuthError("Credenciales incorrectas", 401);
        } else if (response.status === 403) {
          throw new AuthError("Email no verificado", 403);
        }

        throw new AuthError("Error de autenticación", response.status);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof AuthError) {
        throw error;
      }
      throw new AuthError("Error de autenticación", 500);
    }
  }
}

const authClient = new AuthClient();
export default authClient;
