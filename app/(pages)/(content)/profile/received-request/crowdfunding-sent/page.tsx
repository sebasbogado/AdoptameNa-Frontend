"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Spinner, Alert } from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useRouter } from "next/navigation";
import { deleteCrowdfunding, getMyCrowdfundingRequests } from "@/utils/crowfunding.http";
import { Crowdfunding } from "@/types/crowfunding-type";
import { RequestCard } from "@/components/request/request-card";
import { CrowdfundingStatus, FilterStatus } from "@/types/crowdfunding";
import LabeledSelect from "@/components/labeled-selected";
import Button from "@/components/buttons/button";
import ResetFiltersButton from "@/components/reset-filters-button";
import Loading from "@/app/loading";
export default function UserCrowdfundingPage() {
    const { authToken, user, loading: userLoading } = useAuth();
    const router = useRouter();
     if (userLoading) return <Loading />;

    if (!authToken) {
        router.push("/auth/login");
        return <Loading />;
    }
        const [selectedStatus, setSelectedStatus] = useState<FilterStatus>(FilterStatus.ALL);
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);

 const handleDeleteCrowdfunding = async (id: number) => {
    if (!authToken) throw new Error("No autorizado");
    try {
        await deleteCrowdfunding(authToken, id);
        setAlertInfo({ open: true, color: 'green', message: 'Solicitud eliminada correctamente' });
        // ... lógica de borrar local si tienes
    } catch (error: any) {
        let msg = "Error al eliminar la solicitud";
        if (error?.response?.data?.message) {
            msg = error.response.data.message; // axios
        } else if (error?.message) {
            msg = error.message; // fetch (si lanzas {message})
        }
        setAlertInfo({ open: true, color: 'red', message: msg });
    }
    resetFilters();
};
    
    const getBackendStatus = (status: FilterStatus) => {
        switch (status) {
            case FilterStatus.PENDING:
                return CrowdfundingStatus.PENDING;
            case FilterStatus.ACTIVE:
                return CrowdfundingStatus.ACTIVE;
            case FilterStatus.CLOSED:
                return CrowdfundingStatus.CLOSED;
            case FilterStatus.REJECTED:
                return CrowdfundingStatus.REJECTED;
                
            default:
                return undefined;
        }
    };

    const {
        data: applications,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Crowdfunding>({
        fetchFunction: async (page, size, filters) => {

            if (!authToken || !user) throw new Error("No autorizado");
            const status = getBackendStatus(filters?.status);
            return await getMyCrowdfundingRequests(authToken, { page, size, status });
        },
        initialPage: 1,
        initialPageSize: 25
    });
  const resetFilters = () => {
    setSelectedStatus(FilterStatus.ALL);
    handlePageChange(1);
    updateFilters({});
  };

    useEffect(() => {
        updateFilters({ status: selectedStatus });
        handlePageChange(1);
    }, [selectedStatus, updateFilters]);

    useEffect(() => {
        if (alertInfo) {
            const timer = setTimeout(() => setAlertInfo(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [alertInfo]);
   
    return (
        <div className="container mx-auto p-6">
             <div className="flex justify-start mb-4">
                <Button
                    size="md"
                    onClick={() => router.push("/profile/received-request")}
                    className="bg-white flex items-center shadow-md text-gray-800"
                >
                    <ArrowLeft className="text-gray-800 mr-2" size={20} />
                        Volver
                </Button>
            </div>  
               <div className="p-6">
           
        </div>
           
            <h1 className="text-2xl font-semibold mb-2">Mis solicitudes de Colectas</h1>
            <p className="text-gray-600 mb-6">
                Aquí podrás ver la lista de tus solicitudes de colecta que enviaste.
            </p>

            {alertInfo && (
                <Alert
                    open={alertInfo.open}
                    color={alertInfo.color === 'green' ? 'green' : 'red'}
                    onClose={() => setAlertInfo(null)}
                    className="mb-4 fixed top-4 right-4 w-auto z-50"
                    animate={{ mount: { y: 0 }, unmount: { y: -100 } }}
                >
                    {alertInfo.message}
                </Alert>
            )}
            <div className="flex gap-4 ">
            <LabeledSelect
                label="Estado"
                options={[
                    FilterStatus.ALL,
                    FilterStatus.PENDING,
                    FilterStatus.ACTIVE,
                    FilterStatus.CLOSED,
                    FilterStatus.REJECTED
                ]}
                selected={selectedStatus}
                setSelected={setSelectedStatus}
            />
            <div className="flex mb-2 items-end">

          <ResetFiltersButton className="items-end" onClick={resetFilters} />

            </div>
                        </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center h-[300px] w-full">
                    <Spinner className="h-12 w-12" />
                    <span className="mt-4 text-gray-500 text-lg">Cargando solicitudes...</span>
                </div>
            ) : (
                <>
                    {applications.length > 0 ? (
                        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map((application) => (
                                <RequestCard
                                    key={application.id}
                                    application={application}
                                    onDeleted={handleDeleteCrowdfunding}
                                    resetFilters={resetFilters}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-[240px] w-full">
                            <X className="h-14 w-14 text-gray-300 mb-2" />
                            <p className="text-center text-gray-500 text-lg font-medium">
                                No se encontraron solicitudes {selectedStatus !== FilterStatus.ALL ? `en estado ${selectedStatus.toLowerCase()}` : ''}.
                            </p>
                        </div>
                    )}

                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}

                        size="md"
                    />
                </>
            )}
        </div>
    );
}
