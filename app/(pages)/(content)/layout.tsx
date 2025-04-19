'use client'

import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import { usePathname } from "next/navigation";
import { getSponsors } from '@/utils/sponsors.http';
interface Sponsor {
  id: number;
  url: string;
  [key: string]: any;
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const pathname = usePathname();

  useEffect(() => {
    const fetchSponsors = async () => {
      const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // IDs de las imágenes a mostrar
      try {
        const data = await getSponsors(ids);
        setSponsors(data);
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

      {showCarousel && sponsors.length > 0 && (
        <div className="bg-white py-4">
          <SponsorsCarousel images={sponsors} />
        </div>
      )}

      <Footer />
    </>
  );
}
