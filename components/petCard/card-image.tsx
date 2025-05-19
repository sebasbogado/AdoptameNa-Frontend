import { Media } from "@/types/media";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";


interface CardImageProps {
    media?: Media | null;
    className?: string;
    isBlogCard?: boolean; // Determina el tipo de tarjeta
}

const notFoundSrc = "/logo.png";

const CardImage: React.FC<CardImageProps> = ({ media, className = "", isBlogCard }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState<string>(notFoundSrc);

    useEffect(() => {
        const newSrc = (media && media.url) ? media.url : notFoundSrc;
        if (newSrc !== imageSrc) {
            setIsLoading(true);
            setImageSrc(newSrc);
        }
    }, [media]);

    const CardStandardImg = (
        <div className="relative h-36 rounded-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
            )}
            <Image
                className={`w-full h-auto object-cover transition-opacity duration-300 ${isLoading ? "opacity-0" : "opacity-100"}`}
                src={imageSrc}
                alt="Imagen de la tarjeta"
                width={500}
                height={500}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => {
                    if (imageSrc !== notFoundSrc) setImageSrc(notFoundSrc);
                    setIsLoading(false);
                }}
            />
        </div>
    );

    const BlogImage = (
         <div className={`relative h-full w-full ${className}`}>
              <Image
                src={media?.url || notFoundSrc}
                alt={media?.alt || "Image not available"}
                fill
                className="object-cover"
      />
        </div>
    );

    return isBlogCard ? BlogImage : CardStandardImg;
};

export default CardImage;