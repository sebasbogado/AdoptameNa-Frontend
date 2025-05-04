import { AdoptionRequest } from "@/types/adoption-request";
import axios from "axios";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/adoptions-requests`;

export const postAdoption = async (params: AdoptionRequest) => {
    try {
      const response = await axios.post(API_URL, params, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error al crear la solicitud de adopción."
    );
  }
};