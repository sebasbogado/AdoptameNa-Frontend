'use client';

import React, { useState, useEffect } from "react";
import { Carousel } from "@material-tailwind/react";
import { MediaDTO } from "@/types/user-profile"; // Keep type definition
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const notFoundSrc = "/logo.png"; // Default image source

// Define props for clarity
interface HeaderImageProps {
    medias: MediaDTO[];
}

const NewBanner: React.FC<HeaderImageProps> = ({ medias }) => {
    const [images, setImages] = useState<
        { url: string; isVertical: boolean; id: number }[]
    >([]);

    const checkOrientation = async (mediaItems: MediaDTO[]) => {
        const promises = mediaItems.map(
            (media) =>
                new Promise<{ id: number; url: string; isVertical: boolean }>(
                    (resolve) => {
                        if (typeof window === "undefined") {
                            resolve({ id: media.id, url: media.url, isVertical: false });
                            return;
                        }
                        const img = new window.Image();
                        img.src = media.url;
                        img.onload = () => {
                            const isVertical = img.naturalHeight >= img.naturalWidth;
                            resolve({ id: media.id, url: media.url, isVertical });
                        };
                        img.onerror = () => {
                            console.error(`Failed to load image: ${media.url}`);
                            resolve({ id: media.id, url: media.url, isVertical: false });
                        };
                    }
                )
        );
        try {
            const processed = await Promise.all(promises);
            setImages(processed);
        } catch (error) {
            console.error("Error processing image orientations:", error);
            setImages(mediaItems.map(m => ({ ...m, isVertical: false })));
        }
    };

    useEffect(() => {
        checkOrientation(medias);
    }, [medias]);

    const showArrows = images.length > 1;

    return (
        <div className="relative flex flex-col items-center w-full">
            <div className="relative w-full flex justify-center">
                <Carousel 
                    key={images.length}
                    className="rounded-xl overflow-hidden h-[400px] relative w-4/5"
                    loop={images.length > 1}
                    autoplay={images.length > 1}
                    autoplayDelay={10000}
                    placeholder="Imagen del Banner"
                    prevArrow={({ handlePrev }) =>
                        showArrows ? (
                            <button
                                onClick={handlePrev}
                                className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>
                        ) : null
                    }
                    nextArrow={({ handleNext }) =>
                        showArrows ? (
                            <button
                                onClick={handleNext}
                                className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        ) : null
                    }
                    navigation={({ setActiveIndex, activeIndex, length }) => (
                        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                            {images.length > 1 && new Array(length).fill("").map((_, i) => (
                                <span
                                    key={i}
                                    className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                                        }`}
                                    onClick={() => setActiveIndex(i)}
                                />
                            ))}
                        </div>
                    )}
                >
                    {images.length === 0 ? (
                        <div className="relative w-full h-full flex items-center justify-center bg-gray-200">
                            <Image
                                src={notFoundSrc}
                                alt="Imagen por defecto"
                                className="h-auto w-auto max-h-full max-w-full object-contain"
                                width={500}
                                height={500}
                                priority
                            />
                        </div>
                    ) : (
                        images.map((image, index) => (
                            <div
                                key={image.id || index}
                                className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5"
                            >
                                {image.isVertical && (
                                    <div
                                        className="absolute inset-0 bg-center bg-cover filter blur-lg scale-110"
                                        style={{ backgroundImage: `url(${image.url})` }}
                                        aria-hidden="true"
                                    />
                                )}
                                <Image
                                    src={image.url}
                                    alt={`Imagen de portada ${index + 1}`}
                                    className={`relative z-10 h-full w-full ${image.isVertical ? "object-contain" : "object-cover"
                                        }`}
                                    width={1200}
                                    height={400}
                                    priority={index === 0}
                                    onError={(e) => {
                                        console.error(`Error loading image ${index + 1}: ${image.url}`);
                                    }}
                                />
                            </div>
                        ))
                    )}
                </Carousel>
            </div>
        </div>
    );
};

export default NewBanner;