import { PaginatedResponse } from "@/types/pagination";
import { Sponsor } from "@/types/sponsor";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/sponsors`;

export const getActiveSponsors = async (): Promise<
  PaginatedResponse<Sponsor>
> => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener patrocinadores activos");
  }
};

export const getAllSponsors = async (
  token: string,
  page: number = 0,
  size: number = 10
): Promise<PaginatedResponse<Sponsor>> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size,
      },
    });
    return response.data;
  } catch (error: any) {
    // Mejorar el manejo de errores específicos si es necesario
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("No autorizado para obtener la lista de sponsors.");
    }
    throw new Error(error.response?.data?.message || error.message || "Error al obtener la lista de sponsors");
  }
};

export const createSponsor = async (
  token: string,
  sponsorData: {
    reason: string;
    contact: string;
    logoId: number;
    bannerId?: number; 
  }
) => {
  try {
    const response = await axios.post(`${API_URL}`, sponsorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al crear patrocinador");
  }
};

export const updateSponsorStatus = async (
  token: string,
  sponsorId: number,
  isActive: boolean
): Promise<Sponsor> => {
  try {
    // Asumiendo un endpoint PATCH para actualizar, ajustar si es PUT u otro
    const response = await axios.patch(
      `${API_URL}/${sponsorId}`,
      { isActive }, // Solo enviamos el campo a actualizar
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Devuelve el sponsor actualizado
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 401) {
            throw new Error("No autorizado para actualizar el sponsor.");
        }
        if (status === 404) {
            throw new Error("Sponsor no encontrado.");
        }
        throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error("Error inesperado al actualizar el sponsor");
  }
};

export const deleteSponsor = async (
  token: string,
  sponsorId: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${sponsorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    // No devuelve contenido en éxito (204 No Content usualmente)
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 401) {
            throw new Error("No autorizado para eliminar el sponsor.");
        }
        if (status === 404) {
            throw new Error("Sponsor no encontrado.");
        }
        throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error("Error inesperado al eliminar el sponsor");
  }
};
