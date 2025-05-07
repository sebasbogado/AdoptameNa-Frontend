'use client'
import React from "react";
import clsx from "clsx";
import PetCard from "@/components/petCard/pet-card";
import { useRouter } from "next/navigation";;
import Button from "@/components/buttons/button";
import { ArchiveRestore } from "lucide-react";
import { ITEM_TYPE } from "@/types/constants";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado

type PetCardProps = {
    item: any;
    itemType: ITEM_TYPE;
    className?: string;
    onRestore: (id: string | number, type: string) => void;
    disabled?: boolean;
};

export default function CardDeleted({ item, itemType, className, onRestore, disabled }: PetCardProps) {

    const handleRestoreClick = () => {
        // Llama a onRestore pasando tanto el ID como el TIPO
        onRestore(item.id, itemType);
    };

    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            <PetCard post={item} disabled={disabled}/>
            <div className="m-4 flex justify-center">
                <Button
                    onClick={handleRestoreClick}
                    size="sm"
                    className="flex items-center justify-center"
                >
                    <ArchiveRestore className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
                    Restaurar
                </Button>
            </div>
        </div>
    );
}
