import axios from "axios";
import { ReportPost } from "@/types/report";
import { reportQueryParams } from "@/types/pagination";
const API_URL= `${process.env.NEXT_PUBLIC_BASE_API_URL}/reports`;

export const createReport = async (token: string, reportData: ReportPost) => {
  try {
    const response = await axios.post(API_URL, reportData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear el reporte");
  }
}

export const getUserReports = async (token: string, queryParams?: reportQueryParams ) => {
  try {
    const response = await axios.get(`${API_URL}/my-reports`, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("mis reportes: ", response.data);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("Reportes no encontrados");
    }
    throw new Error(error.message || "Error al obtener mis reportes");
  }
}

