"use client"

import UserHeader from "@/components/user-header"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";

// Lista de enlaces de navegación
const navbarItems = [
    { name: "Inicio", path: "/dashboard" },
    { name: "Voluntariado", path: "/volunteering" },
    { name: "Adopción", path: "/adoption" },
    { name: "Extraviados", path: "/missing" },
    { name: "Blog", path: "/blog" },
    { name: "Tienda", path: "/marketplace" }
];

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
                    {navbarItems.map(({ name, path }) => (
                        <Link
                            key={path}
                            href={path}
                            className={`text-lg font-bold hover:text-purple-600 ${pathname === path ? "text-purple-600" : "text-black"
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