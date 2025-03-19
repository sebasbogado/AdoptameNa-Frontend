'use client'
import React, { useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import CardText from "@/components/petCard/card-text";

import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import PetCard from "@/components/petCard/pet-card";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado



type PetCardProps = {
    post: any;
    className?: string
};


export default function CardButtons({ post, className }: PetCardProps) {
     return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <PetCard post={post} />
            <button>
                <span className="material-symbols-outlined font-material ">
                    {"close"}
                </span>
            </button>
            
        </div>
    );
}
