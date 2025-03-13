'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/authContext';
import { getFavorites } from '@/utils/favorites-posts.http';
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import LabeledSelect from '@/components/labeled-selected';
import Footer from '@/components/footer';

const publicationsTypes = ["Adopción","Extraviado","Voluntariado","Blog","Tienda"];
const pets = ["Todos", "Conejo", "Perro", "Gato"];

export default function Page() {
  const { authToken, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [selectedPublicationType, setSelectedPublicationType] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !authToken) {
      console.log("authLoading", authLoading);
      console.log("authToken", authToken);
      router.push("/auth/login");
    }
  }, [authToken, authLoading, router]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (!authToken) return;
        const data = await getFavorites(authToken);
        setFavorites(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (authToken) {
      fetchFavorites();
    }
  }, [authToken]);

  if (loading) return <p>Cargando favoritos...</p>;
  if (error) return <p>Error: {error}</p>;

  const bannerImages = ["../banner1.png","../banner2.png","../banner3.png","../banner4.png"];

  return (
    <div className="flex flex-col gap-3">
      <Banners images={bannerImages} />
      <div className="w-full max-w-2xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Select Tipo de publicación */}
          <LabeledSelect
            label="Tipo de publicación"
            options={publicationsTypes}
            selected={selectedPublicationType}
            setSelected={setSelectedPublicationType}
          />

          {/* Select Mascota */}
          <LabeledSelect
            label="Mascota"
            options={pets}
            selected={selectedPet}
            setSelected={setSelectedPet}
          />
        </div>
      </div>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <PetCard key={fav.post.id} post={fav.post} />
            ))
          ) : (
            <p className="text-center col-span-full">
              No tienes publicaciones favoritas.
            </p>
          )}
        </div>
      </section>
      <div className="h-12 md:h-10" />
      <Footer />
    </div>
  );
}
