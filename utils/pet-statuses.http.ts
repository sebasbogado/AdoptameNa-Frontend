import axios from "axios";
import { PetStatus } from "@/types/pet-status";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pet-status`;

export const getPetStatuses = async (queryParams?: any) => {
  try {
    const response = await axios.get(API_URL, {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(
      error.message || "Error al obtener Posts de estado de mascota"
    );
  }
};

export const createPetStatus = async (token: string, petStatus: PetStatus) => {
  try {
    const response = await axios.post(API_URL, petStatus, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al crear estado de mascota"
    );
  }
};

export const deletePetStatus = async (token: string, petStatusId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${petStatusId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el estado de mascota"
    );
  }
};
export const updatePetStatus = async (token: string, petStatus: PetStatus) => {
  try {
    const response = await axios.put(`${API_URL}/${petStatus.id}`, petStatus, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al editar el estado de mascota"
    );
  }
};
