import { myPetsQueryParams, petQueryParams, PaginatedResponse } from "@/types/pagination";
import { Pet, UpdatePet } from "@/types/pet";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;

export const getPetsByUserId = async (queryParams: myPetsQueryParams)
  : Promise<PaginatedResponse<Pet>> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        page: queryParams.page || 0,
        size: queryParams.size || 10,
        sort: queryParams.sort || "id,desc",
        userId: queryParams.userId,
        animalId: queryParams.animalId,
        age: queryParams.age,
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
  queryParams?: petQueryParams
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

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== undefined && val !== null && val !== "") {
          searchParams.append(key, String(val));
        }
      });
    } else if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

export const getPetsDashboard = async (
  queryParams?: Record<string, any>
): Promise<PaginatedResponse<Pet>> => {
  try {
    const queryString = queryParams ? buildQueryString(queryParams) : "";
    const url = `${API_URL}${queryString && `?${queryString}`}`;
    const response = await axios.get(url, {
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

export const getPetSMissing = async (
  queryParams?: Record<string, any>): Promise<PaginatedResponse<Pet>> => {
  try {
    const queryString = queryParams ? buildQueryString(queryParams) : "";
    const url = `${API_URL}${queryString && `?${queryString}`}`;
    const response = await axios.get(url, {
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
}