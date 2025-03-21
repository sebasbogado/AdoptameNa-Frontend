'use client'
import React, { useState } from "react";
import clsx from "clsx";
import CardImage from "@/components/petCard/card-image";
import CardText from "@/components/petCard/card-text";

import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import PetCard from "@/components/petCard/pet-card";
import Router from "next/router";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/buttons/button";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado



type PetCardProps = {
    post: any;
    className?: string
    isReportedPage?: boolean
    handleAprove?: () => void;
    handleDesaprove?: () => void;

};


export default function CardButtons({ post, className, isReportedPage, handleAprove, handleDesaprove }: PetCardProps) {
    const router = useRouter()
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            {isReportedPage ?

                <div onClick={(e) => e.stopPropagation()}>
                    <PetCard post={post} />
                </div> :
                    <PetCard post={post} />}
            {isReportedPage ?
                <div className=" flex m-4 flex gap-2 justify-center">

                    <Button size="sm" onClick={handleAprove} className="flex items-center justify-center">
                        <span className="material-symbols-outlined mr-2">check</span> Mantener
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDesaprove} className="flex items-center justify-center">
                        <span className="material-symbols-outlined">close</span> Bannear
                    </Button>
                </div>
                :
                <div className="m-4 flex justify-center">
                    <Link href={`/administration/report/${post.id}`} >

                        <Button size="sm" className="flex items-center justify-center">
                            <span className="material-symbols-outlined font-material ">
                                {"visibility"}
                            </span>
                            Ver razones
                        </Button>
                    </Link>
                </div>
            }


        </div>
    );
}
