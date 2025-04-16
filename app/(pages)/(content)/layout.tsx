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
    const fetchSponsors = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/media?page=0&size=25&sort=id,asc`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        const shuffled = response.data.data.sort(() => 0.5 - Math.random());
        setSponsors(shuffled);
      } catch (error) {
        console.error("Error al obtener auspiciantes:", error);
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
