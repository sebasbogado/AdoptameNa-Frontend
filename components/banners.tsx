'use client'

import { Carousel } from "@material-tailwind/react";
 
export default function Banners() {
  return (
     <Carousel className="rounded-xl h-96"
     loop
     autoplay
     autoplayDelay={10000}>
      <img
        src="img-slider-1.png"
        alt="image 1"
        className="h-full w-full object-cover"
      />
      <img
        src="img-slider-2.png"
        alt="image 2"
        className="h-full w-full object-cover"
      />
      <img
        src="img-slider-3.png"
        alt="image 3"
        className="h-full w-full object-cover"
      />
       <img
        src="img-slider-4.png"
        alt="image 4"
        className="h-full w-full object-cover"
      />
    </Carousel>
  );
}