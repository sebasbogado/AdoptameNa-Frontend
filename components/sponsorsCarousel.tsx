'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
interface Props {
  images: { id: number; url: string }[];
  className?: string;
}

export default function SponsorsCarousel({ images, className }: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;
    const scrollStep = 1; // Ajusta la velocidad de desplazamiento
    const delay = 15; // Intervalo en milisegundos entre cada desplazamiento

    const scrollInterval = setInterval(() => {
      if (carousel.scrollWidth - carousel.clientWidth === scrollAmount) {
        scrollAmount = 0;
      } else {
        scrollAmount += scrollStep;
      }
      carousel.scrollTo({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }, delay);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div
      ref={carouselRef}
      className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 no-scrollbar"
      style={{
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
      }}
    >
      {images.map((image) => (
      <div
        key={image.id}
        className="flex-shrink-0 w-1/2 sm:w-1/3 md:w-1/4 aspect-[2/1] snap-start relative"
      >
        <Image
          src={image.url}
          alt={`Sponsor ${image.id}`}
          fill
          className="object-contain bg-white"
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
        />
      </div>
    ))}
    </div>
  );
}
