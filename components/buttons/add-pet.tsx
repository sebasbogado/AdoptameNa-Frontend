'use client'
import React, { useState } from "react";
import clsx from "clsx";
import FavoriteButton from "../buttons/favorite-button";
import { Post } from "@/types/post";
import { Pet } from "@/types/pet";
import Link from "next/link";



export default function AddPet() {
    return (
        // cambiar cuando se cambie la ubicacion del archivo crear mascota
        <Link href={`/missing`} > 
            <div className={clsx("w-64 h-[19rem] text-blue text-2xl rounded-xl overflow-hidden  border-2 border-[rgb(158,189,255)] hover:shadow-md hover:shadow-[rgb(185,207,255)]  flex flex-col relative items-center justify-center")}>
            <span className="material-symbols-outlined-lg ">
                add
                </span>
            <p>Añadir Mascota</p>
            </div>
        </Link>
    );
}
