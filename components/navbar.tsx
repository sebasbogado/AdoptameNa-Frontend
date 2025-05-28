"use client"

import UserHeader from "@/components/user-header"
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu as MenuIcon, X as CloseIcon } from "lucide-react";

// Lista de enlaces de navegación
const navbarItems = [
    { name: "Inicio", path: "/dashboard" },
    { name: "Voluntariado", path: "/volunteering" },
    { name: "Adopción", path: "/adoption" },
    { name: "Extraviados", path: "/missing" },
    { name: "Blog", path: "/blog" },
    { name: "Tienda", path: "/marketplace" },
    { name: "Colecta", path: "/crowdfunding" }
];

export default function Navbar() {
    const { user } = useAuth();
    const pathname = usePathname(); // Obtener la ruta actual
    const [menuOpen, setMenuOpen] = useState(false);

    // Condición para ocultar los enlaces de navegación en la página de administración y solicitudes.
    const isAdminPage = pathname.includes("/administration");
    const isReceivedPage = pathname.includes("/profile/received-request");

    return (
        <header className="w-full border-b  bg-white">
            <nav className={`w-full h-16 items-center px-4 relative flex ${user ? 'justify-between md:justify-between' : 'justify-between'}`}>
                {/* Botón hamburguesa solo en móvil y usuario logueado */}
                {!isAdminPage && !isReceivedPage && user && (
                    <button
                        className="md:hidden p-2 absolute left-4 top-1/2 -translate-y-1/2"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Abrir menú"
                    >
                        {menuOpen ? <CloseIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                )}

                {/* Logo centrado en móvil cuando el usuario está logueado */}
                <div className={`${user ? 'flex-1 flex justify-center md:static md:justify-start md:flex-none' : ''}`}>
                    <Link href="/" className="flex items-center">
                        <Image
                            src="/logo.png"
                            alt="Adoptamena logo"
                            width={140}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Botón hamburguesa solo en móvil y usuario NO logueado */}
                {!isAdminPage && !isReceivedPage && !user && (
                    <button
                        className="md:hidden p-2 ml-2"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Abrir menú"
                    >
                        {menuOpen ? <CloseIcon className="w-7 h-7" /> : <MenuIcon className="w-7 h-7" />}
                    </button>
                )}

                {/* Enlaces de navegación en desktop */}
                {!isAdminPage && !isReceivedPage && (
                    <div className="hidden items-center gap-12 md:flex">
                        {navbarItems.map(({ name, path }) => (
                            <Link
                                key={path}
                                href={path as any}
                                className={`text-lg font-bold hover:text-purple-600 ${pathname === path ? "text-purple-600" : "text-black"
                                    }`}
                            >
                                {name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Enlaces de navegación en móvil (menú hamburguesa) */}
                {!isAdminPage && !isReceivedPage && menuOpen && (
                    <div className="absolute top-16 left-0 w-full bg-white shadow-lg flex flex-col items-start gap-2 px-4 py-4 z-[100] md:hidden animate-fade-in">
                        {navbarItems.map(({ name, path }) => (
                            <Link
                                key={path}
                                href={path as any}
                                className={`text-base font-bold py-2 w-full text-left hover:text-purple-600 ${pathname === path ? "text-purple-600" : "text-black"}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {name}
                            </Link>
                        ))}
                        {!user && (
                            <div className="w-full flex flex-col gap-2 mt-4 items-center">
                                <Link href="/auth/register" className="w-full max-w-xs">
                                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition w-full">
                                        Crear Cuenta
                                    </button>
                                </Link>
                                <Link href="/auth/login" className="w-full max-w-xs">
                                    <button className="bg-white text-blue-500 border border-blue-500 px-4 py-2 rounded-lg hover:bg-blue-100 transition w-full">
                                        Iniciar Sesión
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* UserHeader siempre visible en la barra principal */}
                {user ? (
                    <div className="flex items-center">
                        <UserHeader currentUser={user} />
                    </div>
                ) : (
                    <div className="hidden md:flex space-x-4 items-center">
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