import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/media`;
export const getMedia = async (token: string) => {

    try {
        const response = await axios.get(`${API_URL}`, {
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error("No encontrada");
        }
        throw new Error(error.message || "Error al obtener las imagenes");
    }
};

export const postMedia = async (params: any, token: string) => {
    try {
        const response = await axios.post(`${API_URL}/upload`, params, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            maxBodyLength: Infinity,
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error("No encontrada");
        }
        throw new Error(error.message || "Error al subir la imagen");
    }
};

export const deleteMedia = async (id: number, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            maxBodyLength: Infinity,
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error("No encontrada");
        }
        throw new Error(error.message || "Error al eliminar la imagen");
    }
};

export async function deleteMediaByUrl(imageUrl: string, token: string) {
    try {
      const response = await axios.delete(`${API_URL}/ByUrl`, {
        params: {
          url: imageUrl, // pasamos la URL como query param
        },
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
      throw new Error(error.message || "Error al eliminar Post");
    }

    
  }
  export const getMediaById = async (id: number) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        throw new Error("Imagen no encontrada");
      }
      throw new Error(error.message || "Error al obtener la imagen");
    }
  };
  