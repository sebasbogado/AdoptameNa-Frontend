import { PaginatedResponse } from "@/types/pagination";
import { Sponsor, ActiveSponsor, CreateSponsorRequest, SponsorStatus } from "@/types/sponsor";
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
  userId?: number,
  status?: string
): Promise<PaginatedResponse<Sponsor>> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        size,
        ...(userId && { userId }),
        ...(status && { status })
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
  sponsor: Sponsor,
  status: SponsorStatus
): Promise<Sponsor> => {
  try {
    const updatedSponsor = { ...sponsor, status };
    const response = await axios.put(
      `${API_URL}/${sponsor.id}`,
      updatedSponsor,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
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
    return response.data;
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
        throw new Error(`Error ${status} al aprobar: ${message}`);
    }
    throw new Error("Error inesperado al aprobar el sponsor");
  }
};

export const rejectSponsorRequest = async (
  token: string,
  sponsorId: number
): Promise<Sponsor> => {
  if (!token) {
    throw new Error("Token de autenticación requerido para rechazar.");
  }
  try {
    const response = await axios.put(
      `${API_URL}/reject/${sponsorId}`,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        if (status === 401) {
            throw new Error("No autorizado para rechazar el sponsor.");
        }
        if (status === 404) {
            throw new Error("Solicitud de sponsor no encontrada.");
        }
        throw new Error(`Error ${status} al rechazar: ${message}`);
    }
    throw new Error("Error inesperado al rechazar el sponsor");
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

export const getSponsorById = async (
  token: string,
  sponsorId: number
): Promise<Sponsor> => {
  try {
    const response = await axios.get(`${API_URL}/${sponsorId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error('No autorizado para ver el sponsor.');
      }
      if (status === 404) {
        throw new Error('Sponsor no encontrado.');
      }
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Error inesperado al obtener el sponsor');
  }
};

export const updateSponsor = async (
  token: string,
  sponsorId: number,
  data: {
    reason: string;
    contact: string;
    logoId: number;
    bannerId?: number;
  }
): Promise<Sponsor> => {
  try {
    const response = await axios.put(
      `${API_URL}/${sponsorId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        throw new Error('No autorizado para editar el sponsor.');
      }
      if (status === 404) {
        throw new Error('Sponsor no encontrado.');
      }
      throw new Error(error.response?.data?.message || error.message);
    }
    throw new Error('Error inesperado al editar el sponsor');
  }
};
