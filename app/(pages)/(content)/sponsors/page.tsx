'use client'
import { useRouter } from "next/navigation";
import sponsorsData from '@/lib/sponsors.json'
import Button from '@/components/buttons/button';
import ImageComponent from '@/components/image-component';
import { useAuth } from "@/contexts/auth-context";
import SponsorsCarousel from "@/components/sponsorsCarousel";
import { useCallback, useEffect, useState } from "react";
import { getActiveSponsors } from '@/utils/sponsor.http';
import { ActiveSponsor } from '@/types/sponsor';
import SkeletonStaticPage from '@/components/skeleton-static-page';

interface SponsorImage {
  id: number;
  url: string;
}

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [sponsorImages, setSponsorImages] = useState<SponsorImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSponsors = useCallback(async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSponsors();
  }, [fetchSponsors]);

  function handleFormSponsors() {
    router.push('/sponsors/create')
  }

  if (isLoading) {
    return <SkeletonStaticPage />;
  }

  return (
    <div className="w-full px-12">
      <ImageComponent src="/sponsor/sponsor.png" />

      <div className='text-2xl text-center px-72 my-10'>
        {sponsorsData.map((item, index) => (
          <div key={index}>
            {item.blocks.map((block, blockIndex) => (
              <div key={blockIndex}>

                {block.upDetails && (
                  <div className='mb-10'>
                    {block.upDetails.map((detail, idx) => (
                      <div className='mb-10' key={idx}>{detail.detail}</div>
                    ))}
                  </div>
                )}

                {blockIndex === 0 && <div className="mb-8 -ml-40">
                  <h3 className="text-gray-600 mb-8">Auspician este sitio:</h3>
                  {sponsorImages.length > 0 ? (
                    <div className="w-full">
                      <SponsorsCarousel images={sponsorImages} scrollStep={1} delay={15} />
                    </div>
                  ) : (
                    <div className="text-gray-400">No hay auspiciantes activos</div>
                  )}
                </div>}

                {block.downDetails && (
                  <div className='mb-8'>
                    {block.downDetails.map((detail, idx) => (
                      <div className='mb-8' key={idx}>{detail.detail}</div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {(user?.role === 'admin' || user?.role === 'organization') && (
          <Button variant="cta" size='lg' className='my-10' onClick={handleFormSponsors}>
            Quiero ser auspiciante
          </Button>
        )}

      </div>
    </div>
  )
}