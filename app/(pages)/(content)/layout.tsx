'use client'

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import { usePathname } from "next/navigation";
import { getSponsors } from '@/utils/sponsors.http';
import { getMediaById } from '@/utils/media.http';
import { Sponsor } from "@/types/sponsor";

interface SponsorImage {
  id: number;
  url: string;
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [sponsorImages, setSponsorImages] = useState<SponsorImage[]>([]);
  const pathname = usePathname();
  const pageSize = 5;
  const pageNumber = 0;
  const sort = "id,desc";

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const sponsorsData = await getSponsors({ sort, size: pageSize, page: pageNumber });
        const sponsorsArray = sponsorsData.data;
        setSponsors(sponsorsArray);

        const images = await Promise.all(
          sponsorsArray
            .filter((s) => s.logoId)
            .map(async (s) => {
              const media = await getMediaById(s.logoId);
              return {
                id: s.id,
                url: media.url,
              };
            })
        );

        setSponsorImages(images);
      } catch (error) {
        console.error('Error al cargar imágenes de sponsors:', error);
      }
    };

    fetchSponsors();
  }, []);

  const allowedRoutes = [
    "/dashboard",
    "/volunteering",
    "/adoption",
    "/missing",
    "/blog",
    "/marketplace",
  ];
  const showCarousel = allowedRoutes.includes(pathname);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
      </div>

      {showCarousel && sponsorImages.length > 0 && (
        <div className="bg-white py-4">
          <SponsorsCarousel images={sponsorImages} scrollStep={1} delay={15} />
        </div>
      )}

      <Footer />
    </>
  );
}
