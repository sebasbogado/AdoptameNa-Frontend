'use client'
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import CardText from "./card-text";
import FavoriteButton from "../buttons/favorite-button";
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { addFavorite, deleteFavorite, getFavorites } from "@/utils/favorites-posts.http";
import { Alert } from "@material-tailwind/react";
import { useFavorites } from "@/contexts/favorites-context";
import { Favorites } from "@/types/favorites";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado
type PetCardProps = {
    post: any;
    className?: string
    isPost?: boolean;
};

export default function PetCard({ post, className, isPost }: PetCardProps) {
    const { favorites, fetchFavorites } = useFavorites(); // Usamos el contexto
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const { authToken } = useAuth(); // Hook de autenticación

    // Determinar si el post está en favoritos con una sola evaluación
    const isFavorite = favorites.some((fav: Favorites) => fav.postId === (post as Post).id);

    // Leer el estado del 'localStorage' (si existe) al cargar el componente
    // const [isFavorite, setIsFavorite] = useState<boolean>(() => {
    //     // Intentamos leer el valor del 'localStorage' usando el id del post
    //     const storedValue = localStorage.getItem(post.id);
    //     return storedValue ? JSON.parse(storedValue) : false;
    // });

    // // Función que cambia el estado de favorito y lo guarda en el localStorage
    // const toggleFavorite = () => {
    //     const newFavoriteState = !isFavorite;
    //     setIsFavorite(newFavoriteState);

    //     // Guardamos el nuevo estado en 'localStorage'
    //     localStorage.setItem(post.id, JSON.stringify(newFavoriteState));
    // };
    // console.log(post)
    // Cargar favoritos al montar el componente

    const handleFavoriteClick = async () => {
        if (!authToken) {
            setErrorMessage("Necesitas estar logeado para agregar a favoritos.");
            return;
        }

        try {
            if (isFavorite) {
                const favorite = favorites.find((fav: Favorites) => fav.postId === post.id);
                await deleteFavorite(favorite.id, authToken);
                setSuccessMessage("Publicación eliminada de favoritos");
            } else {
                await addFavorite(post.id, authToken);
                setSuccessMessage("Publicación añadida a favoritos");
            }
            await fetchFavorites();
        } catch (error) {
            console.error("Error al actualizar favorito", error);
        }
    };

    return (
        <div className={clsx("w-64 h-[19rem] rounded-3xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <div className="relative">
                {successMessage && (
                    <Alert
                        color="green"
                        onClose={() => setSuccessMessage("")}
                        className="fixed bottom-4 right-0 m-2 z-50 w-60"
                    >
                        {successMessage}
                    </Alert>
                )}
                {errorMessage && (
                    <Alert
                        color="red"
                        onClose={() => setErrorMessage("")}
                        className="fixed bottom-4 right-0 m-2 z-50 w-60"
                    >
                        {errorMessage}
                    </Alert>
                )}
            </div>
            {isPost &&
                <FavoriteButton variant={isFavorite ? "active" : "desactivated"} // Usa el estado para cambiar el 'variant'
                    onClick={handleFavoriteClick} className="absolute top-2 right-2 z-10" />
            }
            <Link href={isPost ? `/posts/${(post as Post).id}` : `/pets/${(post as Pet).id}`}>
                <CardImage media={isPost ? (post as Post).media : (post as Pet).media || ""} />
                <CardText post={post} />
            </Link>
        </div>
    );
}
