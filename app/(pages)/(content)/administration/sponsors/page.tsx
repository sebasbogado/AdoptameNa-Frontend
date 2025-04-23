'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X } from 'lucide-react';
import { getAllSponsors, approveSponsorRequest, deleteSponsor } from '@/utils/sponsor.http';
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { PaginatedResponse } from '@/types/pagination';
import { Sponsor } from '@/types/sponsor';
import { ConfirmationModal } from "@/components/form/modal";
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';

interface SponsorApplication extends Sponsor {
    logoUrl?: string;
}

type FilterStatus = 'Todos' | 'Pendiente' | 'Aprobado';

export default function AdminSponsorsPage() {
    const [applications, setApplications] = useState<SponsorApplication[]>([]);
    const [filteredApplications, setFilteredApplications] = useState<SponsorApplication[]>([]);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('Todos');
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [sponsorToDeleteId, setSponsorToDeleteId] = useState<number | null>(null);
    const [sponsorToApproveId, setSponsorToApproveId] = useState<number | null>(null);
    const { authToken } = useAuth();

    const {
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Sponsor>({
        fetchFunction: async (page, size) => {
            if (!authToken) throw new Error("No autorizado");
            return await getAllSponsors(authToken, page, size);
        },
        initialPage: 1,
        initialPageSize: 10
    });

    const fetchSponsorApplications = async () => {
        if (!authToken) return;
        setLoading(true);
        try {
            const response: PaginatedResponse<Sponsor> = await getAllSponsors(authToken, currentPage - 1, 10);
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
    }, [authToken, currentPage]);

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

    const handleApprove = (applicationId: number) => {
        setSponsorToApproveId(applicationId);
        setIsApproveModalOpen(true);
    };

    const confirmApprove = async () => {
        if (!authToken || sponsorToApproveId === null) return;
        
        try {
            await approveSponsorRequest(authToken, sponsorToApproveId);
            setApplications(prev => prev.map(app => 
                app.id === sponsorToApproveId ? { ...app, isActive: true } : app
            ));
            setAlertInfo({ open: true, color: "green", message: `Solicitud aprobada.` });
        } catch (error) {
            console.error("Error approving application:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al aprobar.";
            setAlertInfo({ open: true, color: "red", message: errorMessage });
        } finally {
            setIsApproveModalOpen(false);
            setSponsorToApproveId(null);
        }
    };

    const closeApproveModal = () => {
        setIsApproveModalOpen(false);
        setSponsorToApproveId(null);
    }

    const handleReject = (applicationId: number) => {
        setSponsorToDeleteId(applicationId);
        setIsConfirmModalOpen(true);
    };

    const confirmReject = async () => {
        if (!authToken || sponsorToDeleteId === null) return;
        
        try {
            await deleteSponsor(authToken, sponsorToDeleteId);
            setApplications(prev => prev.filter(app => app.id !== sponsorToDeleteId));
            setAlertInfo({ open: true, color: "green", message: `Solicitud rechazada.` });
        } catch (error) {
            console.error("Error rejecting application:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al rechazar.";
            setAlertInfo({ open: true, color: "red", message: errorMessage });
        } finally {
            setIsConfirmModalOpen(false);
            setSponsorToDeleteId(null);
        }
    };

    const closeModal = () => {
        setIsConfirmModalOpen(false);
        setSponsorToDeleteId(null);
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">Solicitudes de Auspicio</h1>
            <p className="text-gray-600 mb-6">
                Aquí podrás ver la lista de solicitudes para auspiciar el sitio. Puedes aprobarlas o rechazarlas.
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
                    onChange={(val) => setFilterStatus(val as FilterStatus || 'Todos')}
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
                                    onApprove={handleApprove}
                                    onReject={handleReject}
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

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title="Confirmar Rechazo"
                message="¿Estás seguro de que deseas rechazar (eliminar) esta solicitud?"
                textConfirm="Rechazar"
                confirmVariant="danger"
                onClose={closeModal}
                onConfirm={confirmReject}
            />

            <ConfirmationModal
                isOpen={isApproveModalOpen}
                title="Confirmar Aprobación"
                message="¿Estás seguro de que deseas aprobar esta solicitud de auspicio?"
                textConfirm="Aprobar"
                confirmVariant="cta"
                onClose={closeApproveModal}
                onConfirm={confirmApprove}
            />
        </div>
    );
}

interface SponsorCardProps {
    application: SponsorApplication;
    onApprove: (applicationId: number) => void;
    onReject: (applicationId: number) => void;
}

function SponsorCard({ application, onApprove, onReject }: SponsorCardProps) {
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
                {!application.isActive ? (
                    <>
                        <button
                            onClick={() => onReject(application.id)}
                            className="p-2 rounded-full text-red-500 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Rechazar (Eliminar)"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={() => onApprove(application.id)}
                            className="p-2 rounded-full text-green-500 hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Aprobar"
                        >
                            <Check size={20} />
                        </button>
                    </>
                ) : (
                    <span className="text-sm font-medium text-green-600 flex items-center">
                        <Check size={16} className="mr-1"/> Aprobado
                    </span>
                )}
            </div>
        </div>
    );
}