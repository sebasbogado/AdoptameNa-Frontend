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
import {  CheckIcon, EyeIcon, XIcon } from "lucide-react";

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
                    <PetCard post={post} isPost={true} />
                </div> :
                    <PetCard post={post}  isPost={true}/>}
            {isReportedPage ?
                <div className="m-4 flex gap-2 justify-center">

                    <Button size="sm" onClick={handleAprove} className="flex items-center justify-center">
                    <CheckIcon className="w-3 h-3 mr-2 text-white" strokeWidth={4} />
                    Mantener
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDesaprove} className="flex items-center justify-center">
                    <XIcon className="w-3 h-3  mr-2 text-white" strokeWidth={4} />
                    Bloquear
                    </Button>
                </div>
                :
                <div className="m-4 flex justify-center">
                    <Link href={`/administration/report/${post.id}`} >

                        <Button size="sm" className="flex items-center justify-center">
                            <EyeIcon className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
                            Ver razones
                        </Button>
                    </Link>
                </div>
            }


        </div>
    );
}
