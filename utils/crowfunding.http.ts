import { Crowdfunding } from "@/types/crowfunding-type";
import { buildQueryParams, crowdfundingQueryParams, PaginatedResponse } from "@/types/pagination";
import { SponsorStatus } from "@/types/sponsor";
import axios from "axios";
import build from "next/dist/build";


const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/crowdfunding`;

export const getCrowdfundings = async (
 queryParams?: crowdfundingQueryParams): Promise<PaginatedResponse<Crowdfunding>> => {
    try {
        const params = buildQueryParams(queryParams);
        const response = await axios.get(API_URL, {
            params: params,
            headers: {
                Accept: "application/json",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching crowdfundings:", error);
        throw error;
    }
};

export const getCrowdfundingById = async ( id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`, {
            headers: {
                Accept: "application/json",
                
            },
        });

        return response.data;
    } catch (error) {
        console.error("Error fetching crowdfunding by ID:", error);
        throw error;
    }
};



export const getMyCrowdfundingRequests = async (
    token: string,
  queryParams?: crowdfundingQueryParams
): Promise<PaginatedResponse<Crowdfunding>> => {
  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(`${API_URL}/my-requests`, {
      params,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching my crowdfunding requests:", error);
    throw error;
  }
};
export const createCrowdfunding = async (
    token: string,
    title: string,
    description: string,
    durationDays: number,
    goal: number
) => {
    try {
        const response = await axios.post(
            API_URL,
            { title, description, durationDays, goal },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error creating crowdfunding:", error);
        throw error;
    }
};

export const updateCrowdfunding = async (
    token: string,
    id: number,
    title: string,
    description: string,
    durationDays: number,
    goal: number
) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}`,
            { title, description, durationDays, goal },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating crowdfunding:", error);
        throw error;
    }
};

export const deleteCrowdfunding = async (token: string, id: number): Promise<void> => {
    try {
        await axios.delete(`${API_URL}/${id}`, {
            headers: {
                Accept: "*/*",
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(`Crowdfunding con ID ${id} eliminado correctamente.`);
    } catch (error) {
        console.error("Error al eliminar el crowdfunding:", error);
        throw error;
    }
};

export const updateCrowdfundingStatus = async (
    token: string,
    id: number,
    status: "NONE" | "ACTIVE" | "PENDING" | "CLOSED" | "REJECTED" 
) => {
    try {
        const response = await axios.patch(
            `${API_URL}/${id}/update-status?status=${status}`,
            {}, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error actualizando estado del crowdfunding:", error);
        throw error;
    }
};



export const donateToCrowdfunding = async (
    token: string,
    id: number,
    amount: number
) => {
    try {
        const response = await axios.put(
            `${API_URL}/${id}/donate?amount=${amount}`,
            {}, // cuerpo vacío
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al donar al crowdfunding:", error);
        throw error;
    }
};
