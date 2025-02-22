import React from "react";
import clsx from 'clsx'
import Link from 'next/link'
import CardImage from "@components/petCard/cardImage";

export default function PetCard({ className = '', pet }) {
    return (
        <div className={clsx(['w-60 rounded-xl bg-[#F8F7F7] flex flex-col overflow-hidden', className])}>
            <div className="relative">
                <CardImage></CardImage>
            </div>
            <div className="px-2 py-1 flex flex-col gap-1">
                <div className="">
                    <span className="">Nombre del Perrito</span>
                    <p className="text-gray-700 text-sm leading-4">Pequeña descripción del perrito</p>
                </div>
                <div className="flex justify-between items-center border-t-2 border-gray-300 pt-1 mt-1">
                    <span className="font-semibold">Algo</span>
                    <Link href={`/dashboard/${pet?.id}`}>
                    <button className="flex items-center bg-yellow-800 text-white rounded-xl px-2 text-sm">
                        <span>Boton</span>
                    </button>
                    </Link>
                </div>
            </div>
    </div>
)
}