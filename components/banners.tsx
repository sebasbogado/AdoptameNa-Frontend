'use client'

import { Carousel } from "@material-tailwind/react";
interface CarouselProps {
  images: string[]
}
export default function Banners({ images = [] }: CarouselProps) {
  return (
    <Carousel className="rounded-xl h-126"
      loop
      autoplay
      autoplayDelay={10000}>
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