"use client"

import UserHeader from "@/components/user-header"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { user } = useAuth();
    const pathname = usePathname(); // Obtener la ruta actual
    return (
        <header className="w-full border-b">
            <nav className="w-full flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <Image
                        src="/logo.png"
                        alt="Adoptamena logo"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                    />
                </Link>

                <div className="hidden items-center gap-12 md:flex">
                    {[
                        { name: "Inicio", href: "/dashboard" },
                        { name: "Voluntariado", href: "/volunteering" },
                        { name: "Adopción", href: "/adoption" },
                        { name: "Extraviados", href: "/missing" },
                        { name: "Blog", href: "/blog" },
                        { name: "Tienda", href: "/marketplace" }
                    ].map(({ name, href }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`text-lg font-bold hover:text-purple-600 ${
                                pathname === href ? "text-purple-600" : "text-black"
                            }`}
                        >
                            {name}
                        </Link>
                    ))}
                </div>
                {user ? (
                    <UserHeader currentUser={user} />
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