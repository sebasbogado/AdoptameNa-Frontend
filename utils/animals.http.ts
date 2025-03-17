import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/animals`;

export const getAnimals = async (page: number = 0, size: number = 25) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};
