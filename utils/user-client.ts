import { UserResponse } from "@/types/auth";
import { PaginatedResponse, userQueryParams } from "@/types/pagination";
import axios from "axios";
const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/users`;

export const getUser = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      throw new Error("Usuario no encontrado");
    }

    if (!response.ok) {
      throw new Error("Error al obtener el usuario");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el usuario");
  }
};

export const getUsers = async (
  authToken: string,
  queryParams?: userQueryParams
): Promise<PaginatedResponse<UserResponse>> => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener los usuarios");
  }
};

export const deleteUser = async (token: string, id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar el usuario");
  }
};
