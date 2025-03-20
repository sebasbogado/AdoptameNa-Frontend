import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/animals`;

interface Animal {
  id: number;
  name: string;
}

export const getAnimals = async (page = 0, size = 25): Promise<Animal[]> => {
  try {
    const response = await axios.get<Animal[]>(API_URL, {
      params: { page, size },
      headers: {
        Accept: "application/json",
      },
    });
    
    return response.data;
  } catch (error) {
    throw new Error("Error al obtener la lista de animales");
  }
};
