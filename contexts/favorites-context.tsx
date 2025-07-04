'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getFavorites } from "@/utils/favorites-posts.http";
import { Favorites } from "@/types/favorites";
import { Post } from "@/types/post";


const FavoritesContext = createContext<any>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const { authToken } = useAuth();
    const [favorites, setFavorites] = useState<Post[]>([]);

    const fetchFavorites = async () => {
        try {
            if (!authToken) return;
            const data = await getFavorites(authToken);
            setFavorites(data.data);
        } catch (error) {
            console.error("Error obteniendo favoritos:", error);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [authToken]);

    return (
        <FavoritesContext.Provider value={{ favorites, fetchFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
