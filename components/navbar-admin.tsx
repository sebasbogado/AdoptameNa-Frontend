"use client"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Lista de enlaces de navegación
const navbarAdminItems = [
    { name: "Administrar Publicaciones", path: "/administration/posts" },
    { name: "Publicaciones Eliminadas", path: "/administration/deleted-posts" },
    {
        name: "Reportes",
        isDropdown: true,
        items: [
            { name: "Reportes de mascotas", path: "/administration/report/pets" },
            { name: "Reportes de publicaciones", path: "/administration/report/posts" },
            { name: "Reportes de productos", path: "/administration/report/products" },
            { name: "Reportes de comentarios", path: "/administration/report/comments" }
        ]
    },
    { name: "Configuraciones", path: "/administration/settings" },
    { name: "Usuarios", path: "/administration/users" },
    { name: "Auspiciantes", path: "/administration/sponsors" },
    { name: "Banners", path: "/administration/settings/banner" },
];

export default function NavbarAdmin() {
    const pathname = usePathname();
    const router = useRouter();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cierra el dropdown cuando se hace clic fuera de él
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleClick = (path: string) => {
        router.push(path);
    };

    return (
        <div className="hidden items-center gap-12 md:flex">
            {navbarAdminItems.map((item, index) =>
                item.isDropdown ? (
                    <div key={`dropdown-${index}`} className="relative" ref={dropdownRef}>
                        <button
                            className={`flex items-center text-lg font-bold hover:text-purple-600 focus:outline-none
                            ${pathname.startsWith("/administration/report") ? "text-purple-600" : "text-black"}`}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                        >
                            {item.name}
                            <ChevronDown className="ml-1 h-4 w-4" />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                                {item.items?.map((subItem) => (
                                    <button
                                        key={subItem.path}
                                        onClick={() => {
                                            handleClick(subItem.path);
                                            setDropdownOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-2 text-sm ${pathname === subItem.path
                                            ? "bg-gray-100 text-purple-600"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {subItem.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        key={item.path}
                        onClick={() => handleClick(item.path as string)}
                        className={`text-lg font-bold hover:text-purple-600 focus:outline-none ${(pathname === item.path) ? "text-purple-600" : "text-black"
                            }`}
                    >
                        {item.name}
                    </button>
                )
            )}
        </div>
    );
}