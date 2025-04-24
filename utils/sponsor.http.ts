import { PaginatedResponse } from "@/types/pagination";
import { Sponsor, ActiveSponsor, CreateSponsorRequest } from "@/types/sponsor";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/sponsors`;

export const getActiveSponsors = async (): Promise<
  PaginatedResponse<ActiveSponsor>
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
  size: number = 10,
  isActive?: boolean
): Promise<PaginatedResponse<Sponsor>> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size,
        ...(isActive !== undefined && { isActive })
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      throw new Error("No autorizado para obtener la lista de sponsors.");
    }
    throw new Error(error.response?.data?.message || error.message || "Error al obtener la lista de sponsors");
  }
};

export const createSponsor = async (
  token: string,
  sponsorData: CreateSponsorRequest
): Promise<Sponsor> => {
  try {
    const response = await axios.post(`${API_URL}`, sponsorData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      if (status === 401) {
        throw new Error("No autorizado para crear el sponsor.");
      }
      if (status === 400) {
        throw new Error("Datos de sponsor inválidos.");
      }
      throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error(error.message || "Error al crear patrocinador");
  }
};

export const updateSponsorStatus = async (
  token: string,
  sponsorId: number,
  isActive: boolean
): Promise<Sponsor> => {
  try {

    const response = await axios.patch(
      `${API_URL}/${sponsorId}`,
      { isActive }, 
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

// Nueva función para aceptar una solicitud de sponsor
export const approveSponsorRequest = async (
  token: string,
  sponsorId: number
): Promise<Sponsor> => { 
  if (!token) {
    throw new Error("Token de autenticación requerido para aprobar.");
  }
  try {
    const response = await axios.put(
      `${API_URL}/accept/${sponsorId}`,
      null, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );
    console.log(response.data);
    return response.data; // Devuelve el sponsor actualizado/aprobado
    
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 401) {
            throw new Error("No autorizado para aprobar el sponsor.");
        }
        if (status === 404) {
            throw new Error("Solicitud de sponsor no encontrada.");
        }
        
        if (status === 500) {
             console.error("Backend error during sponsor approval:", error.response?.data);
             throw new Error("Error interno del servidor al aprobar la solicitud.");
        }
        throw new Error(`Error ${status} al aprobar: ${message}`);
    }
    throw new Error("Error inesperado al aprobar el sponsor");
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
