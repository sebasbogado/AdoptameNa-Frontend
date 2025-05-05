'use client';

import { useState, useEffect } from "react";
import { getMyAdoptionRequests } from "@/utils/adoptions.http";
import { getPet } from "@/utils/pets.http";
import { useAuth } from "@/contexts/auth-context";
import { usePagination } from "@/hooks/use-pagination";
import { AdoptionResponse } from "@/types/adoption-response";
import { Pet } from "@/types/pet";
import AdoptionRequestCard from "@/components/profile/received-request/adoption-request-card";
import Pagination from "@/components/pagination";

export default function SentRequests() {
  const { authToken } = useAuth();
  const [petMap, setPetMap] = useState<Record<number, Pet>>({});
  
  // Llamada a la API usando el hook usePagination
  const {
    data: sentRequests,
    loading,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination<AdoptionResponse>({
    fetchFunction: async (page, size) => await getMyAdoptionRequests(authToken!, { page, size }),
    initialPage: 1,
    initialPageSize: 10
  });

  // Obtener las mascotas asociadas
  useEffect(() => {
    if (sentRequests) {
      const loadPets = async () => {
        const petIds = [...new Set(sentRequests.map(req => req.petId))];
        const petEntries = await Promise.all(
          petIds.map(id => getPet(id.toString()).then(pet => ({ id, pet })).catch(() => null))
        );
        const newPetMap: Record<number, Pet> = {};
        petEntries.forEach(entry => {
          if (entry?.pet) newPetMap[entry.id] = entry.pet;
        });
        setPetMap(newPetMap);
      };
      loadPets();
    }
  }, [sentRequests]);

  const visibleRequests = sentRequests.filter(request => request.isAccepted !== false);

  return (
    <div className="p-8 flex flex-wrap gap-6">
      {loading ? (
        <p className="text-center">Cargando solicitudes...</p>
      ) : visibleRequests.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
          <p className="text-gray-600">No se encontraron solicitudes de adopción</p>
        </div>
      ) : (
        visibleRequests.map(request => {
          const pet = petMap[request.petId];
          return pet ? (
            <AdoptionRequestCard
              key={request.id}
              petImage={pet.media?.[0]}
              petName={pet.name}
              status={request.isAccepted}
            />
          ) : null;
        })
      )}
      {visibleRequests.length > 0 &&
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          size="md"
        />
      }
    </div>
  );
}
