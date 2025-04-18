"use client";

import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { getPets } from "@/utils/pets.http";
import { PET_STATUS } from "@/types/constants";
import PetCard from "@/components/petCard/pet-card";
import { Loader2 } from "lucide-react";

export default function Page() {
  const pageSize = 20;
  const sort = "id,desc";

  const {
    data: pets,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination({
    fetchFunction: async (page, size) => {
      return await getPets({
        page,
        size,
        sort,
        petStatusId: [PET_STATUS.MISSING, PET_STATUS.ADOPTION]
      });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Mascotas desaparecidas o en adopción
      </h1>

      <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
            {error.message || "Error al cargar mascotas"}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
            <p className="text-gray-600">No se encontraron mascotas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {pets.map((pet) => (
              <PetCard key={pet.id} post={pet} />
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
  );
}
