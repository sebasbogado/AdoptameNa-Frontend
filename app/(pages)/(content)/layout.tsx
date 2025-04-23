'use client'

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import { usePathname } from "next/navigation";
import { getActiveSponsors } from '@/utils/sponsor.http';
import { ActiveSponsor } from '@/types/sponsor';

interface SponsorImage {
  id: number;
  url: string;
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const [sponsorImages, setSponsorImages] = useState<SponsorImage[]>([]);
  const pathname = usePathname();

  const fetchSponsors = useCallback(async () => {
    try {
      const sponsorsData = await getActiveSponsors();
      const sponsorsArray = sponsorsData.data;

      const images = sponsorsArray
        .map((s: ActiveSponsor) => {
          if (s.logoUrl) {
            return { id: s.id, url: s.logoUrl };
          }
          return null;
        })
        .filter((img): img is SponsorImage => img !== null);

      setSponsorImages(images);
    } catch (error) {
      console.error('Error al cargar sponsors activos:', error);
      setSponsorImages([]);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

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
        <div className="bg-white py-4 w-full">
          <SponsorsCarousel images={sponsorImages} scrollStep={1} delay={15} />
        </div>
      )}

      <Footer />
    </>
  );
}
