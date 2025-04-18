import { PaginatedResponse, queryParams } from "@/types/pagination";
import { Product } from "@/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`;

import axios from "axios";

export const getProducts = async ( categoryId?: number, condition?: string, price?: number,  page?: number, size?: number
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        categoryId,
        condition,
        price,
        page,
        size,
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
    throw new Error(error.message || "Error al obtener Productos");
  }
};