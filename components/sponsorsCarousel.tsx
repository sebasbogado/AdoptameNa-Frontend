'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface Props {
  images: { id: number; url: string }[];
  className?: string;
  scrollStep?: number;
  delay?: number;
}

export default function SponsorsCarousel({
  images,
  className,
  scrollStep = 1,
  delay = 15
}: Props) {
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let scrollAmount = 0;

    const scrollInterval = setInterval(() => {
      if (carousel.scrollWidth - carousel.clientWidth <= scrollAmount) {
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
  }, [scrollStep, delay]);

  return (
    <div
      ref={carouselRef}
      className={`flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 no-scrollbar ${className || ''}`}
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
            className="object-contain"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
          />
        </div>
      ))}
    </div>
  );
}
