import React from 'react';
import Image from 'next/image';

export default function Loading() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
            <div className="relative w-64 h-auto overflow-hidden rounded-lg  mb-2">
                <Image
                    src="/logo.png"
                    alt="Loading"
                    width={400}
                    height={400}
                    className="object-contain w-full animate-pulse"
                    priority
                />
            </div>

            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-foreground">Cargando</h2>
                <p className="mt-2 text-muted-foreground">
                    Por favor espere mientras cargamos el contenido...
                </p>
            </div>

            <div className="flex mt-6 space-x-2">
                <div className="w-3 h-3 rounded-full bg-black animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-black animate-pulse delay-150"></div>
                <div className="w-3 h-3 rounded-full bg-black animate-pulse delay-300"></div>
            </div>
        </div>
    );
}