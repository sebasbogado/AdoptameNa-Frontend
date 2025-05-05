'use client'
import React from "react";
import clsx from "clsx";
import PetCard from "@/components/petCard/pet-card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/buttons/button";
import { ArchiveRestore, CheckIcon, EyeIcon, XIcon } from "lucide-react";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado

type PetCardProps = {
    post: any;
    className?: string
    isDeletedPage?: boolean
    handleAprove?: () => void;
    handleDesaprove?: () => void;
    isPost?: boolean
};

export default function CardDeleted({ post, className, isDeletedPage, handleAprove, handleDesaprove, isPost = true }: PetCardProps) {
    const router = useRouter()
    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            {isDeletedPage ?
                <div onClick={(e) => e.stopPropagation()}>
                    <PetCard post={post} isPost={isPost} />
                </div> :
                <PetCard post={post} isPost={isPost} />}
            {isDeletedPage ?
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
                    <Link href={isPost ? `/administration/report/posts/${post.id}` : `/administration/report/pets/${post.id}`} >
                        <Button size="sm" className="flex items-center justify-center">
                            <ArchiveRestore className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
                            Restaurar
                        </Button>
                    </Link>
                </div>
            }


        </div>
    );
}
