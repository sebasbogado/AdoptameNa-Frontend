import { PaginatedResponse, tagQueryParams } from "@/types/pagination";
import { Tags } from "@/types/tags";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/tags`;

export const getTagsByPostType = async(
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