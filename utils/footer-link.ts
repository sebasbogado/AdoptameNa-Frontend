// links para el footer

import { getSupportEmailLink } from "./email-support-config";

export const footerSections = [
    {
      title: "Ayuda",
      links: [
        { name: "Preguntas frecuentes", path: "/faq" },
        { name: "Contactar con soporte", path: getSupportEmailLink(), testId: "contact-to-support-link" }
      ],
    },
    {
      title: "Nosotros",
      links: [
        { name: "Quiénes somos", path: "/about-us" },
        { name: "Misión, Visión y Valores", path: "/our-values" },
      ],
    },
    {
      title: "Acerca de",
      links: [
        { name: "Auspiciantes", path: "/sponsors" },
        { name: "Donaciones", path: "/donations" },
        { name: "Términos y condiciones", path: "/terms-and-conditions" },
        { name: "Avisos legales", path: "/legal" },
        { name: "Políticas de privacidad", path: "/privacy-policy" },
      ],
    },
  ];
  
  