import { PaginatedResponse, queryParams } from "@/types/pagination";
import { Pet, UpdatePet } from "@/types/pet";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;

export const getPetsByUserId = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/user`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export const postPets = async (params: any, token?: string) => {
  try {
    const response = await axios.post(`${API_URL}`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al cargar el animal");
  }
};

export const getPet = async (id: string): Promise<Pet> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export const getPets = async (
  queryParams?: queryParams
): Promise<PaginatedResponse<Pet>> => {
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
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export async function updatePet(id: string, petData: UpdatePet, token: string) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, petData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("Mascota no encontrada");
    }
    throw new Error(error.message || "Error al actualizar mascota");
  }
}