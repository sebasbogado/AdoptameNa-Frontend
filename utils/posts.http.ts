import { Post } from "@/types/post";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts`;

export const getPosts = async (queryParams?: any) => {
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
    throw new Error(error.message || "Error al obtener Posts");
  }
};

export const getPost = async (id: string): Promise<Post> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener Post");
  }
};
export const getPostReports = async (queryParams?: any)=>{
  try{
    const response = await axios.get(`${API_URL}/reported`, {
      params: queryParams,
      headers: {
        "Content-Type": "application/json",
      },
      });
      return response.data;
      }catch(error: any){
        if(error.response && error.response.status === 404){
          throw new Error("No encontrada");
        }
        throw new Error(error.message || "Error al obtener Posts reportados");
  }
}