import React from "react";

interface CardImageProps {
    image?: string;
}

const notFoundSrc = "logo.png";

const CardImage: React.FC<CardImageProps> = ({ image }) => {
    return (
        <div className="h-36 rounded-lg overflow-hidden">
            <img
                className="w-full h-auto object-cover"
                src={image || notFoundSrc}
                alt="Imagen de mascota"
            />
        </div>
    );
};

export default CardImage;
