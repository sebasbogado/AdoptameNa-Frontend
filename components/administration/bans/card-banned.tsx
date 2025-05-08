'use client'
import React from "react";
import clsx from "clsx";
import PetCard from "@/components/petCard/pet-card";
import Button from "@/components/buttons/button";
import { Ban } from "lucide-react";
import ProductCard from "@/components/product-Card/product-card";
// import { ITEM_TYPE } from "@/types/constants";

//Defini estos tipos para que el componente no tenga errores, esto debera cambiar en el futuro cuando el endpoint que conecta
//posts con pets este implementado

type PetCardProps = {
    item: any;
    itemType: /*ITEM_TYPE*/ string;
    className?: string;
    onBan: (id: string | number, type: string) => void;
    disabled?: boolean;
};

export default function CardBanned({ item, itemType, className, onBan, disabled }: PetCardProps) {

    const handleBan = () => {
        // Llama a onRestore pasando tanto el ID como el TIPO
        onBan(item.id, itemType);
    };

    return (
        <div className={clsx("w-64 rounded-xl overflow-hidden bg-white drop-shadow-md flex flex-col relative", className)}>
            { itemType === "pet" ? (
                <PetCard post={item} /*disabled={disabled}*/ /> 
            ) : itemType === "product" ? (
                <ProductCard product={item} /*disabled={disabled}*/ /> 
            ) : (
                <PetCard post={item} isPost /*disabled={disabled}*/ /> 
            )}
            
            <div className="m-4 flex justify-center">
                <Button
                    onClick={handleBan}
                    size="sm"
                    variant="danger"
                    className="flex items-center justify-center"
                >
                    <Ban className="w-5 h-5 mr-2 text-white" strokeWidth={3} />
                    Bannear
                </Button>
            </div>
        </div>
    );
}