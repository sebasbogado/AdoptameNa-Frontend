"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useRouter } from "next/navigation";
import { getCrowdfundings } from "@/utils/crowfunding.http";
import { Crowdfunding } from "@/types/crowfunding-type";
import { RequestCard } from "@/components/request/request-card";
import { CrowdfundingStatus, FilterStatus } from "@/types/crowdfunding";
import LabeledSelect from "@/components/labeled-selected";
export default function UserSponsorsPage() {
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>(FilterStatus.ALL);
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const { authToken, user } = useAuth();
    const router = useRouter();

    const getBackendStatus = (status: FilterStatus) => {
        switch (status) {
            case FilterStatus.PENDING:
                return CrowdfundingStatus.PENDING;
            case FilterStatus.ACTIVE:
                return CrowdfundingStatus.ACTIVE;
            case FilterStatus.CLOSED:
                return CrowdfundingStatus.CLOSED;
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
            return await getCrowdfundings({ page, size, userId: user.id, status });
        },
        initialPage: 1,
        initialPageSize: 10
    });

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
            <h1 className="text-2xl font-semibold mb-2">Mis solicitudes de Crowdfunding</h1>
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

            <LabeledSelect
                label="Estado"
                options={[
                    FilterStatus.ALL,
                    FilterStatus.PENDING,
                    FilterStatus.ACTIVE,
                    FilterStatus.CLOSED
                ]}
                selected={selectedStatus}
                setSelected={setSelectedStatus}
            />

            {loading ? (
                <div className="flex justify-center  mt-4  items-center h-64">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <>
                    {applications.length > 0 ? (
                        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map((application) => (
                                <RequestCard
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No se encontraron solicitudes {selectedStatus !== FilterStatus.ALL ? `en estado ${selectedStatus.toLowerCase()}` : ''}.</p>
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
