// components/SponsorsCarousel.tsx
'use client'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import { FreeMode, Autoplay } from 'swiper/modules';

interface Props {
    images: { id: number; url: string }[];
    className?: string;
}

export default function SponsorsCarousel({ images, className }: Props) {
    return (
        <Swiper
            modules={[FreeMode, Autoplay]}
            slidesPerView={4}
            spaceBetween={20}
            freeMode={true}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            loop
            className={`w-full px-4 ${className}`}
        >
            {images.map((image) => (
                <SwiperSlide key={image.id}>
                    <img
                        src={image.url}
                        alt={`Sponsor ${image.id}`}
                        className="w-full h-[100px] object-contain bg-transparent"
                    />

                </SwiperSlide>
            ))}
        </Swiper>
    );
}
