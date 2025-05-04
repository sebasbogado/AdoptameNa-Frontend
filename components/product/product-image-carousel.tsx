"use client"

import { useState, useEffect } from "react"
import { Carousel, IconButton } from "@material-tailwind/react"
import Image from "next/image"
import { Media } from "@/types/media"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Utilizamos la interfaz Media que ya tienes definida

interface ProductImageCarouselProps {
  media: Media[]
  className?: string
}

export default function ProductImageCarousel({ media, className = "" }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const hasImages = media && media.length > 0
  const [images, setImages] = useState<{ url: string; isVertical: boolean; id: number }[]>([]);
  const showArrows = images.length > 1

  const checkOrientation = async (mediaItems: Media[]) => {
    if(!mediaItems || mediaItems.length === 0) return;
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

  // Función para cambiar la imagen activa
  const handleThumbnailClick = (index: number) => {
    console.log("Thumbnail clicked:", index)
    setActiveIndex(index)
  }

  // Reiniciar el estado cuando cambian las imágenes
  useEffect(() => {
    setActiveIndex(0)
    setIsImageLoaded(false)
    checkOrientation(media)
  }, [media])
  useEffect(() => console.log(showArrows), [showArrows])

  if (!hasImages) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className={`flex flex-col md:flex-row gap-4 px-6 ${className}`}>
      {media.length > 1 && (
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:h-96 md:w-24 pb-2 md:pb-0 md:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {media.map((item, index) => (
            <button
              key={item.id}
              // onClick={() => handleThumbnailClick(index)}
              className={`relative min-w-[80px] md:min-w-0 md:w-full h-20 border-2 rounded-md overflow-hidden transition-all ${activeIndex === index ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
            >
              <Image
                src={item.url || "/placeholder.svg"}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
                onClick={() => handleThumbnailClick(index)}
              />
            </button>
          ))}
        </div>
      )}

      <div className="relative w-10 h-96 bg-gray-100 rounded-lg overflow-hidden flex-grow">
        <Carousel
          loop
          autoplay
          autoplayDelay={10000}
          className="h-full"
          navigation={({ setActiveIndex, activeIndex, length }) => (
            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
              {images.length > 1 && new Array(length).fill("").map((_, i) => (
                <span
                  key={i}
                  className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"}`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
          prevArrow={({ handlePrev }) => (
            showArrows && (
              <button
                onClick={handlePrev}
                className="!absolute top-2/4 left-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )
          )}
          nextArrow={({ handleNext }) => (
            showArrows && (
              <button
                onClick={handleNext}
                className="!absolute top-2/4 right-4 -translate-y-2/4 rounded-full p-2 z-20 bg-black/30 hover:bg-black/50 transition-colors"
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )
          )}
        >
          {media.map((item, index) => (
            <div key={item.id} className="h-full w-full flex items-center justify-center">
              <Image
                src={item.url}
                alt={`Product-image ${index + 1}`}
                width={600}
                height={600}
                className={`h-full w-full object-contain transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setIsImageLoaded(true)}
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  )
}
