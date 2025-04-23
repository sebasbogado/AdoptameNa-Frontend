import { PaginatedResponse, tagQueryParams } from "@/types/pagination";
import { Tags } from "@/types/tags";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/tags`;

export const getTagsByPostType = async (
  queryParams: tagQueryParams): Promise<PaginatedResponse<Tags>> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: queryParams.page || 0,
        size: queryParams.size || 10,
        sort: queryParams.sort || "id,desc",
        postTypeIds: queryParams.postTypeIds,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Tags");
  }
};

function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();

  for (const key in params) {
    const value = params[key];

    if (Array.isArray(value)) {
      value.forEach((val) => {
        if (val !== undefined && val !== null && val !== "") {
          searchParams.append(key, String(val));
        }
      });
    } else if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  return searchParams.toString();
}

export const getTags = async (
  queryParams?: Record<string, any>
): Promise<PaginatedResponse<Tags>> => {
  try {
    const queryString = queryParams ? buildQueryString(queryParams) : "";
    const url = `${API_URL}${queryString && `?${queryString}`}`;
    const response = await axios.get(url, {
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