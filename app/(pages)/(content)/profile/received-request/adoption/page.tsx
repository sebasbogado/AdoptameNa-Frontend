'use client'

import { useEffect, useState } from "react";
import {
  acceptAdoptionRequest,
  getAdoptionsResponse,
  rejectAdoptionRequest
} from "@/utils/adoptions.http";
import AdoptionRequestCard from "@/components/profile/received-request/adoption-request-card";
import { AdoptionResponse } from "@/types/adoption-response";
import { Pet } from "@/types/pet";
import { getPet } from "@/utils/pets.http";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "@/components/pagination";

export default function AdoptionRequestsPage() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [petMap, setPetMap] = useState<Record<number, Pet>>({});
  const [pageSize, setPageSize] = useState<number>();

  // Redirección si no es admin o no está logeado
  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authToken, authLoading, user, router]);

  const {
    data: adoptionResponse,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    updateFilters
  } = usePagination<AdoptionResponse>({
    fetchFunction: async (page, size) => {
      return await getAdoptionsResponse({ page, size });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  // Obtener mascotas asociadas
  useEffect(() => {
    if (!adoptionResponse) return;

    const loadPets = async () => {
      const uniquePetIds = Array.from(new Set(adoptionResponse.map((req) => req.petId)));
      const petPromises = uniquePetIds.map((id) =>
        getPet(id.toString())
          .then((pet) => ({ id, pet }))
          .catch(() => null)
      );

      const results = await Promise.all(petPromises);
      const pets: Record<number, Pet> = {};
      results.forEach((result) => {
        if (result && result.pet) {
          pets[result.id] = result.pet;
        }
      });

      setPetMap(pets);
    };

    loadPets();
  }, [adoptionResponse]);

  // Aceptar solicitud y refrescar
  const handleAccept = async (id: number) => {
    try {
      await acceptAdoptionRequest(id);
      updateFilters({}); // Refrescar datos
    } catch (err) {
      console.error("Error al aceptar solicitud:", err);
    }
  };

  // Rechazar solicitud y refrescar
  const handleReject = async (id: number) => {
    try {
      await rejectAdoptionRequest(id);
      updateFilters({});
    } catch (err) {
      console.error("Error al rechazar solicitud:", err);
    }
  };

  console.log(adoptionResponse);

  return (
    <div className="flex flex-col gap-5">
      <div className="p-8 flex flex-wrap gap-6">
        {adoptionResponse?.map((request) => {
          const pet = petMap[request.petId];
          return (
            <AdoptionRequestCard
              key={request.id}
              petImage={pet?.media?.[0]}
              petName={pet?.name}
              requesterName={request.fullName}
              requesterPhone={request.phone}
              requesterEmail={request.email}
              onAccept={() => handleAccept(request.id)}
              onReject={() => handleReject(request.id)}
            />
          );
        })}
      </div>

      {/* Pagination */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="md"
      />
    </div>
  );
}
