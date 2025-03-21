import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/breed`;

export const getBreeds = async (page: number = 0, size: number = 25) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`, {
      headers: {
        Accept: "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching breeds:", error);
    throw error;
  }
};

export const createBreed = async (
  token: string,
  name: string,
  animalId: number
) => {
  try {
    const response = await axios.post(
      API_URL,
      { name, animalId },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating breed:", error);
    throw error;
  }
};

// 🔹 Función para actualizar una raza
export const updateBreed = async (
  token: string,
  id: number,
  name: string,
  animalId: number
) => {
  try {
    const response = await axios.put(
      `${API_URL}/${id}`,
      { name, animalId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar la raza:", error);
    throw error;
  }
};

export const deleteBreed = async (token: string, id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(`Raza con ID ${id} eliminada correctamente.`);
  } catch (error) {
    console.error("Error al eliminar la raza:", error);
    throw error;
  }
};
