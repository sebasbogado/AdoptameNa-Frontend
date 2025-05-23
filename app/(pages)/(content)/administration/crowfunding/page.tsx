"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { getCrowdfundings, deleteCrowdfunding, updateCrowdfundingStatus, rejectCrowdfunding } from '@/utils/crowfunding.http';
import { Crowdfunding } from '@/types/crowfunding-type';
import Pagination from '@/components/pagination';
import CrowdfundingCard from '@/components/crowdfundingCard/crowdfunding-card';
import { Alert } from "@material-tailwind/react";
import { ConfirmationModal } from '@/components/form/modal';

const CrowdfundingSkeleton = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-4 animate-pulse">
            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
            <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="flex justify-between mt-4">
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

const STATUS_OPTIONS = [
    { value: '', label: 'Todos' },
    { value: 'ACTIVE', label: 'Activos' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'CLOSED', label: 'Cerrados' },
    { value: 'REJECTED', label: 'Rechazados' },
];

export default function CrowfundingPage() {
    const { authToken, user } = useAuth();
    const router = useRouter();
    const [crowdfundings, setCrowdfundings] = useState<Crowdfunding[]>([]);
    const [loading, setLoading] = useState(true);
    const [alertInfo, setAlertInfo] = useState<{ open: boolean; color: string; message: string } | null>(null);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const PAGE_SIZE = 9;
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [crowdfundingToDeleteId, setCrowdfundingToDeleteId] = useState<number | null>(null);
    const [crowdfundingToApproveId, setCrowdfundingToApproveId] = useState<number | null>(null);
    const [isDefinitiveDelete, setIsDefinitiveDelete] = useState(false);

    const fetchCrowdfundings = async () => {
        setLoading(true);
        try {
            const response = await getCrowdfundings({
                page: currentPage - 1,
                size: PAGE_SIZE,
                status: selectedStatus || undefined,
            });
            setCrowdfundings(response.data);
            setTotalPages(response.pagination.totalPages);
        } catch (error) {
            setAlertInfo({ open: true, color: 'red', message: 'Error al cargar crowdfundings' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role !== 'admin') {
            router.push('/dashboard');
        }
    }, [user, router]);

    useEffect(() => {
        fetchCrowdfundings();
        // eslint-disable-next-line
    }, [selectedStatus, currentPage]);

    const handleApprove = (id: number) => {
        setCrowdfundingToApproveId(id);
        setIsApproveModalOpen(true);
    };

    const confirmApprove = async () => {
        if (!authToken || crowdfundingToApproveId === null) return;
        try {
            await updateCrowdfundingStatus(authToken, crowdfundingToApproveId, 'ACTIVE');
            setAlertInfo({ open: true, color: 'green', message: 'Colecta aprobada.' });
            fetchCrowdfundings();
        } catch {
            setAlertInfo({ open: true, color: 'red', message: 'Error al aprobar.' });
        } finally {
            setIsApproveModalOpen(false);
            setCrowdfundingToApproveId(null);
        }
       
    };

    const closeApproveModal = () => {
        setIsApproveModalOpen(false);
        setCrowdfundingToApproveId(null);
    };

    const handleReject = (id: number) => {
        setCrowdfundingToDeleteId(id);
        setIsConfirmModalOpen(true);
        setIsDefinitiveDelete(false);
    };

    const handleDelete = (id: number) => {
        const crowdfunding = crowdfundings.find(c => c.id === id);
        if (crowdfunding && crowdfunding.status !== 'CLOSED') {
            setAlertInfo({ open: true, color: 'red', message: 'Solo puedes eliminar campañas que estén cerradas.' });
            return;
        }
        setCrowdfundingToDeleteId(id);
        setIsConfirmModalOpen(true);
        setIsDefinitiveDelete(true);
    };

    const confirmRejectOrDelete = async () => {
        if (!authToken || crowdfundingToDeleteId === null) return;
        try {
            if (isDefinitiveDelete) {
                await deleteCrowdfunding(authToken, crowdfundingToDeleteId);
                setAlertInfo({ open: true, color: 'green', message: 'Colecta eliminada.' });
            } else {
                await rejectCrowdfunding(authToken, crowdfundingToDeleteId);
                setAlertInfo({ open: true, color: 'green', message: 'Colecta rechazada.' });
            }
            fetchCrowdfundings();
        } catch (error) {
            const err = error as any;
            setAlertInfo({ open: true, color: 'red', message: isDefinitiveDelete ? 'Error al eliminar.' : 'Error al rechazar.' });
        } finally {
            setIsConfirmModalOpen(false);
            setCrowdfundingToDeleteId(null);
            setIsDefinitiveDelete(false);
        }
    };

    const closeModal = () => {
        setIsConfirmModalOpen(false);
        setCrowdfundingToDeleteId(null);
        setIsDefinitiveDelete(false);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-2">Administración de Colectas</h1>
            <p className="text-gray-600 mb-6">Gestiona las campañas de colectas: aprobar, rechazar o eliminar.</p>

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
                <select
                    value={selectedStatus}
                    onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                    className="w-full p-2 border rounded"
                >
                    {STATUS_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-6">
                    {[...Array(6)].map((_, index) => (
                        <CrowdfundingSkeleton key={index} />
                    ))}
                </div>
            ) : (
                crowdfundings.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-6">
                        {crowdfundings.map((item) => (
                            <CrowdfundingCard
                                key={item.id}
                                item={item}
                                isAdmin={true}
                                onApprove={handleApprove}
                                onReject={handleReject}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-10">No se encontraron campañas.</p>
                )
            )}

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                size="md"
            />

            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                title={isDefinitiveDelete ? "Eliminar Colecta" : "Confirmar Rechazo"}
                message={isDefinitiveDelete ? "¿Estás seguro de que deseas eliminar definitivamente esta campaña?" : "¿Estás seguro de que deseas rechazar (eliminar) esta campaña?"}
                textConfirm={isDefinitiveDelete ? "Eliminar" : "Rechazar"}
                confirmVariant={isDefinitiveDelete ? "danger" : "danger"}
                onClose={closeModal}
                onConfirm={confirmRejectOrDelete}
            />

            <ConfirmationModal
                isOpen={isApproveModalOpen}
                title="Confirmar Aprobación"
                message="¿Estás seguro de que deseas aprobar esta campaña de colecta?"
                textConfirm="Aprobar"
                confirmVariant="cta"
                onClose={closeApproveModal}
                onConfirm={confirmApprove}
            />
        </div>
    );
}
