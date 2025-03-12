import React from "react";

type SectionBodyProps = {
  imageSrc: string;
  title: string;
  children: React.ReactNode;
};

const AboutBody: React.FC<SectionBodyProps> = ({ imageSrc, title, children }) => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-[12rem]">
      {/* Contenedor de Imagen y Título */}
      <div className="flex flex-col items-center text-center w-[200px]">
        <div className="w-20 h-20 mb-4">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-[#5A5A5A] text-4xl font-bold">{title}</h2>
      </div>

      {/* Contenedor del Texto */}
      <div className="w-[600px] min-h-[200px] text-left flex items-center">
        <p className="mt-2 text-gray text-xl leading-relaxed">{children}</p>
      </div>
    </div>
  );
};

export default AboutBody;
