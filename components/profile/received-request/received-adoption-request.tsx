'use client';

import { useState, useEffect } from "react";
import { acceptAdoptionRequest, getAdoptionsResponse, rejectAdoptionRequest } from "@/utils/adoptions.http";
import { getPet } from "@/utils/pets.http";
import { useAuth } from "@/contexts/auth-context";
import { usePagination } from "@/hooks/use-pagination";
import { AdoptionResponse } from "@/types/adoption-response";
import { Pet } from "@/types/pet";
import AdoptionRequestCard from "@/components/profile/received-request/adoption-request-card";
import Pagination from "@/components/pagination";

export default function ReceivedRequests() {
  const { authToken, user } = useAuth();
  const [petMap, setPetMap] = useState<Record<number, Pet>>({});
  
  // Llamada a la API usando el hook usePagination
  const {
    data: paginatedRequests,
    loading,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination<AdoptionResponse>({
    fetchFunction: async (page, size) => await getAdoptionsResponse(authToken!, { page, size }),
    initialPage: 1,
    initialPageSize: 10
  });

  console.log("hola esto es",paginatedRequests);

  useEffect(() => {
    if (paginatedRequests && paginatedRequests.length > 0) {
      const loadPets = async () => {
        const petIds = [...new Set(paginatedRequests.map(req => req.petId))];
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
  }, [paginatedRequests]);

  const handleAccept = async (id: number) => {
    try {
      await acceptAdoptionRequest(id, authToken!);
      // Actualizar el estado de la solicitud después de aceptarla
      setPetMap({});
      handlePageChange(currentPage);
    } catch (error) {
      console.error("Error al aceptar solicitud", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectAdoptionRequest(id, authToken!);
      // Eliminar la solicitud rechazada del estado
      setPetMap({});
      handlePageChange(currentPage);
    } catch (error) {
      console.error("Error al rechazar solicitud", error);
    }
  };

  const visibleRequests = paginatedRequests.filter(request => {
    const pet = petMap[request.petId];
    return pet && pet.userId === user?.id && request.isAccepted === false;
  });

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
              requesterName={request.fullName}
              requesterPhone={request.phone}
              requesterEmail={request.email}
              onAccept={handleAccept}
              onReject={handleReject}
              requestId={request.id}
            />
          ) : null;
        })
      )}
      {visibleRequests.length > 0 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          size="md"
        />
      )}
    </div>
  );
}