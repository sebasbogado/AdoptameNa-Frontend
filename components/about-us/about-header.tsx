import Image from "next/image";
import React from "react";

type AboutHeaderProps = {
  title: React.ReactNode;
  text: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({ title, text, imageSrc, imageAlt }) => {
  return (
    <div className="bg-[#F3F3F3]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full min-h-[500px]">
        {/* Texto principal (izquierda) */}
        <div className="order-2 md:order-1 px-4 md:px-8 flex flex-col justify-center py-12">
          <h1 className="text-[#FFAE34] text-5xl font-bold">{title}</h1>
          <p className="mt-4 text-gray-700 text-xl leading-relaxed text-left">
            {text}
          </p>
        </div>

        {/* Imagen (derecha) */}
        <div className="order-1 md:order-2 h-full">
          <div className="w-full h-full">
            <Image
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover"
              width={500}
              height={500}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutHeader;