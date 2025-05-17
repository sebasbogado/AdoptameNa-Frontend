import { Media } from "@/types/media";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface CardImageProps {
    media?: Media | null;
}

const notFoundSrc = "/logo.png"; // O la ruta a tu imagen de fallback

const CardImage: React.FC<CardImageProps> = ({ media }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState<string>(notFoundSrc);

    useEffect(() => {
        const newSrc = (media && media.url) ? media.url : notFoundSrc;
        if (newSrc !== imageSrc) {
            setIsLoading(true);
            setImageSrc(newSrc);
        }
    }, [media, imageSrc]);
    return (
        <div className="relative h-36 rounded-lg overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
            )}
            <Image
                className={`w-full h-auto object-cover transition-opacity duration-300 ${
                    isLoading ? "opacity-0" : "opacity-100"
                }`}
                src={imageSrc}
                alt="Imagen de la tarjeta"
                width={500}
                height={500}
                onLoadingComplete={() => setIsLoading(false)}
                onError={() => {
                    if (imageSrc !== notFoundSrc) {
                        setImageSrc(notFoundSrc);
                    }
                    setIsLoading(false);
                }}
            />
        </div>
    );
};

export default CardImage;