'use client'
import React, { useState } from "react";
import clsx from "clsx";
import CardImage from "@components/petCard/cardImage";
import CardText from "./cardText";
import FavoriteButton from "../buttons/FavoriteButton";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado


type Post = {
    id: string;
    content: string;
    date: string;
    urlPhoto: string
    imageUrl: string;
};

type PetCardProps = {
    post: Post;
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

    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <FavoriteButton variant={isFavorite ? "active" : "desactivated"} // Usa el estado para cambiar el 'variant'
                onClick={() => setIsFavorite(!isFavorite)} className="absolute top-2 right-2 z-10" />
            <CardImage image={post?.imageUrl} />
            <CardText post={post} />
        </div>
    );
}
