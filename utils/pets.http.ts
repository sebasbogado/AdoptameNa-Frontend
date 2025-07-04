import { myPetsQueryParams, petQueryParams, PaginatedResponse, buildQueryParams } from "@/types/pagination";
import { CreatePet, Pet, UpdatePet } from "@/types/pet";

import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;

export const getPetsByUserId = async (queryParams: myPetsQueryParams)
  : Promise<PaginatedResponse<Pet>> => {

  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: params,
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export const postPets = async (params: CreatePet, token: string) => {
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
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export const getPets = async (
  queryParams?: petQueryParams
): Promise<PaginatedResponse<Pet>> => {
  try {
    const params =  buildQueryParams(queryParams);
    const response = await axios.get(API_URL, {
      params: params,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export async function sharePet(id: string, token: string) {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/share`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al compartir Pet");
  }
}

export const getPetsDashboard = async (
  queryParams?: petQueryParams
): Promise<PaginatedResponse<Pet>> => {
  try {
    const queryString = buildQueryParams(queryParams);
    const response = await axios.get(API_URL, {
      params: queryString,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
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

export const getPetSMissing = async (
  queryParams?: Record<string, any>): Promise<PaginatedResponse<Pet>> => {
  try {
    const params = queryParams ? buildQueryParams(queryParams) : {};
    const response = await axios.get(API_URL, {
      params,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export async function deletePet(id: string, token: string) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
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
    throw new Error(error.message || "Error al eliminar publicación de mascota");
  }
}

export const getDeletedPets = async (
  token: string,
  queryParams?: myPetsQueryParams
): Promise<PaginatedResponse<Pet>> => {
  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(`${API_URL}/deleted`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
      
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets");
  }
};

export const getBannedPets = async (
  token: string,
  queryParams?: myPetsQueryParams
): Promise<PaginatedResponse<Pet>> => {
  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(`${API_URL}/banned`, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    if (error.message === "Network Error") {
      throw new Error("Error de conexión, verificá tu conexión a internet.");
    }
    throw new Error(error.message || "Error al obtener Pets baneadas");
  }
};

export const unbanPet = async (
  id: string | number,
  token: string
): Promise<any> => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/unban`, null, {
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
    throw new Error(error.message || "Error al desbanear la mascota");
  }
};