'use client';
import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

export default function AddPost({ className = "" }: { className?: string }) {
    return (
        <Link href={`/add-post`}>
            <div className={`w-64 h-[19rem] text-2xl rounded-xl overflow-hidden border-2 hover:shadow-md flex flex-col relative items-center justify-center ${className}`}>
                <PlusIcon className="w-10 h-10 mb-4" strokeWidth={3} />
                <p>Añadir Publicación</p>
            </div>
        </Link>
    );
}