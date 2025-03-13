import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/favorites`;

export const getFavorites = async (token: string) => {
    try {
        const response = await axios.get(API_URL, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error: any) {
        if(error.response && error.response.status === 404) {
            throw new Error('No se encontraron publicaciones favoritas');
        }
        throw new Error(error.message || 'Hubo un error al cargar las publicaciones favoritas');
    }
};