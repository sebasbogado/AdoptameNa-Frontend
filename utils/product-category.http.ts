import { PaginatedResponse, queryParams } from "@/types/pagination";
import { ProductCategory } from "@/types/product-category";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/product-categories`;

export const getProductCategories = async (
  queryParams?: queryParams
): Promise<PaginatedResponse<ProductCategory>> => {
  try {
    const response = await axios.get(API_URL, {
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
    throw new Error(error.message || "Error al obtener Categorias de Productos");
  }
};