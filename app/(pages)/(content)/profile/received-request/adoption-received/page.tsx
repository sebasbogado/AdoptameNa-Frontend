'use client';

import { useState } from "react";
import { acceptAdoptionRequest, getReceivedAdoptionsRequest, rejectAdoptionRequest } from "@/utils/adoptions.http";
import { useAuth } from "@/contexts/auth-context";
import { usePagination } from "@/hooks/use-pagination";
import { AdoptionResponse } from "@/types/adoption-response";
import AdoptionRequestCard from "@/components/profile/received-request/adoption-request-card";
import Pagination from "@/components/pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import Button from "@/components/buttons/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";

export default function ReceivedRequests() {
  const { authToken, loading: userLoading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const router = useRouter();

  if (userLoading) return <Loading />;

  if (!authToken) {
    router.push("/auth/login");
    return <Loading />;
  }

  const {
    data: requests,
    loading,
    currentPage,
    totalPages,
    handlePageChange,
    updateFilters
  } = usePagination<AdoptionResponse>({
    fetchFunction: (page, size, filters) => getReceivedAdoptionsRequest(authToken, { page, size, ...filters }),
    initialPage: 1,
    initialPageSize: 10
  });

  const handleAccept = async (id: number) => {
    try {
      await acceptAdoptionRequest(id, authToken);
      resetFilters();
    } catch (error) {
      console.error("Error al aceptar solicitud", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      await rejectAdoptionRequest(id, authToken);
      resetFilters();

    } catch (error) {
      console.error("Error al rechazar solicitud", error);
    }
  };

  const resetFilters = () => {
    setSelectedStatus(null);
    handlePageChange(1);
    updateFilters({});
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full max-w-7xl mx-auto p-4">
        
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <Button 
              size="md" 
              onClick={() => router.push("/profile/received-request")} 
              className="mb-6 mr-12 bg-white flex justify-between items-center shadow-md text-gray-800"
            >
              <ArrowLeft className="text-gray-800 pr-1" size={20} />
              Volver
            </Button>
            <LabeledSelect
              label="Estados"
              options={["Todos", "Pendientes", "Aceptados", "Rechazados"]}
              selected={selectedStatus}
              setSelected={(value) => {
                setSelectedStatus(value);
                if (value === "Aceptados") updateFilters({ status: "ACCEPTED" });
                else if (value === "Pendientes") updateFilters({ status: "PENDING" });
                else if (value === "Rechazados") updateFilters({ status: "REJECTED" });
                else updateFilters({ status: undefined });
              }}
            />
            <ResetFiltersButton onClick={resetFilters} />
          </div>

      </div>

      <div className="w-full flex flex-col items-center justify-center mb-6">
        {loading ? (
          <p className="text-center">Cargando solicitudes...</p>
        ) : requests.length === 0 ? (
          <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
            <p className="text-gray-600">No se encontraron solicitudes de adopción</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {requests.map((request) => (
              <AdoptionRequestCard
                key={request.id}
                petImage={request.pet?.media?.[0]}
                petName={request.pet?.name || ''}
                requesterName={request.fullName}
                requesterPhone={request.phone}
                requesterEmail={request.email}
                onAccept={() => handleAccept(request.id)}
                onReject={() => handleReject(request.id)}
                requestId={request.id}
                status={request.status}
              />
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