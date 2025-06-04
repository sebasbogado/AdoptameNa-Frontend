import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React, { useState } from 'react';
import SectionAdmin from '../section';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/auth-context';
import { ITEM_TYPE } from '@/types/constants';
import CardBanned from './card-banned';
import { banPet, banPost, banProduct } from '@/utils/report-client';
import { Alert } from '@material-tailwind/react';
import { ConfirmationModal } from '@/components/form/modal';

interface Props<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
    updateFilters?: (filters: Record<string, any>) => void;
    itemType: ITEM_TYPE;
    disabled?: boolean;
}

export default function AllPostListPage<T extends Post | Pet | Product>({
    items,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    updateFilters,
    itemType,
    disabled = false,
}: Props<T>) {
    const { authToken } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // --- Modal State ---
    const [modalOpen, setModalOpen] = useState(false);
    const [banId, setBanId] = useState<number | null>(null);
    const [banType, setBanType] = useState<string | null>(null);

    const handleBan = async (id: number, type: string) => {
        if (!authToken) return;
        try {
            switch (type) {
                case 'post':
                    await banPost(id, authToken);
                    setSuccessMessage("Publicación baneada exitosamente.");
                    setTimeout(() => setSuccessMessage(""), 2500);
                    break;
                case 'pet':
                    await banPet(id, authToken);
                    setSuccessMessage("Publicación de mascota baneada exitosamente.");
                    setTimeout(() => setSuccessMessage(""), 2500);
                    break;
                case 'product':
                    await banProduct(id, authToken);
                    setSuccessMessage("Publicación de producto baneada exitosamente.");
                    setTimeout(() => setSuccessMessage(""), 2500);
                    break;
                default:
                    console.error(`Tipo desconocido: ${type}`);
                    throw new Error("Tipo de item no soportado");
            }
            // Forzar una recarga completa de los datos
            if (updateFilters) {
                updateFilters({});
                // Esperar un momento para asegurar que la API ha procesado el cambio
                setTimeout(() => {
                    handlePageChange(currentPage);
                }, 100);
            }

        } catch (error) {
            setErrorMessage('Ocurrió un error al restaurar la publicación.');
        }
    };

    const handleBanClick = (id: number, type: string) => {
        setBanId(id);
        setBanType(type);
        setModalOpen(true);
    };

    const handleConfirmBan = async () => {
        if (banId && banType) {
            await handleBan(banId, banType);
            setModalOpen(false);
        }
    };

    return (
        <div>
            <SectionAdmin title="Banear Publicaciones">Todas la publicaciones se encuentra acá y pueden ser baneadas en caso de ser necesario</SectionAdmin>

            {/* Mensajes de feedback */}
            <div className="w-full flex justify-center fixed bottom-4 left-0 right-0 z-50 pointer-events-none">
                <div className="pointer-events-auto">
                    {successMessage && (
                        <Alert
                            color="green"
                            open={!!successMessage}
                            onClose={() => setSuccessMessage("")}
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 100 },
                            }}
                        >
                            {successMessage}
                        </Alert>
                    )}
                    {errorMessage && !modalOpen && ( // Don't show general error if modal is open and might show its own
                        <Alert
                            color="red"
                            open={!!errorMessage}
                            onClose={() => setErrorMessage("")}
                            animate={{
                                mount: { y: 0 },
                                unmount: { y: 100 },
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    )}
                </div>
            </div>


            {loading && items.length === 0 ? (
                <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
            ) : !loading && items.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg mt-4">
                    <p className="text-gray-600">
                        {error
                            ? 'Error al cargar las publicaciones.'
                            : 'No se encontraron publicaciones con los filtros seleccionados.'}
                    </p>
                    {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                </div>
            ) : (
                <>
                    {loading && items.length > 0 && (
                        <div className="flex justify-center py-4">
                            <Loader2 className="h-6 w-6 animate-spin text-purple-300" />
                        </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-2 p-2">
                        {items.map((item, index) => (
                            <CardBanned
                                key={index}
                                item={item}
                                itemType={itemType}
                                onBan={() => handleBanClick(item.id, itemType)}
                                disabled={disabled}
                            />
                        ))}
                    </div>
                </>
            )}

            {!error && totalPages > 0 && items.length > 0 && ( // Only show pagination if there are items and no critical error
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    size="md"
                />
            )}

            {modalOpen && (
                <ConfirmationModal
                    isOpen={modalOpen}
                    title="Confirmar Baneo"
                    message="¿Estás seguro de que deseas banear esta publicación? Esta acción no se puede deshacer."
                    textConfirm="Banear"
                    confirmVariant="danger"
                    onClose={() => setModalOpen(false)}
                    onConfirm={handleConfirmBan}
                />
            )}
        </div>
    );
}