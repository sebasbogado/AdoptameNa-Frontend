'use client'

import React, { useEffect, useState, useCallback } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import Banners from "@/components/banners";
import { usePathname } from "next/navigation";
import { getActiveSponsors } from '@/utils/sponsor.http';
import { ActiveSponsor } from '@/types/sponsor';

interface SponsorImage {
  id: number;
  url: string;
}

interface Banner {
  id: number;
  imageUrl: string;
  priority: number;
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const [sponsorImages, setSponsorImages] = useState<SponsorImage[]>([]);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
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

  const fetchBanners = useCallback(async () => {
    try {
      const response = await fetch('https://adoptamena-api.rodrigomaidana.com/api/banners/public');
      if (!response.ok) {
        throw new Error('Error al obtener banners');
      }
      const data: Banner[] = await response.json();
      const bannerUrls = data.map(banner => banner.imageUrl);
      setBannerImages(bannerUrls);
    } catch (error) {
      console.error('Error al cargar banners:', error);
      setBannerImages([]);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
    fetchBanners();
  }, [fetchSponsors, fetchBanners]);

  const allowedRoutes = [
    "/dashboard",
    "/volunteering",
    "/adoption",
    "/missing",
    "/blog",
    "/marketplace",
  ];
  const showCarousel = allowedRoutes.includes(pathname);
  const showBanners = allowedRoutes.includes(pathname);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {showBanners && bannerImages.length > 0 && (
          <Banners images={bannerImages} />
        )}
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
