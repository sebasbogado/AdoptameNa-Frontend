import { buildQueryParams, PaginatedResponse, productQueryParams, } from "@/types/pagination";
import { CreateProduct, Product, UpdateProduct } from "@/types/product";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/products`;

import axios from "axios";

export const getProducts = async (
  queryParams?: productQueryParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(API_URL, {
      params: params,
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

export const getProduct = async (id: string): Promise<Product> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error(`Producto con ID ${id} no encontrado`);
    }
    throw new Error(error.message || "Error al obtener producto");
  }
}

export async function updateProduct(
  id: string,
  productData: UpdateProduct,
  token: string
) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
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
    throw new Error(error.message || "Error al editar Producto");
  }
}

export async function deleteProduct(id: string, token: string) {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
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
    throw new Error(error.message || "Error al eliminar Producto");
  }
}

export const getDeletedProducts = async (
  token: string,
  queryParams?: productQueryParams
): Promise<PaginatedResponse<Product>> => {
  try {
    const params = buildQueryParams(queryParams);
    const response = await axios.get(`${API_URL}/deleted`, {
      params: params,
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
    throw new Error(error.message || "Error al obtener Productos");
  }
};