"use client"

import UserHeader from "@/components/userHeader"
import { AuthContext } from "@/contexts/authContext";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";

export default function Navbar() {
    const useAuth = useContext(AuthContext);
    return (
        <header className="w-full border-b">
            <nav className="w-full flex h-16 items-center justify-between px-4">
                <Link href="/dashboard" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Adoptamena logo"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="hidden items-center gap-12 md:flex">
                    <Link href="/dashboard" className="text-lg font-bold text-black hover:text-purple-600">
                        Inicio
                    </Link>
                    <Link href="/volunteering" className="text-lg font-bold text-black hover:text-purple-600">
                        Voluntariado
                    </Link>
                    <Link href="/adoption" className="text-lg font-bold text-black hover:text-purple-600">
                        Adopción
                    </Link>
                    <Link href="/missing" className="text-lg font-bold text-black hover:text-purple-600">
                        Extraviados
                    </Link>
                    <Link href="/blog" className="text-lg font-bold text-black hover:text-purple-600">
                        Blog
                    </Link>
                    <Link href="/marketplace" className="text-lg font-bold text-black hover:text-purple-600">
                        Tienda
                    </Link>
                </div>
                {useAuth.currentUser ? (
                    <UserHeader currentUser={useAuth.currentUser} />
                ) : (
                    <div className="flex space-x-4">
                        <Link href="/auth/register">
                            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
                                Crear Cuenta
                            </button>
                        </Link>
                        <Link href="/auth/login">
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