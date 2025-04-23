import { UpdateUserProfile } from "@/types/user-profile";
import { CreateSponsorRequest } from "@/types/sponsor";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export const updateUserProfile = async (
  id: string,
  updatedProfile: UpdateUserProfile | null,
  token: string
) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/${id}/profile`;

    const response = await axios.put(API_URL, updatedProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al actualizar el perfil');
    } else {
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  }
};

export const getUserProfiles = async (queryParams?: any) => {
  try {
    const response = await axios.get(`${API_URL}/profiles`, {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los perfiles");
  }
}

export const createSponsorRequest = async (
  userId: string,
  token: string,
  requestData: CreateSponsorRequest
) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users/${userId}/sponsor-request`;

    const response = await axios.post(API_URL, requestData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al crear la solicitud de auspicio');
    } else {
      throw new Error(error.message || 'Error al crear la solicitud de auspicio');
    }
  }
};