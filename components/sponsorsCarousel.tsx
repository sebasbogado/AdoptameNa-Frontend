'use client';

import React, { useEffect, useRef } from 'react';

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
    className="carousel-container flex overflow-x-auto scroll-snap-x mandatory gap-4 px-4"
  style={{
    scrollSnapType: 'x mandatory',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE/Edge
  }}
    >
      {images.map((image) => (
        <div
          key={image.id}
          className="flex-shrink-0 w-1/4 h-[100px]"
          style={{ scrollSnapAlign: 'start' }}
        >
          <img
            src={image.url}
            alt={`Sponsor ${image.id}`}
            className="w-full h-full object-contain bg-white"
          />
        </div>
      ))}
    </div>
  );
}
