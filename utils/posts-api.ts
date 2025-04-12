import { Post } from "@/types/post";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

// Crear una instancia de Axios
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar el token en cada petición
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token"); // Obtener el token desde las cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Función para obtener los posts
export const getPosts = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/posts");
    return response.data.data;
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    return [];
  }
};
