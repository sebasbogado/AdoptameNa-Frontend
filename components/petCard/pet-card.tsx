'use client'
import React, { useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import CardText from "./card-text";
import FavoriteButton from "../buttons/favorite-button";
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado



type PetCardProps = {
    post: any;
    className?: string
};


export default function PetCard({ post, className }: PetCardProps) {
    const [isFavorite, setIsFavorite] = useState<boolean>(false);
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
    const isPost = "postTypeName" in post; 
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <FavoriteButton variant={isFavorite ? "active" : "desactivated"} // Usa el estado para cambiar el 'variant'
                onClick={() => setIsFavorite(!isFavorite)} className="absolute top-2 right-2 z-10" />
            <CardImage image={isPost ? (post as Post).urlPhoto : (post as Pet).urlPhoto || ""} />
            <CardText post={post} />
        </div>
    );
}
