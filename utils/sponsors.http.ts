// utils/sponsor.http.ts

import axios from 'axios';
import { PaginatedResponse, postQueryParams, queryParams } from "@/types/pagination";
import { Sponsor } from '@/types/sponsor';
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/sponsors`;

export const getSponsors = async (queryParams: queryParams)
  : Promise<PaginatedResponse<Sponsor>> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Sponsors");
  }
};

