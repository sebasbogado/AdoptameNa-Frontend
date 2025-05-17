import { Media } from "@/types/media";
import Image from "next/image";
import React from "react";

interface CardImageProps {
    media: Media;
    className?: string;
}

const notFoundSrc = "/logo.png";

const CardImage: React.FC<CardImageProps> = ({ media, className = "" }) => {
    
    return (
    <div className={`relative h-full w-full ${className}`}>
              <Image
                src={media?.url || notFoundSrc}
                alt={media?.alt || "Image not available"}
                fill
                className="object-cover"
      />
        </div>
    );
};

export default CardImage;
