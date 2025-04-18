'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import { useAuth } from '@/contexts/auth-context';
import { usePathname } from "next/navigation";

interface Sponsor {
  id: number;
  url: string;
  [key: string]: any;
}

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const { authToken } = useAuth();
  const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
  const pathname = usePathname();

  useEffect(() => {
    const fetchImagesByIds = async () => {
      const ids = [1, 2, 3, 4, 5, 6,7,8,9,10,11,12]; // los IDs de media para mostrar
      try {
        const responses = await Promise.all(
          ids.map(id =>
            axios.get(`${API_URL}/media/${id}`)
          )
        );
        const imageData = responses.map(res => ({
          id: res.data.id,
          url: res.data.url,
        }));
        setSponsors(imageData);
      } catch (error) {
        console.error("Error al cargar imágenes públicas:", error);
      }
    };
  
    fetchImagesByIds();
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
