import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/statistics`;

export const getStatisticsOverview = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/overview`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("estadísticas no encontradas");
      }
    }
    throw new Error(error.message || "Error al obtener las estadísticas");
  }
};

export const getStatisticsContent = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/content`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("estadísticas no encontradas");
      }
    }
    throw new Error(error.message || "Error al obtener las estadísticas");
  }
};
