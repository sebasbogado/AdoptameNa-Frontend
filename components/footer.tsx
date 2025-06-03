import Link from "next/link";
import { ChevronUp } from "lucide-react"; // Necesitarás `lucide-react` para el ícono
import { footerSections } from "@/utils/footer-link";

const Footer: React.FC = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
       

            <footer className="p-10 pt-16 bg-btn-cta text-white overflow-clip">
              {/* Contenido principal del footer */}
              <div className="flex flex-col md:flex-row md:justify-between w-full md:w-3/4 mx-auto gap-8">
                {footerSections.map((section) => (
                  <div key={section.title} className="flex flex-col gap-3 text-lg">
                    <h1 className="font-bold">{section.title}</h1>
                    <ul className="flex flex-col gap-1">
                      {section.links.map((link) => (
                        <li key={link.name}>
                          <Link href={link.path} className="hover:underline">
                            {link.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
          
              {/* Wrapper relativo para la imagen */}
              <div className="relative w-full">
                <img
                  src="/footer_img.png"
                  alt="Imagen de footer"
                  className="absolute -bottom-36 -right-10 w-32 md:w-52 h-auto pointer-events-none"
                />
              </div>
          
              {/* Copyright e Ir al inicio */}
              <div className="mt-12 text-center text-sm opacity-80 flex flex-col items-center gap-2">
                <span>© {new Date().getFullYear()} AdoptameNa. Todos los derechos reservados.</span>
                <button
                  onClick={scrollToTop}
                  className="flex items-center gap-1 text-white underline hover:text-gray-300 transition-colors"
                >
                  Ir al inicio <ChevronUp size={18} />
                </button>
              </div>
            </footer>
          
          
          
          
    );
};

export default Footer;