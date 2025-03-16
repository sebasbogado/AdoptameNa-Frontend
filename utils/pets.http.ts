import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;

export const getPets = async (id: string, token?: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/user`, {
      headers: {
        Authorization:  `Bearer ${token}`,
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

export const postPets = async (params: any, token?: string) => {
  try {
    const response = await axios.post(`${API_URL}`,params, {
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
