'use client';

import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

interface AddCardButtonProps {
    type: "pet" | "post" | "product";
    className?: string;
}

const typeLabels: Record<AddCardButtonProps["type"], string> = {
    pet: "Añadir Mascota",
    post: "Añadir Publicación",
    product: "Añadir Producto",
};

const typeLinks: Record<AddCardButtonProps["type"], string> = {
    pet: "/add-pet",
    post: "/add-post",
    product: "/add-product",
};

export default function AddCardButton({ type, className = "" }: AddCardButtonProps) {
    const label = typeLabels[type];
    const link = typeLinks[type];

    return (
        <Link href={link}>
            <div
                className={`w-64 h-[19rem] text-2xl rounded-xl overflow-hidden border-2 hover:shadow-md flex flex-col relative items-center justify-center ${className}`}
            >
                <PlusIcon className="w-10 h-10 mb-4" strokeWidth={3} />
                <p>{label}</p>
            </div>
        </Link>
    );
}
