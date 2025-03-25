import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-background p-4">
            <div className="relative w-full max-w-md h-auto mb-8 overflow-hidden ">
                <Image
                    src="/logo.png"
                    alt="Página no encontrada"
                    width={800}
                    height={600}
                    className="object-cover w-full "
                    priority
                />

            </div>

            <div className="text-center max-w-md">
                <h1 className="text-4xl font-bold text-foreground mb-2">¡Página no encontrada!</h1>
                <p className="text-lg text-muted-foreground mb-6">
                    Lo sentimos, la página que estás buscando no existe o ha sido movida.
                </p>

                <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-colors">
                <span className="material-symbols-outlined">
                home
                </span>
                    <span>Volver al inicio</span>
                </Link>
            </div>

            <p className="mt-12 text-sm text-muted-foreground">
                ¿Necesitas ayuda? <a href="#" className="text-primary hover:underline">Contacta con soporte</a>
            </p>
        </div>
    );
}