export interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: (code: string) => Promise<void>;
}

export interface AuthResponse {
  token: string;
  user: User;
}
