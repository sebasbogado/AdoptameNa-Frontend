import { UpdateUserProfile } from "@/types/user-profile";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/postReports`;
const NEW_API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/reports`;

export const getReportById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error("reporte no encontrado");
    }

    if (!response.ok) {
      throw new Error("Error al obtener el reporte");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el reporte");
  }
};
//para traer todos los posts reportados
export const getReports = async (queryParams?: any) => {
  try {
    const response = await axios.get(`${NEW_API_URL}/reported-posts`, {
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
    throw new Error(error.message || "Error al obtener Posts reportados");
  }
}

export const updateReport = async (
  id: string,
  updatedProfile: UpdateUserProfile | null, // Usamos la interfaz para el reporte
  token: string
) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedProfile, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error al actualizar el reporte');
    } else {
      throw new Error(error.message || 'Error al actualizar el reporte');
    }
  }
};



export const deleteReport = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el reporte"
    );
  }
};


export const deleteReportsByPost = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${API_URL}/byPostId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al eliminar el reporte"
    );
  }
};

//obtener motivos de reporte de un post
export const getPostReportsById = async (id: string) => {
  try {
    const response = await axios.get(`${NEW_API_URL}`, {
      params: { idPost: id },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Posts reportados");
  }
}