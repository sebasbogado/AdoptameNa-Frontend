import React from "react";
import clsx from "clsx";
import CardImage from "@components/petCard/cardImage";
import CardText from "./cardText";
import FavoriteButton from "../buttons/FavoriteButton";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado


type Post = {
    postId: string;
    content: string;
    date: string;
    imageUrl: string
};

type PetCardProps = {
    post: Post;
    className?: string
};


export default function PetCard({post, className }: PetCardProps) {
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <FavoriteButton className="absolute top-2 right-2 z-10" />
            <CardImage image={post?.imageUrl}/>
            <CardText post={post} />
        </div>
    );
}
