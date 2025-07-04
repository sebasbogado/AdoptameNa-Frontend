'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllBanners, activateBanner, deactivateBanner, deleteBanner } from '@/utils/banner.http';
import { Loader2, Pencil, X, Check, AlertTriangle } from 'lucide-react';
import { usePagination } from '@/hooks/use-pagination';
import { bannerQueryParams, PaginatedResponse } from '@/types/pagination';
import { Banner } from '@/types/banner';
import { Alert } from '@material-tailwind/react';
import BannerFilters from './banner-filters';
import BannerCard from './banner-card';
import Pagination from '../pagination';
import { useAuth } from '@/contexts/auth-context';
import Loading from '@/app/loading';
import { ConfirmationModal } from '@/components/form/modal';

export default function BannerList() {
    const { authToken, loading: userloading } = useAuth();

    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<bannerQueryParams>({});
    const [alertInfo, setAlertInfo] = useState<{
        open: boolean;
        color: "green" | "red" | "blue";
        message: string;
    } | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBannerId, setSelectedBannerId] = useState<number | null>(null);

    useEffect(() => {
        if (alertInfo?.open) {
            const timer = setTimeout(() => {
                setAlertInfo(prev => prev ? { ...prev, open: false } : null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alertInfo]);

    if (userloading) return <Loading />
    if (!authToken) {
        router.push('/login');
        return <Loading />
    }

    const fetchBannersWithFilters = async (
        page: number,
        size: number,
        filters: bannerQueryParams = {}
    ): Promise<PaginatedResponse<Banner>> => {
        const response = await getAllBanners(
            {
                ...filters,
                page: page,
                size: size
            },
            authToken
        );

        return {
            data: response.data,
            pagination: response.pagination
        };
    };

    const {
        data: banners,
        loading,
        currentPage,
        pageSize,
        totalPages,
        totalElements,
        handlePageChange,
        handlePageSizeChange,
        updateFilters: setHookFilters
    } = usePagination<Banner>({
        fetchFunction: fetchBannersWithFilters,
        initialPage: 1,
        initialPageSize: 9
    });

    const handleApplyFilters = (newFilters: bannerQueryParams) => {
        setFilters(newFilters);
        setHookFilters(newFilters);
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        setFilters({});
        setHookFilters({});
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleEdit = (id: number) => {
        router.push(`/administration/settings/banner/${id}`);
    };

    const handleActivate = async (id: number) => {
        try {
            await activateBanner(id, authToken);
            setAlertInfo({
                open: true,
                color: "green",
                message: "Banner activado con éxito"
            });
            setHookFilters({ ...filters });
        } catch (error) {
            console.error('Error al activar el banner:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al activar el banner. Por favor, inténtalo de nuevo."
            });
        }
    };

    const handleDeactivate = async (id: number) => {
        try {
            await deactivateBanner(id, authToken);
            setAlertInfo({
                open: true,
                color: "green",
                message: "Banner desactivado con éxito"
            });
            setHookFilters({ ...filters });
        } catch (error) {
            console.error('Error al desactivar el banner:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al desactivar el banner. Por favor, inténtalo de nuevo."
            });
        }
    };

    const handleDelete = async (id: number) => {
        setSelectedBannerId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedBannerId) return;

        try {
            await deleteBanner(selectedBannerId, authToken);
            setAlertInfo({
                open: true,
                color: "green",
                message: "Banner eliminado con éxito"
            });
            setHookFilters({ ...filters });
        } catch (error) {
            console.error('Error al eliminar el banner:', error);
            setAlertInfo({
                open: true,
                color: "red",
                message: "Error al eliminar el banner. Por favor, inténtalo de nuevo."
            });
        } finally {
            setIsDeleteModalOpen(false);
            setSelectedBannerId(null);
        }
    };

    return (
        <div>
            {alertInfo && alertInfo.open && (
                <Alert
                    open={alertInfo.open}
                    color={alertInfo.color}
                    animate={{
                        mount: { y: 0 },
                        unmount: { y: -100 },
                    }}
                    icon={
                        alertInfo.color === "green" ? (
                            <Check className="h-5 w-5" />
                        ) : alertInfo.color === "red" ? (
                            <X className="h-5 w-5" />
                        ) : (
                            <AlertTriangle className="h-5 w-5" />
                        )
                    }
                    onClose={() => setAlertInfo({ ...alertInfo, open: false })}
                    className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
                >
                    <p className="text-sm">{alertInfo.message}</p>
                </Alert>
            )}

            <BannerFilters
                filters={filters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
                showFilters={showFilters}
                onToggleFilters={toggleFilters}
            />

            {loading && (
                <div className="flex flex-col items-center justify-center h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
                    <p className="text-gray-500">Cargando banners</p>
                </div>
            )}

            {!loading && banners.length === 0 && (
                <div className="flex flex-col items-center justify-center my-8 p-6 border border-gray-200 rounded-lg">
                    <p className="text-gray-500 text-lg">No se encontraron banners</p>
                    <p className="text-gray-400 text-sm mt-2">Intenta con otros filtros o crea un nuevo banner</p>
                </div>
            )}

            {!loading && <>
                <div className="mb-6 text-sm text-gray-500 text-right">
                    Mostrando {banners.length} de {totalElements} banners
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {banners.map((banner) => (
                        <BannerCard
                            key={banner.id}
                            banner={banner}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onActivate={handleActivate}
                            onDeactivate={handleDeactivate}
                        />
                    ))}
                </div>
            </>
            }
            {totalPages > 0 && (
                <div className="mt-8">
                    <Pagination
                        totalPages={totalPages}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                        showText={true}
                    />
                    <div className="flex justify-center mt-4">
                        <select
                            className="border rounded-md px-3 py-1"
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                        >
                            <option value="3">3 por página</option>
                            <option value="6">6 por página</option>
                            <option value="9">9 por página</option>
                            <option value="12">12 por página</option>
                        </select>
                    </div>
                </div>
            )}

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                title="Eliminar Banner"
                message="¿Estás seguro de que quieres eliminar este banner?"
                textConfirm="Eliminar"
                confirmVariant="danger"
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
            />
        </div>
    );
}