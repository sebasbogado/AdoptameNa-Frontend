import {
  PaginatedResponse,
  profileQueryParams,
  queryParams,
} from "@/types/pagination";
import { UpdateUserProfile, UserProfile } from "@/types/user-profile";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export const getUserProfile = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}/profile`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error("perfil no encontrado");
    }

    if (!response.ok) {
      throw new Error("Error al obtener el perfil");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el perfil");
  }
};

export const updateUserProfile = async (
  id: string,
  updatedProfile: UpdateUserProfile | null,
  token: string
) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/${id}/profile`;

    const response = await axios.put(API_URL, updatedProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error al actualizar el perfil"
      );
    } else {
      throw new Error(error.message || "Error al actualizar el perfil");
    }
  }
};

export const getUserProfiles = async (
  token: string,
  queryParams?: queryParams
) => {
  try {
    const response = await axios.get(`${API_URL}/profiles`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los perfiles");
  }
};

export const getAllFullUserProfile = async (
  token: string,
  queryParams?: profileQueryParams
): Promise<PaginatedResponse<UserProfile>> => {
  try {
    const response = await axios.get(`${API_URL}/fullUser`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los perfiles");
  }
};

export const getFullUser = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/fullUser`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el perfil");
  }
}

