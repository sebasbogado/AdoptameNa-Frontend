'use client'

import { Carousel } from "@material-tailwind/react";
import Image from "next/image";

interface CarouselProps {
  images: string[]
  className?: string
}

export default function Banners({ images = [], className }: CarouselProps) {
  return (
    <Carousel
      className={`rounded-xl overflow-hidden h-[400px] relative ${className}`}
      loop
      autoplay
      autoplayDelay={10000}
      placeholder={'Images del Banner'}
    >
      {images.map((image, index) => (
        <div key={index} className="relative h-[400px] w-full">
          <Image
            src={image}
            alt={`banner-image-${index}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={index === 0}
          />
        </div>
      ))}
    </Carousel>
  );
}
