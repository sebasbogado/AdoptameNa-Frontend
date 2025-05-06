"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X } from "lucide-react";
import { getAllSponsors, approveSponsorRequest, deleteSponsor } from "@/utils/sponsor.http";
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { PaginatedResponse } from "@/types/pagination";
import { Sponsor } from "@/types/sponsor";
import { ConfirmationModal } from "@/components/form/modal";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";

export default function UserSponsorsPage() {
    const [applications, setApplications] = useState<Sponsor[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<Sponsor[]>([]);
    const [filterStatus, setFilterStatus] = useState<string>('Todos');
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const { authToken, user } = useAuth();

    const {
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Sponsor>({
        fetchFunction: async (page, size) => {
            if (!authToken || !user) throw new Error("No autorizado");
            return await getAllSponsors(authToken, page, size, user.id);
        },
        initialPage: 1,
        initialPageSize: 10
    });

    const fetchSponsorApplications = async () => {
        if (!authToken || !user) return;
        setLoading(true);
        try {
            const response: PaginatedResponse<Sponsor> = await getAllSponsors(authToken, currentPage - 1, 10, user.id);
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching sponsor applications:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al cargar las solicitudes de auspicio"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsorApplications();
    }, [authToken, user, currentPage]);

    useEffect(() => {
        let filtered = applications;
        if (filterStatus === 'Pendiente') {
            filtered = applications.filter(app => !app.isActive);
        } else if (filterStatus === 'Aprobado') {
            filtered = applications.filter(app => app.isActive);
        }
        setFilteredApplications(filtered);
    }, [filterStatus, applications]);

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

            <div className="mb-6 w-full sm:w-72">
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <Select
                    value={filterStatus}
                    onChange={(val) => setFilterStatus(val as string || 'Todos')}
                    placeholder="Filtrar por estado"
                >
                    <Option value="Todos">Todos</Option>
                    <Option value="Pendiente">Pendiente</Option>
                    <Option value="Aprobado">Aprobado</Option>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Spinner className="h-12 w-12" />
                </div>
            ) : (
                <>
                    {filteredApplications.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredApplications.map((application) => (
                                <SponsorCard
                                    key={application.id}
                                    application={application}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-10">No se encontraron solicitudes {filterStatus !== 'Todos' ? `en estado ${filterStatus.toLowerCase()}` : ''}.</p>
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

interface SponsorCardProps {
    application: Sponsor;
}

function SponsorCard({ application }: SponsorCardProps) {
    const [hasLogoError, setHasLogoError] = useState(false);

    const handleLogoError = () => {
        setHasLogoError(true);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col">
            <div className="h-32 bg-gray-100 flex items-center justify-center relative overflow-hidden border-b">
                {application.logoUrl && !hasLogoError ? (
                    <Image
                        src={application.logoUrl}
                        alt={`Logo Solicitud ${application.id}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={handleLogoError}
                    />
                ) : (
                    <span className="logo-placeholder text-gray-400 text-sm italic">
                        {application.logoId ? 'Error al cargar logo' : 'Sin logo'}
                    </span>
                )}
            </div>
            <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">{application.organizationName || application.fullName}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Contacto:</span> {application.contact || 'No especificado'}
                </p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Razón:</span></p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {application.reason || 'No especificada'}
                </p>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 items-center">
                {application.isActive ? (
                    <span className="text-sm font-medium text-green-600 flex items-center">
                        <Check size={16} className="mr-1"/> Aprobado
                    </span>
                ) : (
                    <span className="text-sm font-medium text-yellow-600 flex items-center">
                        <X size={16} className="mr-1"/> Pendiente
                    </span>
                )}
            </div>
        </div>
    );
}
