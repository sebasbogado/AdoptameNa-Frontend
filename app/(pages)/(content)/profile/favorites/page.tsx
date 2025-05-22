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
import { usePagination } from '@/hooks/use-pagination';
import Pagination from '@/components/pagination';
import { Loader2 } from 'lucide-react';

const publicationsTypes = ["Adopción", "Extraviado", "Voluntariado", "Blog", "Tienda"];
const pets = ["Todos", "Conejo", "Perro", "Gato"];

export default function Page() {
  const { authToken, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedPublicationType, setSelectedPublicationType] = useState<string | null>(null);
  const [selectedPet, setSelectedPet] = useState<string | null>(null);

  // Función para cargar las publicaciones favoritas
  const [pageSize, setPageSize] = useState<number>();

  const {
    data: favorites,
    loading,
    error,
    currentPage,
    totalPages,
    updateFilters,
    handlePageChange
  } = usePagination<Favorites>({
    fetchFunction: async (page, size, filters) => {
      if (!authToken) throw new Error("Authentication token is missing");
      return await getFavorites(authToken, {
        page,
        size,
        ...filters
      });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  useEffect(() => {
        setPageSize(favorites.length)
    }, []);

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    }
  }, [authToken, authLoading, router]);

  if (authLoading) {
    return Loading();
  }
  const bannerImages = ["/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png"];

  return (
    <div className="flex flex-col gap-3">
      <Banners images={bannerImages} />

      <div className="flex flex-col gap-5">
        <div className="w-full flex flex-col items-center justify-center mb-6">
          {loading ? (
            <div className="flex justify-center items-center">
              <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
              <p className="text-gray-600">No se encontraron publicaciones favoritas</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
              {favorites.map((item) => (
                <PetCard key={item.id} post={item.post} isPost />
              ))}
            </div>
          )}
        </div>

        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          size="md"
        />
      </div>
      <div className="h-12 md:h-10" />
    </div>
  );
}
