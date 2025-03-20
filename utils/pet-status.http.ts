import axios from "axios";

const API_URL_STATUS = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pet-status`;

export const getPetStatusList = async (page = 0, size = 25) => {
  try {
    const response = await axios.get(API_URL_STATUS, {
      params: { page, size },
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener el estado de las mascotas");
  }
};
