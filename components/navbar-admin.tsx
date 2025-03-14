"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

// Lista de enlaces de navegación
const navbarAdminItems = [
    { name: "Mascotas", path: "/pets" },
    {name: "Razas", path: "/breed"},
    { name: "Estados de la mascota", path: "/pet-status" }
];

export default function NavbarAdmin(){

    const pathname = usePathname(); // Obtener la ruta actual

    return (

        <div className="hidden items-center gap-12 md:flex">
                    {navbarAdminItems.map(({ name, path }) => (
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

    )
}