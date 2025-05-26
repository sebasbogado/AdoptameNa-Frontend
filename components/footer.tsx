import React from "react";
import { footerSections } from "@/utils/footer-link"; // Importamos la lista de secciones
import Link from "next/link";

const Footer: React.FC = () => {
    return (
        <footer className="p-10 bg-btn-cta text-white relative overflow-clip">
            <div className="flex flex-col md:flex-row md:justify-between w-full md:w-3/4 gap-8">
                {footerSections.map((section) => (
                    <div key={section.title} className="flex flex-col gap-3 text-lg">
                        <h1 className="font-bold">{section.title}</h1>
                        <ul className="p-0 flex flex-col gap-1">
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.path} className="decoration-transparent">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <img
                src="/footer_img.png"
                alt="Imagen de footer"
                className="absolute -bottom-3 right-0 w-32 md:w-52 h-auto"
            />
        </footer>
    );
};

export default Footer;
