import axios from "axios";
import { Banner, PublicBanner } from "@/types/banner";
import { PaginatedResponse, bannerQueryParams } from "@/types/pagination";
import { BannerForm } from "@/validations/banner-schema";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/banners`;

export const getPublicBanners = async (): Promise<PublicBanner[]> => {
  try {
    const response = await axios.get(`${API_URL}/public`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener banners públicos");
  }
};

export const getBannerById = async (
  id: string,
  token: string
): Promise<Banner> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener el banner");
  }
};

export const getAllBanners = async (
  queryParams?: bannerQueryParams,
  token?: string
): Promise<PaginatedResponse<Banner>> => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: queryParams,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al obtener la lista de banners");
  }
};

export const createBanner = async (
  data: BannerForm,
  token: string
): Promise<Banner> => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al crear el banner");
  }
};

export const updateBanner = async (
  id: number,
  data: BannerForm,
  token: string
): Promise<Banner> => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al actualizar el banner");
  }
};

export const deleteBanner = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar el banner");
  }
};

export const activateBanner = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/${id}/activate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.message || "Error al activar el banner");
  }
};

export const deactivateBanner = async (
  id: number,
  token: string
): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/${id}/deactivate`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: any) {
    throw new Error(error.message || "Error al desactivar el banner");
  }
};
