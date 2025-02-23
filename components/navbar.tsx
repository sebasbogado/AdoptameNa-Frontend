"use client"

import { useAppContext } from "@/contexts/appContext";
import UserHeader from "@/components/userHeader"
import Image from "next/image";
import Link from "next/link";


export default function Navbar() {
    const { currentUser, cartItems } = useAppContext();
    return (
        <header className="w-full border-b">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Adoptamena logo"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="hidden items-center gap-8 md:flex">
                    <Link href="/" className="text-lg font-bold text-black hover:text-purple-600">
                        Inicio
                    </Link>
                    <Link href="/voluntariado" className="text-lg font-bold text-black hover:text-purple-600">
                        Voluntariado
                    </Link>
                    <Link href="/adopcion" className="text-lg font-bold text-black hover:text-purple-600">
                        Adopción
                    </Link>
                    <Link href="/extraviados" className="text-lg font-bold text-black hover:text-purple-600">
                        Extraviados
                    </Link>
                    <Link href="/blog" className="text-lg font-bold text-black hover:text-purple-600">
                        Blog
                    </Link>
                    <Link href="/tienda" className="text-lg font-bold text-black hover:text-purple-600">
                        Tienda
                    </Link>
                </div>
                {currentUser ? (
                    <UserHeader currentUser={currentUser} />
                ) : (
                    <div className="flex space-x-4">
                        <Link href="/signup">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                                Crear Cuenta
                            </button>
                        </Link>
                        <Link href="/login">
                            <button className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                                Iniciar Sesión
                            </button>
                        </Link>
                    </div>
                )}
            </nav>
        </header>
    )
}