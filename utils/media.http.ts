import axios from "axios";
import { Media } from "@/types/media";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/media`;

export const getMedia = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener las imagenes");
  }
};

export const getMediaById = async (mediaId: number, token: string): Promise<Media> => {
  if (!token) {
    throw new Error("Token de autenticación requerido");
  }
  try {
    const response = await axios.get<Media>(
      `${API_URL}/${mediaId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      if (status === 404) {
        console.warn(`Media not found for ID: ${mediaId}`);
        throw new Error("No encontrado.");
      }
      if (status === 401) {
        throw new Error("No autorizado");
      }
      throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error("Error inesperado");
  }
};

export const postMedia = async (params: any, token: string) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, params, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      if (status === 404) {
        throw new Error("No encontrada");
      }
      throw new Error(`Error ${status}: ${message}`);
    }
    throw new Error("Error inesperado al subir la imagen");
  }
};

export const deleteMedia = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      maxBodyLength: Infinity,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al eliminar la imagen");
  }
};

export async function deleteMediaByUrl(imageUrl: string, token: string) {
  try {
    const response = await axios.delete(`${API_URL}/ByUrl`, {
      params: {
        url: imageUrl,
      },
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
    throw new Error(error.message || "Error al eliminar Post");
  }
}