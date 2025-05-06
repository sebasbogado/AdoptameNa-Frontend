'use client';

import { useState, useEffect } from "react";
import { getSentAdoptionRequests } from "@/utils/adoptions.http";
import { getPet } from "@/utils/pets.http";
import { useAuth } from "@/contexts/auth-context";
import { usePagination } from "@/hooks/use-pagination";
import { AdoptionResponse } from "@/types/adoption-response";
import { Pet } from "@/types/pet";
import AdoptionRequestCard from "@/components/profile/received-request/adoption-request-card";
import Pagination from "@/components/pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";

export default function SentRequests() {
  const { authToken, user } = useAuth();
  const [petMap, setPetMap] = useState<Record<number, Pet>>({});
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  
  // Llamada a la API usando el hook usePagination
  const {
    data: sentRequests,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    updateFilters,
  } = usePagination<AdoptionResponse>({
    fetchFunction: async (page, size, filters) => {
      if (!user?.id) {
        return {
          data: [],
          pagination: {
            page: 0,
            size: 10,
            totalPages: 0,
            totalElements: 0,
            last: true,
          },
        };
      }
      return await getSentAdoptionRequests(authToken!, { 
        page, 
        size, 
        userId: user?.id,
        isAccepted: filters?.isAccepted === "true" ? true
          : filters?.isAccepted === "false"? false
          : undefined, 
      });
    },
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

  const visibleRequests = sentRequests.filter(request => request.isAccepted !== undefined);

  const resetFilters = () => {
    setSelectedStatus(null);
    handlePageChange(1);
    updateFilters({});
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full max-w-7xl mx-auto p-4">
        {visibleRequests.length > 0 &&
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

          <LabeledSelect
            label="Estados"
            options={["Todos", "Pendientes", "Aceptados"]}
            selected={selectedStatus}
            setSelected={(value) => {
              setSelectedStatus(value);
              if (value === "Aceptados") updateFilters({ isAccepted: "true" });
              else if (value === "Pendientes") updateFilters({ isAccepted: "false" });
              else updateFilters({ isAccepted: undefined });
            }}
          />

          <ResetFiltersButton onClick={resetFilters} />

        </div>
        }
      </div>
    <div className="w-full flex flex-col items-center justify-center mb-6">
      {loading ? (
        <p className="text-center">Cargando solicitudes...</p>
          ) : visibleRequests.length === 0 ? (
            <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
              <p className="text-gray-600">No se encontraron solicitudes de adopción</p>
            </div>
          ) : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {visibleRequests.map(request => {
              const pet = petMap[request.petId];
              return pet ? (
                <AdoptionRequestCard
                  key={request.id}
                  petImage={pet.media?.[0]}
                  petName={pet.name}
                  status={request.isAccepted}
                  requesterBreed={pet.breed?.name ?? ""}
                  requesterPetType={pet.animal.name ?? ""}
                  owner={pet.userFullName}
                />
              ) : null;
            })}
          </div>
          )}
    </div>
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
