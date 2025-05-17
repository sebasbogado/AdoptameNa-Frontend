"use client"

import { useState, useEffect, useCallback } from "react"; // Agregado useCallback
import { Carousel } from "@material-tailwind/react";
import Image from "next/image";
import { Media } from "@/types/media";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductImageCarouselProps {
  media: Media[];
  className?: string;
}

export default function ProductImageCarousel({ media, className = "" }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState<number>(0); // Nuestro estado para el índice activo

  // Estado para guardar la función setActiveIndex que nos da el Carousel a través de `navigation`
  const [carouselControlApi, setCarouselControlApi] = useState<{
    setActiveIndex?: (index: number) => void;
  } | null>(null);

  // El estado `images` es el que usas para renderizar, ya incluye `isVertical`
  const [images, setImages] = useState<{ url: string; isVertical: boolean; id: number }[]>([]);
  const showArrows = images.length > 1;
  const hasImages = media?.length > 0;

  const checkOrientation = async (mediaItems: Media[]) => {
    if (!mediaItems || mediaItems.length === 0) {
      setImages([]);
      return;
    }
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
    if (index !== activeIndex) {
      setActiveIndex(index); // Actualiza nuestro estado local
      // Si tenemos la función de control del carrusel, le decimos que cambie al nuevo índice
      if (carouselControlApi?.setActiveIndex) {
        carouselControlApi.setActiveIndex(index);
      }
    }
  };

  // Efecto para reiniciar cuando `media` cambia
  useEffect(() => {
    setActiveIndex(0);
    checkOrientation(media);
    // También queremos que el carrusel se reinicie a 0 si tenemos su control
    if (carouselControlApi?.setActiveIndex) {
      carouselControlApi.setActiveIndex(0);
    }
  }, [media]);

  useEffect(() => {
    if (carouselControlApi?.setActiveIndex) {
      carouselControlApi.setActiveIndex(activeIndex);
    }
  }, [activeIndex, carouselControlApi]);


  // Render prop para la navegación (lo usamos para capturar la API y opcionalmente renderizar puntos)
  const navigationRenderProp = useCallback(
    (navProps: {
      setActiveIndex: (index: number) => void;
      activeIndex: number; // Este es el índice interno del Carousel
      length: number;
    }) => {
      const { setActiveIndex: carouselApiSetIdx, activeIndex: carouselInternalIdx } = navProps;

      // Capturar la API del carrusel para poder controlarlo desde fuera
      useEffect(() => {
        // Guardamos la función setActiveIndex del carrusel en nuestro estado
        // Solo lo hacemos si es diferente para evitar re-renders innecesarios si la ref es estable
        if (carouselControlApi?.setActiveIndex !== carouselApiSetIdx) {
          setCarouselControlApi({ setActiveIndex: carouselApiSetIdx });
        }

        // Sincronizar nuestro activeIndex si el carrusel cambia internamente
        // (ej. si tuvieras autoplay o puntos de navegación internos que el usuario usa)
        if (carouselInternalIdx !== activeIndex) {
          // Usar queueMicrotask para evitar el error "setState in render"
          queueMicrotask(() => {
            setActiveIndex(carouselInternalIdx);
          });
        }
        // `carouselControlApi` y `activeIndex` están aquí como dependencias porque
        // los usamos en las condiciones del efecto.
      }, [carouselApiSetIdx, carouselInternalIdx, carouselControlApi, activeIndex]);

      return (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {images.length > 1 && new Array(navProps.length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                // Usamos `activeIndex` (nuestro estado) para el estilo del punto activo
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
              onClick={() => {
                // Al hacer clic en un punto, actualizamos nuestro estado y le decimos al carrusel que cambie.
                setActiveIndex(i);
                if (carouselApiSetIdx) {
                  carouselApiSetIdx(i);
                }
              }}
            />
          ))}
        </div>
      );
    },
    [images.length, activeIndex]
  );

  if (!hasImages) {
    return (
      <div className="flex items-center justify-center w-full h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-500">No hay imágenes disponibles</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col md:flex-row gap-4 px-6 ${className}`}>
      {/* Miniaturas */}
      {images.length > 1 && (
        <div className="flex md:flex-col overflow-x-auto md:overflow-y-auto gap-2 md:h-96 md:w-24 pb-2 md:pb-0 md:pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {images.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleThumbnailClick(index)}
              className={`relative min-w-[80px] md:min-w-0 md:w-full h-20 border-2 rounded-md overflow-hidden transition-all ${activeIndex === index ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"
                }`}
            >
              <Image
                src={item.url || "/placeholder.svg"}
                alt={`Miniatura ${index + 1}`}
                fill
                sizes="(max-width: 768px) 80px, 96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Carousel Principal */}
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden flex-grow">
        <Carousel
          loop={images.length > 1}
          autoplay
          className="h-full"
          navigation={navigationRenderProp}
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
          {images.map((item, index) => (
            <div key={item.id} className="h-full w-full flex items-center justify-center">
              <Image
                src={item.url} // Añadir placeholder por si url es undefined
                alt={`Product-image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // AJUSTA ESTO
                className={`transition-opacity duration-300 ${item.isVertical ? 'object-contain' : 'object-cover' // object-fit sigue aplicando
                  }`} // Ya no necesitas w-full h-full en la imagen, fill se encarga.
                priority={index === 0}
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
}