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
    throw new Error(
      error.message || "Error al obtener Categorias de Productos"
    );
  }
};

export const createProductCategory = async (
  token: string,
  productCategory: Omit<ProductCategory, "id">
): Promise<ProductCategory> => {
  try {
    const response = await axios.post(API_URL, productCategory, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al crear Categoria de Producto");
  }
};

export const updateProductCategory = async (
  token: string,
  productCategory: ProductCategory
): Promise<ProductCategory> => {
  try {
    const response = await axios.put(
      `${API_URL}/${productCategory.id}`,
      productCategory,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.message || "Error al actualizar Categoria de Producto"
    );
  }
};

export const deleteProductCategory = async (
  token: string,
  id: number
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar Categoria de Producto");
  }
};
