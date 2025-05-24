'use client'

import SectionBody from "@/components/about-us/about-body";
import Footer from "@/components/footer";
import SkeletonStaticPage from '@/components/skeleton-static-page';
import { useEffect, useState } from 'react';

// Datos de las secciones Misión, Visión y Valores
const bodyData = [
    {
      imageSrc: "/about-us/mision.png",
      title: "Misión",
      text: "Queremos generar un impacto positivo ante la problemática de los animales en situación de calle, creando herramientas que les acerquen a oportunidades de adopción.",
    },
    {
      imageSrc: "/about-us/vision.png",
      title: "Visión",
      text: "Ser una plataforma líder que conecte a animales abandonados con hogares amorosos, promoviendo una cultura de adopción responsable en todo el mundo.",
    },
    {
      imageSrc: "/about-us/mision.png",
      title: "Valores",
      text: (
        <>
          <strong>Compasión:</strong> Nos mueve el amor y el respeto hacia todos los animales, buscando siempre su bienestar y protección. <br /><br />
          <strong>Colaboración:</strong> Fomentamos el trabajo conjunto entre rescatistas, voluntarios, donantes y adoptantes, creando una red sólida y efectiva para ayudar a los animales. <br /><br />
          <strong>Transparencia:</strong> Actuamos con honestidad y claridad, manteniendo a nuestra comunidad informada y asegurando que todas nuestras acciones sean visibles y comprensibles. <br /><br />
          <strong>Compromiso:</strong> Estamos dedicados a nuestra misión de rescatar y proteger a los animales en situación de calle, trabajando con perseverancia y dedicación. <br /><br />
          <strong>Empatía:</strong> Valoramos las necesidades y sentimientos tanto de los animales como de las personas involucradas, fomentando un ambiente de comprensión y apoyo mutuo. <br /><br />
          <strong>Educación:</strong> Creemos en la importancia de informar y sensibilizar a la comunidad sobre el rescate, cuidado y adopción de animales, promoviendo una cultura de responsabilidad y amor hacia ellos.
        </>
      ),
    },
  ];

export default function Page(){
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return <SkeletonStaticPage />;
    }

    return(<>
    {/* Secciones de Misión, Visión y Valores */}
    <div className="space-y-16 md:space-y-24 py-8 md:py-12">
    {bodyData.map((section, index) => (
      <SectionBody
        key={index}
        imageSrc={section.imageSrc}
        title={section.title}
      >
        {section.text}
      </SectionBody>
    ))}
    <div className="h-12 md:h-10" />
  </div>
  </>
  );
}