import axios from "axios";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export const getUsers = async (queryParams?: any) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los usuarios");
  }
}

export const deleteUser = async (toke: string, id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${toke}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }
  catch (error: any) {
    throw new Error(error.message || "Error al eliminar el usuario");
  }
}