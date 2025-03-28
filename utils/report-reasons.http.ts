import axios from "axios";
import { ReportReason } from "@/types/report-reason";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/reportReasons`;

export const getReportReasons = async (queryParams?:any) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Report Reasons");
  }
};

export const createReportReason = async (token:string, newReportReason: ReportReason) => {
  try {
    const response = await axios.post(API_URL, newReportReason, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al crear Report Reason");
  }
}

export const updateReportReason = async (token:string, updatedReportReason: ReportReason) => {
  try{
    const response = await axios.put(`${API_URL}/${updatedReportReason.id}`, updatedReportReason, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }catch(error: any){
    throw new Error(error.message || "Error al actualizar Report Reason");
  }
}

export const deleteReportReason = async (token:string, reportReasonId: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${reportReasonId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "Error al eliminar Report Reason");
  }
}