'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import { getFavorites } from "@/utils/favorites-posts.http";
import { Favorites } from "@/types/favorites";


const FavoritesContext = createContext<any>(null);

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
    const { authToken } = useAuth();
    const [favorites, setFavorites] = useState<Favorites[]>([]);

    useEffect(() => {
        if (!authToken) return;

        const fetchFavorites = async () => {
            try {
                const data = await getFavorites(authToken);
                setFavorites(data);
                console.log("data", data)
            } catch (error) {
                console.error("Error obteniendo favoritos:", error);
            }
        };

        fetchFavorites();
    }, [authToken]);

    return (
        <FavoritesContext.Provider value={{ favorites, setFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => useContext(FavoritesContext);
