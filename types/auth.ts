export interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  isProfileCompleted: boolean;
  location?: {
    lat: number | null;
    lon: number | null;
    neighborhoodId?: string | null;
    districtId?: string | null;
    departmentId?: string | null;
    neighborhoodName?: string | null;
    districtName?: string | null;
    departmentName?: string | null;
  };
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  authToken: string | null;
  isProfileCompleted: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  updateUserProfileCompletion: (isCompleted: boolean) => void;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  loginWithGoogle: (code: string) => Promise<void>;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type UserResponse = {
  creationDate: string;
  email: string;
  id: number;
  isVerified: boolean;
  role: string;
  name?: string;
  unreadMessagesCount: number;
  online: boolean;
};

//NO PONER ESTOS CON NINGUNA MAYUS O MUERE
export enum USER_ROLE {
  ADMIN = 'admin',
  USER = 'user',
  ORGANIZATION = 'organization',
}