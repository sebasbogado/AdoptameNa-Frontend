import React from "react";
import clsx from "clsx";
import CardImage from "@components/petCard/cardImage";
import CardText from "./cardText";
import FavoriteButton from "../buttons/FavoriteButton";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado

type Pet = {
    id: string;
    name: string;
    species: string;
    age: number;
    img_url: string
};

type Post = {
    id: string;
    content: string;
    date: string;
    img_url: string
};

type PetCardProps = {
    pet: Pet;
    post: Post;
    className?: string
};


export default function PetCard({pet, post, className }: PetCardProps) {
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <FavoriteButton className="absolute top-2 right-2 z-10" />
            <CardImage/>
            <CardText pet={pet} post={post} />
        </div>
    );
}
