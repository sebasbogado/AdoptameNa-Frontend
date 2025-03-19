'use client'

import { Carousel } from "@material-tailwind/react";
interface CarouselProps {
  images: string[]
  className?: string
}

export default function Banners({ images = [], className }: CarouselProps) {
  return (
    <Carousel className={`rounded-xl overflow-hidden h-[400px] relative ${className}`}
      loop
      autoplay
      autoplayDelay={10000}
      placeholder={'Images del Banner'}
    >
      {images.map((image) => (
        <img
          src={image}
          alt="image"
          className="h-full w-full object-cover"
        />

      ))}
    </Carousel>
  );
}