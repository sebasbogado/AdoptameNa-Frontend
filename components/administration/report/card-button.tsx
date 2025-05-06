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
import { CheckIcon, EyeIcon, XIcon } from "lucide-react";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado
type PetCardProps = {
    post: any;
    className?: string
    isReportedPage?: boolean
    handleAprove?: () => void;
    handleDesaprove?: () => void;
    type: string;
    isPost?: boolean;
};



export default function CardButtons({ post, className, isReportedPage, handleAprove, handleDesaprove, type, isPost = true}: PetCardProps) {
    const router = useRouter()

    const getReportLinkHref = () => {
        switch (type) {
            case 'pet':
                return `/administration/report/pets/${post.id}`;
            case 'product':
                return `/administration/report/products/${post.id}`;
            case 'post':
            default: // Por defecto o si es 'post'
                return `/administration/report/posts/${post.id}`;
        }
    };

    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            {isReportedPage ?
                <div onClick={(e) => e.stopPropagation()}>
                    <PetCard post={post} isPost={isPost} />
                </div> :
                <PetCard post={post} isPost={isPost} />}
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
                    <Link href={getReportLinkHref()}>
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
