// utils/sponsor.http.ts

import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/media`;

/**
 * Obtiene las imágenes de los sponsors por sus IDs.
 * @param ids Array de IDs de las imágenes a obtener.
 * @returns Array de objetos con id y url de cada imagen.
 */
export const getSponsors = async (ids: number[]) => {
  try {
    const responses = await Promise.all(
      ids.map((id) => axios.get(`${API_URL}/${id}`))
    );

    return responses.map((res) => ({
      id: res.data.id,
      url: res.data.url,
    }));
  } catch (error: any) {
    console.error('Error al obtener imágenes de sponsors:', error);
    throw new Error(
      error.response?.data?.message || 'Error al obtener imágenes de sponsors'
    );
  }
};
