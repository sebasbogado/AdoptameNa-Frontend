"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { getAllSponsors } from "@/utils/sponsor.http";
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { Sponsor, SponsorStatus, FilterStatus } from "@/types/sponsor";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { useRouter } from "next/navigation";
import SponsorCard from '@/components/sponsor/sponsor-card';

export default function UserSponsorsPage() {
    const [selectedStatus, setSelectedStatus] = useState<FilterStatus>(FilterStatus.ALL);
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const { authToken, user } = useAuth();
    const router = useRouter();

    const getBackendStatus = (status: FilterStatus) => {
        switch (status) {
            case FilterStatus.PENDING:
                return SponsorStatus.PENDING;
            case FilterStatus.APPROVED:
                return SponsorStatus.ACTIVE;
            case FilterStatus.REJECTED:
                return SponsorStatus.INACTIVE;
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
    } = usePagination<Sponsor>({
        fetchFunction: async (page, size, filters) => {
            if (!authToken || !user) throw new Error("No autorizado");
            const status = getBackendStatus(filters?.status);
            return await getAllSponsors(authToken, page, size, user.id, status);
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
            <h1 className="text-2xl font-semibold mb-2">Mis solicitudes de auspicio</h1>
            <p className="text-gray-600 mb-6">
                Aquí podrás ver la lista de tus solicitudes para auspiciar el sitio.
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

            <div className="mb-10 flex justify-center w-full">
                <div className="w-full sm:w-72">
                    <label className="block text-sm font-medium text-gray-700 mb-1 text-center">Estado</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as FilterStatus)}
                        className="w-full p-2 border rounded text-center"
                    >
                        <option value={FilterStatus.ALL}>{FilterStatus.ALL}</option>
                        <option value={FilterStatus.PENDING}>{FilterStatus.PENDING}</option>
                        <option value={FilterStatus.APPROVED}>{FilterStatus.APPROVED}</option>
                        <option value={FilterStatus.REJECTED}>{FilterStatus.REJECTED}</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <>
                    {applications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map((application) => (
                                <SponsorCard
                                    key={application.id}
                                    sponsor={application}
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
