import { Favorites } from '@/types/favorites';
import { buildQueryParams, queryParams } from '@/types/pagination';
import axios from 'axios';
import build from 'next/dist/build';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/favorites`;

export const getFavorites = async (
    token: string, 
    queryParams?: queryParams
) => {
    try {
        const params = buildQueryParams(queryParams);
        const response = await axios.get(API_URL, {
            params: params,
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error('No se encontraron publicaciones favoritas');
        }
        throw new Error(error.message || 'Hubo un error al cargar las publicaciones favoritas');
    }
};

export const addFavorite = async (idPost: number, token: string) => {
    try {
        const response = await axios.post(`${API_URL}`, {
            postId: idPost // Enviar postId en el cuerpo de la solicitud
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error('No se encontraron publicaciones favoritas');
        }
        throw new Error(error.message || 'Hubo un error al añadir la publicación a favoritos');
    }
};

export const deleteFavorite = async (idPost: number, token: string) => {
    try {
        const response = await axios.delete(`${API_URL}/${idPost}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if (error.response && error.response.status === 404) {
            throw new Error('No se encontraron publicaciones favoritas');
        }
        throw new Error(error.message || 'Hubo un error al eliminar la publicacion de favoritos');
    }
};