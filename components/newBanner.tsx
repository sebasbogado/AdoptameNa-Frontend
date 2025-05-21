'use client';

import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "@material-tailwind/react";
import { MediaDTO } from "@/types/user-profile"; // Keep type definition
import { ChevronLeft, ChevronRight, Maximize } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const notFoundSrc = "/logo.png"; // Default image source

// Supported video formats
const SUPPORTED_VIDEO_FORMATS = ['video/mp4', 'video/webm'];

// Define props for clarity
interface HeaderImageProps {
    medias: MediaDTO[];
}

const NewBanner: React.FC<HeaderImageProps> = ({ medias }) => {
    const [mediaItems, setMediaItems] = useState<
        { url: string; isVertical: boolean; id: number; type: 'image' | 'video' }[]
    >([]);
    const [videoDimensions, setVideoDimensions] = useState<{ [key: string]: boolean }>({});
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
    const pathname = usePathname();
    const isEditPostPage = pathname?.includes('/edit-post/');
    const bannerRef = useRef<HTMLDivElement>(null);

    const toggleFullScreen = () => {
        if (!bannerRef.current) return;

        if (!document.fullscreenElement) {
            bannerRef.current.requestFullscreen()
                .then(() => setIsFullscreen(true))
                .catch((err) => console.error("Error al activar pantalla completa:", err));
        } else {
            document.exitFullscreen();
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const processMedia = async (mediaItems: MediaDTO[]) => {
        const promises = mediaItems.map(
            (media) =>
                new Promise<{ id: number; url: string; isVertical: boolean; type: 'image' | 'video' }>(
                    (resolve) => {
                        const isVideo = SUPPORTED_VIDEO_FORMATS.some(format => media.mimeType.startsWith(format));
                        if (isVideo) {
                            resolve({ id: media.id, url: media.url, isVertical: false, type: 'video' });
                            return;
                        }

                        if (typeof window === "undefined") {
                            resolve({ id: media.id, url: media.url, isVertical: false, type: 'image' });
                            return;
                        }

                        const img = new window.Image();
                        img.src = media.url;
                        img.onload = () => {
                            const isVertical = img.naturalHeight >= img.naturalWidth;
                            resolve({ id: media.id, url: media.url, isVertical, type: 'image' });
                        };
                        img.onerror = () => {
                            console.error(`Failed to load image: ${media.url}`);
                            resolve({ id: media.id, url: media.url, isVertical: false, type: 'image' });
                        };
                    }
                )
        );
        try {
            const processed = await Promise.all(promises);
            setMediaItems(processed);
        } catch (error) {
            console.error("Error processing media:", error);
            setMediaItems(mediaItems.map(m => ({ 
                id: m.id, 
                url: m.url, 
                isVertical: false, 
                type: SUPPORTED_VIDEO_FORMATS.some(format => m.mimeType.startsWith(format)) ? 'video' : 'image' 
            })));
        }
    };

    const handleVideoLoad = (event: React.SyntheticEvent<HTMLVideoElement>, url: string) => {
        const video = event.currentTarget;
        const isVertical = video.videoHeight >= video.videoWidth;
        setVideoDimensions(prev => ({
            ...prev,
            [url]: isVertical
        }));
        setLoadingStates(prev => ({
            ...prev,
            [url]: false
        }));
    };

    const handleVideoError = (url: string) => {
        setLoadingStates(prev => ({
            ...prev,
            [url]: false
        }));
        console.error(`Error loading video: ${url}`);
    };

    const handleVideoStartLoading = (url: string) => {
        setLoadingStates(prev => ({
            ...prev,
            [url]: true
        }));
    };

    useEffect(() => {
        processMedia(medias);
    }, [medias]);

    const showArrows = mediaItems.length > 1;

    return (
        <div className={`relative flex flex-col items-center w-full ${isFullscreen ? "h-screen flex items-center justify-center" : ""}`} ref={bannerRef}>
            <div className="relative w-full flex justify-center">
                <button
                    onClick={toggleFullScreen}
                    className={`absolute z-50 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition ${
                        isFullscreen 
                            ? "top-4 right-48" 
                            : "top-4 right-24"
                    }`}
                >
                    <Maximize size={20} />
                </button>
                <Carousel 
                    key={mediaItems.length}
                    className={`rounded-xl overflow-hidden ${isFullscreen ? "h-screen" : "h-[400px]"} relative ${isFullscreen ? "w-full" : "w-4/5"}`}
                    loop={mediaItems.length > 1}
                    autoplay={mediaItems.length > 1}
                    autoplayDelay={10000}
                    placeholder="Media del Banner"
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
                            {mediaItems.length > 1 && new Array(length).fill("").map((_, i) => (
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
                    {mediaItems.length === 0 ? (
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
                        mediaItems.map((media, index) => (
                            <div
                                key={media.id || index}
                                className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/5"
                            >
                                {(media.type === 'image' && media.isVertical) || (media.type === 'video' && videoDimensions[media.url]) ? (
                                    <div
                                        className="absolute inset-0 bg-center bg-cover filter blur-lg scale-110"
                                        style={{ backgroundImage: `url(${media.url})` }}
                                        aria-hidden="true"
                                    />
                                ) : null}
                                {media.type === 'image' ? (
                                    <Image
                                        src={media.url}
                                        alt={`Imagen de portada ${index + 1}`}
                                        className={`relative z-10 h-full w-full ${media.isVertical ? "object-contain" : "object-cover"}`}
                                        width={1200}
                                        height={400}
                                        priority={index === 0}
                                        onError={(e) => {
                                            console.error(`Error loading image ${index + 1}: ${media.url}`);
                                            e.currentTarget.src = notFoundSrc;
                                        }}
                                    />
                                ) : (
                                    <>
                                        {loadingStates[media.url] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        )}
                                        <video
                                            src={media.url}
                                            className={`relative z-10 h-full w-full ${videoDimensions[media.url] ? "object-contain" : "object-cover"} ${!isEditPostPage && !isFullscreen ? "[&::-webkit-media-controls]:hidden" : ""}`}
                                            controls={isFullscreen}
                                            controlsList="nodownload noplaybackrate"
                                            disablePictureInPicture
                                            playsInline
                                            loop
                                            autoPlay
                                            muted
                                            onLoadStart={() => handleVideoStartLoading(media.url)}
                                            onLoadedMetadata={(e) => handleVideoLoad(e, media.url)}
                                            onError={() => handleVideoError(media.url)}
                                            poster={notFoundSrc}
                                        />
                                    </>
                                )}
                            </div>
                        ))
                    )}
                </Carousel>
            </div>
        </div>
    );
};

export default NewBanner;
