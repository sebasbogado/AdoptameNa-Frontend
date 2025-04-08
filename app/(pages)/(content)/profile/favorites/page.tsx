'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuth } from '@/contexts/auth-context';
import { getFavorites } from '@/utils/favorites-posts.http';
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import LabeledSelect from '@/components/labeled-selected';
import Footer from '@/components/footer';
import Loading from '@/app/loading';
import { Favorites } from '@/types/favorites';

const publicationsTypes = ["Adopción","Extraviado","Voluntariado","Blog","Tienda"];
const pets = ["Todos", "Conejo", "Perro", "Gato"];

export default function Page() {
  const { authToken, loading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<Favorites[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [selectedPublicationType, setSelectedPublicationType] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Función para cargar las publicaciones favoritas
  const fetchFavorites = async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getFavorites(token);
      setFavorites(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !authToken) {
      console.log("authLoading", authLoading);
      console.log("authToken", authToken);
      router.push("/auth/login");
    }
  }, [authToken, authLoading, router]);

  useEffect(() => {
    if (authLoading || !authToken) return;

    fetchFavorites(authToken);
  }, [authToken, authLoading]);

  // Uso de la página de loading ya implementada
  if (authLoading) {
    return Loading();
  }

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
              <PetCard key={fav.post.id} post={fav.post} isPost/>
            ))
          ) : (
            <p className="text-center col-span-full">
              No tienes publicaciones favoritas.
            </p>
          )}
        </div>
      </section>
      <div className="h-12 md:h-10" />
    </div>
  );
}
