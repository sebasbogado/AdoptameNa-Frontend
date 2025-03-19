import axios from "axios";
import { Animal } from "@/types/animal";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/animals`;

export const getAnimals = async ( token:string, queryParams?: any) => {
  try {
    const response = await axios.get(API_URL, {
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
    throw new Error(error.message || "Error al obtener animales");
  }
}

export const createAnimal = async (token: string, animalData: { name: string }) => {
  try {
    const response = await axios.post(API_URL, animalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear el animal");
  }
};

export const deleteAnimal = async (token: string, animalId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${animalId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al eliminar el animal");
  }
}
export const updateAnimal = async (token: string, animalData: Animal) => {
  try {
    const response = await axios.put(`${API_URL}/${animalData.id}`, animalData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al editar el animal");
  }
};
