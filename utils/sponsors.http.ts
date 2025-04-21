// utils/sponsor.http.ts

import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/sponsors`;

/**
 * Obtiene las imágenes de los sponsors por sus IDs.
 * @param ids Array de IDs de las imágenes a obtener.
 * @returns Array de objetos con id y url de cada imagen.
 */
export const getSponsors = async () => {
  let page = 0;
  let allSponsors: any[] = [];
  let isLastPage = false;
  try {
    while (!isLastPage) {
      const response = await axios.get(`${API_URL}`, {
        params: { page},
      });

      const { data, pagination } = response.data;

      allSponsors = allSponsors.concat(data);
      isLastPage = pagination.last;
      page++;
    }

    return allSponsors;
  } catch (error: any) {
    console.error('Error al obtener los sponsors:', error);
    throw new Error(
      error.response?.data?.message || 'Error al obtener los sponsors'
    );
  }
};
