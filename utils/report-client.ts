import { UpdateUserProfile } from "@/types/user-profile";
import axios from "axios";
import { reportQueryParams } from "@/types/pagination";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/postReports`;
const NEW_API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/reports`;
const API_URL_BAN_POST = `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/`;
const API_URL_BAN_PET = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;
const API_URL_BAN_PRODUCT = `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`;
const API_URL_BAN_COMMENT = `${process.env.NEXT_PUBLIC_BASE_API_URL}/comments`;

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
export const getReports = async (queryParams?: reportQueryParams) => {
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
    const response = await axios.delete(`${NEW_API_URL}/${id}`, {
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


export const deleteReportsByPostId = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${NEW_API_URL}/byPostId/${id}`, {
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

export const deleteReportsByPetId = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${NEW_API_URL}/byPetId/${id}`, {
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

export const deleteReportsByProductId = async (id: number, token: string) => {
  try {
    const response = await axios.delete(`${NEW_API_URL}/byProductId/${id}`, {
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

//obtener reportes de un post/pet por id
export const getReportsById = async (token: string, queryParams?: reportQueryParams) => {
  try {
    const response = await axios.get(`${NEW_API_URL}`, {
      params: queryParams,
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
    throw new Error(error.message || "Error al obtener Posts reportados");
  }
}

export const banPost = async (id: number, token: string) => {
  try {
    await axios.patch(`${API_URL_BAN_POST}${id}/ban`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al bloquear post")
  }
}

export const getReportedPosts = async (token: string, queryParams?: reportQueryParams ) => {
  try{
    const response = await axios.get(`${NEW_API_URL}/reported-posts`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }catch(error:any){
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Posts reportados");
  }
}

export const getReportedPets = async (token: string, queryParams?: reportQueryParams) => {
  try {
    const response = await axios.get(`${NEW_API_URL}/reported-pets`, {
      params: queryParams,
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
    throw new Error(error.message || "Error al obtener pets reportados");
  }
}

export const banPet = async (id: number, token: string) => {
  try {
    await axios.patch(`${API_URL_BAN_PET}/${id}/ban`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al bloquear post")
  }
}

export const getReportedProducts = async (token: string, queryParams?: reportQueryParams) => {
  try {
    const response = await axios.get(`${NEW_API_URL}/reported-products`, {
      params: queryParams,
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
    throw new Error(error.message || "Error al obtener pets reportados");
  }
}

export const banProduct = async (id: number, token: string) => {
  try {
    await axios.patch(`${API_URL_BAN_PRODUCT}/${id}/ban`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al bloquear post")
  }
}

export const getReportedComments = async (token: string, queryParams?: reportQueryParams) => {
  try {
    const response = await axios.get(`${NEW_API_URL}/reported-comments`, {
      params: queryParams,
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
    throw new Error(error.message || "Error al obtener pets reportados");
  }
}

export const banComment = async (id: number, token: string) => {
  try {
    await axios.patch(`${API_URL_BAN_COMMENT}/${id}/ban`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al bloquear post")
  }
}