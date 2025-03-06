import axios from "axios";

const API_URL = "http://adoptamena-api.rodrigomaidana.com/posts";

export const getPosts = async (token?: string, queryParams?: any) => {
  try {
    const response = await axios.get(API_URL, {
      params: queryParams,
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
    throw new Error(error.message || "Error al obtener Posts");
  }
};