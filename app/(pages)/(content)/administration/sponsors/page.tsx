'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Select, Option, Spinner } from "@material-tailwind/react";
import { Check, X } from 'lucide-react';
import { getAllSponsors, approveSponsorRequest, deleteSponsor } from '@/utils/sponsor.http';
import { getMediaById } from '@/utils/media.http'; // Importar la nueva función
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { PaginatedResponse, Pagination } from '@/types/pagination';
import { Sponsor } from '@/types/sponsor';
import Button from "@/components/buttons/button";
import { ConfirmationModal } from "@/components/form/modal"; // Importar ConfirmationModal


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
    const [pagination, setPagination] = useState<Pagination>({ page: 0, size: 10, totalPages: 0, totalElements: 0, last: false });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Estado para el modal
    const [sponsorToDeleteId, setSponsorToDeleteId] = useState<number | null>(null); // Estado para ID a eliminar
    const { authToken } = useAuth();

    const fetchSponsorApplications = useCallback(async (page = 0) => {
        if (!authToken) return;
        setLoading(true);
        try {
            const response: PaginatedResponse<Sponsor> = await getAllSponsors(authToken, page, pagination.size);
            
            const applicationsData: SponsorApplication[] = await Promise.all(
                response.data.map(async (sponsor) => {
                    let logoUrl: string | undefined = undefined;
                    if (sponsor.logoId && authToken) {
                        try {
                           
                            const mediaData = await getMediaById(sponsor.logoId, authToken);
                            if (mediaData && mediaData.url) {
                                logoUrl = mediaData.url;
                            }
                        } catch (logoError) {
                        
                             if (!(logoError instanceof Error && logoError.message === "Medio no encontrado.")) {
                                console.error(`Error fetching logo URL for ID ${sponsor.logoId}:`, logoError);
                            }
                        }
                    }
                    return { ...sponsor, logoUrl };
                })
            );
            
            setApplications(applicationsData);
            setPagination(response.pagination);

        } catch (error) {
            console.error("Error fetching sponsor applications:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al cargar las solicitudes.";
            setAlertInfo({ open: true, color: "red", message: errorMessage });
        } finally {
            setLoading(false);
        }
    }, [authToken, pagination.size]);

    useEffect(() => {
        fetchSponsorApplications(pagination.page);
    }, [authToken, pagination.page, fetchSponsorApplications]);

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

    const handleApprove = async (applicationId: number) => {
        if (!authToken) return;
        try {
            await approveSponsorRequest(authToken, applicationId);
            setApplications(prev => prev.map(app => 
                app.id === applicationId ? { ...app, isActive: true } : app
            ));
            setAlertInfo({ open: true, color: "green", message: `Solicitud aprobada.` });
        } catch (error) {
            console.error("Error approving application:", error);
            const errorMessage = error instanceof Error ? error.message : "Error al aprobar.";
            setAlertInfo({ open: true, color: "red", message: errorMessage });
        }
    };

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

    const goToPage = (newPage: number) => {
        if (newPage >= 0 && newPage < pagination.totalPages) {
            fetchSponsorApplications(newPage);
        }
    };
    
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

                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center mt-8 space-x-2">
                            <Button
                                variant="secondary" 
                                size="sm"
                                onClick={() => goToPage(pagination.page - 1)}
                                disabled={pagination.page === 0}
                            >
                                Anterior
                            </Button>
                            <span className="text-sm text-gray-700">
                                Página {pagination.page + 1} de {pagination.totalPages}
                            </span>
                            <Button
                                variant="secondary" 
                                size="sm"
                                onClick={() => goToPage(pagination.page + 1)}
                                disabled={pagination.page >= pagination.totalPages - 1}
                            >
                                Siguiente
                            </Button>
                        </div>
                    )}
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
        </div>
    );
}

interface SponsorCardProps {
    application: SponsorApplication;
    onApprove: (applicationId: number) => void;
    onReject: (applicationId: number) => void;
}

function SponsorCard({ application, onApprove, onReject }: SponsorCardProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex flex-col">
            <div className="h-32 bg-gray-100 flex items-center justify-center relative overflow-hidden border-b">
                {application.logoUrl ? (
                    <Image
                        src={application.logoUrl}
                        alt={`Logo Solicitud ${application.id}`}
                        fill
                        className="object-contain p-4"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        onError={(e) => { 
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none'; 
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.logo-placeholder')) {
                                const placeholder = document.createElement('span');
                                placeholder.className = 'logo-placeholder text-gray-400 text-sm italic';
                                placeholder.textContent = application.logoId ? 'Error al cargar logo' : 'Sin logo';
                                parent.appendChild(placeholder);
                            }
                        }}
                    />
                ) : (
                     <span className="logo-placeholder text-gray-400 text-sm italic">{application.logoId ? 'Cargando logo...' : 'Sin logo'}</span>
                )}
            </div>
            <div className="p-4 flex-grow">
                <h3 className="text-lg font-semibold mb-1">Solicitud #{application.id}</h3>
                <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Contacto:</span> {application.contact || 'No especificado'}
                </p>
                <p className="text-sm text-gray-700 mb-1"><span className="font-medium">Razón:</span></p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded border max-h-20 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                    {application.reason || 'No especificada'}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                    {application.bannerId && <span className="ml-2">Banner ID: {application.bannerId}</span>}
                </div>
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