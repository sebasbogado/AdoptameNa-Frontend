import { PaginatedResponse } from "@/types/pagination";
import { Sponsor } from "@/types/sponsor";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/sponsors`;

export const getActiveSponsors = async (): Promise<
  PaginatedResponse<Sponsor>
> => {
  try {
    const response = await axios.get(`${API_URL}/active`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener patrocinadores activos");
  }
};
