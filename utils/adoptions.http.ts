import { AdoptionRequest } from "@/types/adoption-request";
import { AdoptionResponse } from "@/types/adoption-response";
import { adoptionsResponseQueryParams, PaginatedResponse, queryParams } from "@/types/pagination";
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

export const getReceivedAdoptionsRequest = async ( token: string,
  queryParams?: adoptionsResponseQueryParams
): Promise<PaginatedResponse<AdoptionResponse>> => {
  try {
    const response = await axios.get(`${API_URL}/my-requests`, {
      params: {
        page: queryParams?.page || 0,
        size: queryParams?.size || 10,
      },
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
    throw new Error(error.message || "Error al obtener Solicitudes de Adopción.");
  }
};

export const getSentAdoptionRequests = async (token: string,
  queryParams?:adoptionsResponseQueryParams
): Promise<PaginatedResponse<AdoptionResponse>> => {
  try{
    const response = await axios.get(`${API_URL}`, {
      params: {
        page: queryParams?.page || 0,
        size: queryParams?.size || 10,
        sort: queryParams?.sort,
        userId: queryParams?.userId,
      },
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
    throw new Error(error.message || "Error al obtener Solicitudes de Adopción.");
  }
};

export const acceptAdoptionRequest = async (id: number, token: string): Promise<void> => {
  await axios.post(`${API_URL}/${id}/accept`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

export const rejectAdoptionRequest = async (id: number, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};
