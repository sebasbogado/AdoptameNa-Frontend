import page from "@/app/(pages)/(content)/administration/settings/page";
import { PaginatedResponse, postQueryParams, queryParams } from "@/types/pagination";
import { CreatePost, Post, UpdatePost } from "@/types/post";
import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts`;
export const getPosts = async (
  queryParams?: postQueryParams
): Promise<PaginatedResponse<Post>> => {
  try {
    const response = await axios.get(API_URL, {
      params: {
        page: queryParams?.page || 0,
        size: queryParams?.size || 10,
        userId: queryParams?.userId,
        postTypeId: queryParams?.postTypeId,
        tagIds: queryParams?.tagIds,
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

export const updatePostById = async (
  id: number,
  updatedPost: UpdatePost | null,
  token: string
) => {
  try {
    const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/posts/${id}`;

    const response = await axios.put(API_URL, updatedPost, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data.message || "Error al actualizar el perfil"
      );
    } else {
      throw new Error(error.message || "Error al actualizar el perfil");
    }
  }
};

export const createPost = async (data: CreatePost, token: string) => {
  try {
    const response = await axios.post(API_URL, data, {
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
    throw new Error(error.message || "Error al crear Post");
  }
};

export async function updatePost(
  id: string,
  postData: UpdatePost,
  token: string
) {
  try {
    const response = await axios.put(`${API_URL}/${id}`, postData, {
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
    throw new Error(error.message || "Error al editar Post");
  }
}

export async function deletePost(id: string, token: string) {
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
    throw new Error(error.message || "Error al eliminar Post");
  }
}

export async function sharePost(id: string, token: string) {
  try {
    const response = await axios.put(
      `${API_URL}/${id}/share`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al compartir Post");
  }
}
