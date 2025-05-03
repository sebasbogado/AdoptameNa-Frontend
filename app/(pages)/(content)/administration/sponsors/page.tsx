'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X, Trash } from 'lucide-react';
import { getAllSponsors, approveSponsorRequest, deleteSponsor, rejectSponsorRequest } from '@/utils/sponsor.http';
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";

import { Sponsor } from '@/types/sponsor';
import { ConfirmationModal } from "@/components/form/modal";
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';

interface SponsorApplication extends Sponsor {
    logoUrl?: string;
    status?: string | null;
}

type FilterStatus = 'Todos' | 'Pendiente' | 'Aprobado' | 'Rechazado';

export default function AdminSponsorsPage() {
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('Todos');
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [sponsorToDeleteId, setSponsorToDeleteId] = useState<number | null>(null);
    const [sponsorToApproveId, setSponsorToApproveId] = useState<number | null>(null);
    const { authToken } = useAuth();
    const [isDefinitiveDelete, setIsDefinitiveDelete] = useState(false);

    // Mapeo de filtro frontend a backend
    const getBackendStatus = (status: FilterStatus) => {
        if (status === 'Pendiente') return 'PENDING';
        if (status === 'Aprobado') return 'ACTIVE';
        if (status === 'Rechazado') return 'INACTIVE';
        return undefined; // Para 'Todos'
    };

    const {
        data: applications,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<SponsorApplication>({
        fetchFunction: async (page, size, filters) => {
            if (!authToken) throw new Error("No autorizado");
            const status = getBackendStatus(filters?.status);
            return await getAllSponsors(authToken, page, size, status);
        },
        initialPage: 1,
        initialPageSize: 10
    });

    // Actualizar filtros cuando cambia el estado del filtro
    useEffect(() => {
        updateFilters({ status: filterStatus });
        handlePageChange(1); // Volver a la primera página al cambiar el filtro
    }, [filterStatus, updateFilters]);

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
            updateFilters({ status: filterStatus });
            setAlertInfo({ open: true, color: "green", message: `Solicitud aprobada.` });
        } catch (error) {
            console.error("Error approving application:", error);
            if (error instanceof Error) {
                setAlertInfo({ open: true, color: "red", message: error.message });
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                setAlertInfo({ open: true, color: "red", message: JSON.stringify(error.response?.data) });
                // @ts-ignore
                console.error('Backend error response:', error.response);
            } else {
                setAlertInfo({ open: true, color: "red", message: 'Error al aprobar (desconocido).' });
            }
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
            if (isDefinitiveDelete) {
                await deleteSponsor(authToken, sponsorToDeleteId);
            } else {
                await rejectSponsorRequest(authToken, sponsorToDeleteId);
            }
            updateFilters({ status: filterStatus });
            setAlertInfo({ open: true, color: "green", message: isDefinitiveDelete ? `Solicitud eliminada definitivamente.` : `Solicitud rechazada.` });
        } catch (error) {
            console.error("Error rejecting application:", error);
            if (error instanceof Error) {
                setAlertInfo({ open: true, color: "red", message: error.message });
            } else if (typeof error === 'object' && error !== null && 'response' in error) {
                // @ts-ignore
                setAlertInfo({ open: true, color: "red", message: JSON.stringify(error.response?.data) });
                // @ts-ignore
                console.error('Backend error response:', error.response);
            } else {
                setAlertInfo({ open: true, color: "red", message: 'Error al rechazar (desconocido).' });
            }
        } finally {
            setIsConfirmModalOpen(false);
            setSponsorToDeleteId(null);
            setIsDefinitiveDelete(false);
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
                    <Option value="Rechazado">Rechazado</Option>
                </Select>
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
                                    application={application}
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    onDelete={async (id) => {
                                        setSponsorToDeleteId(id);
                                        setIsConfirmModalOpen(true);
                                        setIsDefinitiveDelete(true);
                                    }}
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
                title={isDefinitiveDelete ? "Eliminar Solicitud" : "Confirmar Rechazo"}
                message={isDefinitiveDelete ? "¿Estás seguro de que deseas eliminar definitivamente esta solicitud?" : "¿Estás seguro de que deseas rechazar (eliminar) esta solicitud?"}
                textConfirm={isDefinitiveDelete ? "Eliminar" : "Rechazar"}
                confirmVariant={isDefinitiveDelete ? "danger" : "danger"}
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
    onDelete: (applicationId: number) => void;
}

function SponsorCard({ application, onApprove, onReject, onDelete }: SponsorCardProps) {
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
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                    onClick={() => onDelete(application.id)}
                    className="p-2 rounded-full text-gray-500 hover:bg-red-200 transition-colors"
                    title="Eliminar definitivamente"
                >
                    <Trash size={20} />
                </button>
                <div className="flex gap-3 items-center">
                    {application.status === null || application.status === 'PENDING' ? (
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
                    ) : application.status === 'ACTIVE' ? (
                        <span className="text-sm font-medium text-green-600 flex items-center">
                            <Check size={16} className="mr-1"/> Aprobado
                        </span>
                    ) : application.status === 'INACTIVE' ? (
                        <span className="text-sm font-medium text-red-500 flex items-center">
                            <X size={16} className="mr-1"/> Rechazado
                        </span>
                    ) : null}
                </div>
            </div>
        </div>
    );
}