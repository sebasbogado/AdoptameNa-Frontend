import axios from "axios";
import { ReportPost } from "@/types/report";
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