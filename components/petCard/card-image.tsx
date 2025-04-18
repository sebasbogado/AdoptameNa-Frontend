import { Media } from "@/types/media";
import React from "react";

interface CardImageProps {
    media: Media;
}

const notFoundSrc = "/logo.png";

const CardImage: React.FC<CardImageProps> = ({ media }) => {
    return (
        <div className="h-36 rounded-lg overflow-hidden">
            <img
                className="w-full h-auto object-cover"
                src={media?.url || notFoundSrc}
                alt="Imagen de mascota"
            />
        </div>
    );
};

export default CardImage;
