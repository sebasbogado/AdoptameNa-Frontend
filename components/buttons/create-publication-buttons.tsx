'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { BoneIcon, DogIcon, PawPrintIcon, Plus, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const pageItems = [
    {
        name: "Inicio", path: "/dashboard",
        options: [{
            href: "/add-post",
            label: "Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        },
        {
            href: "/add-pet",
            label: "Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        },
        {
            href: "/add-product",
            label: "Producto",
            icon: <BoneIcon className="flex text-right h-5 w-5" />,
        }]
    },
    {
        name: "Voluntariado", path: "/volunteering",
        options: [{
            href: "/add-post",
            label: "Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        }]
    },
    {
        name: "Adopción", path: "/adoption",
        options: [{
            href: "/add-pet",
            label: "Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        }]
    },
    {
        name: "Extraviados", path: "/missing",
        options: [{
            href: "/add-pet",
            label: "Mascota",
            icon: <DogIcon className="flex text-right h-5 w-5" />,
        }]
    },
    {
        name: "Blog", path: "/blog",
        options: [{
            href: "/add-post",
            label: "Publicación",
            icon: <PawPrintIcon className="flex text-right h-5 w-5" />,
        }]
    },
    {
        name: "Tienda", dpath: "/marketplace",
        options: [{
            href: "/add-product",
            label: "Producto",
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
        <div className="fixed bottom-5 right-5 z-20 flex flex-col items-end gap-2">
            {pageItems
                .filter(page =>
                    (isDashboardPage && page.name === "Inicio") ||
                    (isVolunteeringPage && page.name === "Voluntariado") ||
                    (isAdoptionPage && page.name === "Adopción") ||
                    (isMissingPage && page.name === "Extraviados") ||
                    (isBlogPage && page.name === "Blog") ||
                    (isMarketplacePage && page.name === "Tienda"))
                .map((page) => (
                    <div
                        key={page.name}
                        id="floating-menu"
                        className={`
                        absolute bottom-full right-0 mb-3 flex flex-col items-end gap-2
                        transition-opacity duration-300 ease-out
                        ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}
                    >
                        {page.options.map((option, index) => (
                            <Link key={option.href} href={option.href} legacyBehavior>
                                <a
                                    onClick={handleLinkClick}
                                    style={{
                                        transitionDelay: isOpen
                                            ? `${(page.options.length - 1 - index) * 50}ms`
                                            : `${index * 75}ms`,
                                    }}
                                    className={`
                                        flex items-center
                                        px-4 py-2 rounded-full shadow-lg
                                        border-2
                                        bg-white text-[#FFAE34] border-[#FFAE34]
                                        hover:bg-[#FFAE34] hover:text-white
                                        transform-gpu transition-all duration-300 ease-out
                                        overflow-hidden
                                        ${isOpen
                                            ? 'opacity-100 translate-y-0 scale-100 justify-start w-[60px] sm:w-[180px] md:w-[200px]'
                                            : 'opacity-0 translate-y-2 scale-95 pointer-events-none justify-center w-[40px]'
                                        }
                                    `}
                                    title={option.label}
                                >
                                    <div className="flex items-center justify-center">
                                        {option.icon}
                                    </div>
                                    <span className="ml-2 truncate hidden sm:inline">{option.label}</span>
                                </a>
                            </Link>
                        ))}
                    </div>
                ))}

            {/* Botón Principal de Toggle (Usando tu versión mejorada) */}
            <button
                onClick={toggleMenu}
                className={`
                    group relative z-30 
                    flex items-center justify-center
                    bg-[#FFAE34] text-white 
                    h-10 w-10
                    rounded-full shadow-lg 
                    transition-all duration-300 ease-in-out
                    hover:bg-[#E09A2D]
                    hover:shadow-xl
                    outline-none ring-2 ring-[#FFAE34] ring-offset-2
                    ${isOpen
                        ? 'px-3 w-auto min-w-[7rem] sm:min-w-[8rem] md:min-w-[9rem]' // Abierto: padding y ancho automático con mínimo
                        : 'w-10 hover:w-auto hover:min-w-[7rem] hover:sm:min-w-[8rem] hover:px-3' // Cerrado: w-10, en hover se expande
                    } 
                `}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                aria-controls="floating-menu"
                aria-label={isOpen ? "Cerrar publicación" : "Crear publicación"}
                title={isOpen ? "Cerrar opciones" : "Abrir opciones de creación"}
            >
                <div className={`
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'rotate-30' : 'group-hover:rotate-90'} 
                `}>
                    {isOpen ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </div>
                <div className={`
                    overflow-hidden 
                    transition-all duration-300 ease-in-out
                    ${isOpen
                        ? 'max-w-xs ml-1.5 opacity-100' // Abierto: visible
                        : 'max-w-0 ml-0 opacity-0 group-hover:max-w-xs group-hover:ml-1.5 group-hover:opacity-100 ' // Cerrado: oculto, visible en hover
                    }
                `}>
                    <span className="text-base">
                        {isOpen ? 'Cerrar' : 'Crear'}
                    </span>
                </div>
            </button>
        </div>
    );
};

export default FloatingActionButton;