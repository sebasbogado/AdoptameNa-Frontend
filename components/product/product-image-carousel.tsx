"use client"

import { useState, useEffect } from "react"
import { Carousel, IconButton } from "@material-tailwind/react"
import Image from "next/image"

// Utilizamos la interfaz Media que ya tienes definida
export interface Media {
  id: number
  mimeType: string
  url: string
  userId: number
  uploadDate: string
}

interface ProductImageCarouselProps {
  media: Media[]
  className?: string
}

export default function ProductImageCarousel({ media, className = "" }: ProductImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Verificamos si hay imágenes disponibles
  const hasImages = media && media.length > 0

  // Función para cambiar la imagen activa
  const handleThumbnailClick = (index: number) => {
    setActiveIndex(index)
  }

  // Función para ir a la siguiente imagen
  const nextImage = () => {
    if (hasImages) {
      setActiveIndex((prev) => (prev === media.length - 1 ? 0 : prev + 1))
    }
  }

  // Función para ir a la imagen anterior
  const prevImage = () => {
    if (hasImages) {
      setActiveIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1))
    }
  }

  // Reiniciar el estado cuando cambian las imágenes
  useEffect(() => {
    setActiveIndex(0)
    setIsImageLoaded(false)
  }, [media])

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
              onClick={() => handleThumbnailClick(index)}
              className={`relative min-w-[80px] md:min-w-0 md:w-full h-20 border-2 rounded-md overflow-hidden transition-all ${activeIndex === index ? "border-blue-500 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
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

      <div className="relative w-10 h-96 bg-gray-100 rounded-lg overflow-hidden flex-grow">
        <Carousel
          className="h-full"
          navigation={({ setActiveIndex }) => (
            <div className="absolute bottom-4 left-2/4 z-10 flex -translate-x-2/4 gap-2">
              {media.map((_, i) => (
                <span
                  key={i}
                  className={`block h-2 w-2 cursor-pointer rounded-full transition-colors ${activeIndex === i ? "bg-white" : "bg-white/50"
                    }`}
                  onClick={() => setActiveIndex(i)}
                />
              ))}
            </div>
          )}
          prevArrow={({ handlePrev }) => (
            <IconButton
              variant="text"
              color="black"
              size="lg"
              onClick={() => {
                handlePrev()
                prevImage()
              }}
              className="!absolute top-2/4 left-4 -translate-y-2/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </IconButton>
          )}
          nextArrow={({ handleNext }) => (
            <IconButton
              variant="text"
              color="black"
              size="lg"
              onClick={() => {
                handleNext()
                nextImage()
              }}
              className="!absolute top-2/4 right-4 -translate-y-2/4"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </IconButton>
          )}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        >
          {media.map((item, index) => (
            <div key={item.id} className="h-full w-full flex items-center justify-center">
              <Image
                src={item.url || "/placeholder.svg"}
                alt={`Imagen de producto ${index + 1}`}
                width={600}
                height={600}
                className={`h-full w-full object-contain transition-opacity duration-300 ${isImageLoaded ? "opacity-100" : "opacity-0"
                  }`}
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
