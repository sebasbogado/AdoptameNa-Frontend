'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { BoneIcon, DogIcon, PawPrintIcon, Plus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageItems = [
    { name: "Inicio", path: "/dashboard", 
        options: [{
            href: "/add-post",
            label: "Crear Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        },
        {
            href: "/add-pet",
            label: "Añadir Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        },
        {
            href: "/add-product",
            label: "Añadir Producto",
            icon: <BoneIcon className="flex text-right h-5 w-5" />,
        }]
    },
    { name: "Voluntariado", path: "/volunteering",
        options: [{
            href: "/add-post",
            label: "Crear Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        }]
    },
    { name: "Adopción", path: "/adoption",
        options: [{
            href: "/add-pet",
            label: "Añadir Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        }]
     },
    { name: "Extraviados", path: "/missing", 
        options: [{
            href: "/add-pet",
            label: "Añadir Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        }]
     },
    { name: "Blog", path: "/blog",
        options: [{
            href: "/add-post",
            label: "Crear Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        }]
     },
    { name: "Tienda", dpath: "/marketplace",
        options: [{
            href: "/add-product",
            label: "Añadir Producto",
            icon: <BoneIcon className="flex text-right h-5 w-5" />,
        }]
     }
];

const FloatingActionButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    // Cerrar el menú si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: { target: any; }) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const pathname = usePathname();
    const isDashboardPage = pathname.includes("/dashboard");
    const isVolunteeringPage = pathname.includes("/volunteering");
    const isAdoptionPage = pathname.includes("/adoption");
    const isMissingPage = pathname.includes("/missing");
    const isBlogPage = pathname.includes("/blog");
    const isMarketplacePage = pathname.includes("/marketplace");

    return (
        <div className="fixed bottom-5 right-5 z-20" ref={menuRef}>
            {isOpen && (
                <div
                    className="absolute bottom-full right-0 mb-3 flex flex-col items-end gap-3 transition-all duration-300 ease-out"
                >
                    {pageItems
                        .filter(page => 
                            (isDashboardPage && page.name === "Inicio") ||
                            (isVolunteeringPage && page.name === "Voluntariado") ||
                            (isAdoptionPage && page.name === "Adopción") ||
                            (isMissingPage && page.name === "Extraviados") ||
                            (isBlogPage && page.name === "Blog") ||
                            (isMarketplacePage && page.name === "Tienda"))

                        .map((page) => (
                            <div key={page.name} className="flex flex-col gap-2">
                                {page.options.map((option) => (
                                    <Link key={option.href} href={option.href} legacyBehavior>
                                        <a
                                            onClick={handleLinkClick}
                                            className={`
                                                flex items-center text-right gap-2
                                                px-5 py-2 rounded-full shadow-lg 
                                                border-2
                                                transition-all duration-300 w-[200px]
                                                bg-white text-[#FFAE34] border-[#FFAE34] /* Estilo para el boton normal */
                                                hover:bg-[#FFAE34] hover:text-white /* Estilo para el boton al pasar el mouse por encima */
                                            `}
                                            title={option.label}
                                        >
                                            <div className="ml- flex items-center">
                                                {option.icon}
                                            </div>
                                            <span className="hidden sm:inline">{option.label}</span>
                                        </a>
                                    </Link>
                                ))}
                            </div>
                        ))}
                </div>
            )}

            {/* Botón Principal de Toggle */}
            <button
                onClick={toggleMenu}
                className="group flex items-center gap-2 bg-[#FFAE34] text-white px-4 py-2 rounded-full shadow-lg hover:px-6 transition-all duration-500"
                aria-expanded={isOpen}
                aria-haspopup="true"
                title={isOpen ? "Cerrar opciones" : "Abrir opciones de creación"}
            >
                <span className="text-lg transition-all duration-300 transform group-hover:rotate-0">
                    {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
                <span className="hidden group-hover:inline transition-all duration-500">
                    {isOpen ? 'Cerrar' : 'Crear'}
                </span>
            </button>
        </div>
    );
};

export default FloatingActionButton;