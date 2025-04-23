import { PaginatedResponse, productQueryParams,  } from "@/types/pagination";
import { CreateProduct, Product } from "@/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`;

import axios from "axios";

export const getProducts = async (
  queryParams: productQueryParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: queryParams.page || 0,
        size: queryParams.size || 10,
        sort: queryParams.sort || "id,desc",
        categoryId: queryParams.categoryId,
        condition: queryParams.condition,
        price: queryParams.price,
        minPrice: queryParams.minPrice,
        maxPrice: queryParams.maxPrice
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

export const createProduct = async (product: CreateProduct, authToken: string) => {
  try {
    const response = await axios.post(API_URL, product, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 400) {
      throw new Error("Error al crear el producto");
    }
    throw new Error(error.message || "Error al crear el producto");
  }
}