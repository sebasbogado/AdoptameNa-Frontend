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
const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'];

const CardImage: React.FC<CardImageProps> = ({ media, className = "", isBlogCard }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [imageSrc, setImageSrc] = useState<string>(notFoundSrc);

    useEffect(() => {
        const handleVideoFrame = async () => {
            const isVideo = media?.mimeType && SUPPORTED_VIDEO_FORMATS.some(format => media.mimeType.startsWith(format));
            
            if (isVideo && media?.url) {
                try {
                    // Crear un elemento video temporal
                    const video = document.createElement('video');
                    video.crossOrigin = "anonymous";
                    video.muted = true;
                    video.playsInline = true;
                    video.preload = 'metadata';
                    video.src = media.url;

                    // Esperar a que el video esté listo y en el primer frame
                    await new Promise((resolve, reject) => {
                        video.onloadeddata = () => {
                            video.currentTime = 0;
                            resolve(true);
                        };
                        video.onerror = reject;
                    });

                    // Asegurarnos de que estamos en el primer frame
                    await new Promise(resolve => {
                        video.onseeked = resolve;
                        video.currentTime = 0;
                    });

                    // Extraer el primer frame
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                        try {
                            const frameUrl = canvas.toDataURL('image/jpeg');
                            setImageSrc(frameUrl);
                        } catch (err) {
                            // Si el canvas está tainted, mostrar imagen por defecto
                            setImageSrc(notFoundSrc);
                        }
                    } else {
                        setImageSrc(notFoundSrc);
                    }

                    // Limpiar el video temporal
                    video.remove();
                } catch (error) {
                    console.error('Error extracting video frame:', error);
                    setImageSrc(notFoundSrc);
                }
            } else {
                const newSrc = (media && media.url) ? media.url : notFoundSrc;
                if (newSrc !== imageSrc) {
                    setIsLoading(true);
                    setImageSrc(newSrc);
                }
            }
            setIsLoading(false);
        };

        handleVideoFrame();
    }, [media, imageSrc]);

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
                onLoad={() => setIsLoading(false)}
                priority
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
