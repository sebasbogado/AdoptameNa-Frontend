import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/postTypes`;

export const getPostType = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener postTypes");
  }
};
