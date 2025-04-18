import { Media } from "@/types/media";
import React from "react";

interface CardImageProps {
    media?: Media[];
}

const notFoundSrc = "/logo.png";

const CardImage: React.FC<CardImageProps> = ({ media }) => {
    const imageUrl = media && media.length > 0 ? media[0].url : notFoundSrc;
    return (
        <div className="flex gap-2 overflow-x-auto h-36 rounded-lg">
            <img
                className="w-full h-auto object-cover"
                src={imageUrl || notFoundSrc}
                alt="Imagen de publicación"
            />
        </div>
    );
};


export default CardImage;
