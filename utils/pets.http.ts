import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/pets`;

export const getPets = async (id: string) => {
  try {
    const response = await axios.get(`${API_URL}/${id}/user`, {
      headers: {
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

export const getPetsList = async (page = 0, size = 25) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { page, size },
      headers: {
        Accept: "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener la lista de Pets");
  }
};

export const getPetsAdoption = async (page = 0, size = 25) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { page, size },
      headers: {
        Accept: "application/json",
      },
    });

    // Filtrar solo las mascotas con petStatusId = 16
    const filteredPets = response.data.filter((pet: any) => pet.petStatusId === 16);

    return filteredPets;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener la lista de Pets");
  }
};