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

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado



type PetCardProps = {
    post: any;
    className?: string
    isReportedPage?: boolean
    handleAprove?: () => void;
    handleDesaprove?: () => void;

};


export default function CardButtons({ post, className, isReportedPage, handleAprove , handleDesaprove}: PetCardProps) {
    const router = useRouter()
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <PetCard post={post} />
            <div>

            </div>
            {isReportedPage ?
                <div className=" flex">

                    <button className="text-black px-4 py-2 rounded" onClick={handleAprove}>
                        ✅ Aprobar
                    </button>
                    <button className=" text-black px-4 py-2 rounded" onClick={handleDesaprove}>
                        ❌ Rechazar
                    </button>
                    </div>
                :
                <div className="flex gap-2 mt-2">
                    <Link href={`/administration/report/${post.id}`} >

                        <button >
                            <span className="material-symbols-outlined font-material ">
                                {"visibility"}
                            </span>
                            Ver razones
                        </button>
                    </Link>
                </div>
            }


        </div>
    );
}
