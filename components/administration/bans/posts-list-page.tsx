import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React, { useEffect, useState } from 'react';
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
import { getPosts } from '@/utils/posts.http';
import { getPets } from '@/utils/pets.http';
import { getProducts } from '@/utils/product.http';

interface Props<T> {
    items: T[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    handlePageChange: (page: number) => void;
    itemType: ITEM_TYPE;
}

export default function AllPostListPage<T extends Post | Pet | Product>({
    items,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    itemType,
}: Props<T>) {
    const { authToken } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [localItems, setLocalItems] = useState<T[]>(items);

    // --- Modal State ---
    const [isBanModalOpen, setIsBanModalOpen] = useState<boolean>(false);
    const [itemToBanId, setItemToBanId] = useState<string | null>(null);
    const [typeToBanString, setTypeToBanString] = useState<string | null>(null);

    const fetchItems = async () => {
        try {
            let data: T[];

            switch (itemType) {
                case 'post':
                    data = (await getPosts()).data as T[]; break;
                case 'pet':
                    data = (await getPets()).data as T[]; break;
                case 'product':
                    data = (await getProducts()).data as T[]; break;
                default:
                    data = []; break;
            }

            setLocalItems(data);
        } catch (error) {
            console.error("Error al actualizar los datos:", error);
        }
    };
            
    useEffect(() => {
        setLocalItems(items);
    }, [items]);

    // --- Modal Functions ---
    const openBanModal = (id: string, type: string) => {
        setItemToBanId(id);
        setTypeToBanString(type);
        setIsBanModalOpen(true);
        setErrorMessage("");
    };

    const closeModal = () => {
        setIsBanModalOpen(false);
        setItemToBanId(null);
    };

    const confirmBanAction = async () => {
        if (!itemToBanId || !authToken || !typeToBanString) {
            setErrorMessage("No se seleccionó un item o falta autorización.");
            closeModal();
            return;
        }
        setErrorMessage("");
        setSuccessMessage("");

        try {
            switch (typeToBanString) {
                case 'post':
                    try {
                        await banPost(parseInt(itemToBanId as string, 10), authToken);
                        setSuccessMessage("Publicación baneada exitosamente.");
                        setTimeout(() => setSuccessMessage(""), 2500);
                    } catch {
                        setErrorMessage("Hubo un error al banear la publicación.");
                    } finally {
                        await fetchItems();
                    }
                    break;
                case 'pet':
                    try {
                        await banPet(parseInt(itemToBanId as string, 10), authToken);
                        setSuccessMessage("Publicación de mascota baneada exitosamente.");
                        setTimeout(() => setSuccessMessage(""), 2500);
                    } catch {
                        setErrorMessage("Hubo un error al banear la publicación.");
                    } finally {
                        await fetchItems();
                    }
                    break;
                case 'product':
                    try {
                        await banProduct(parseInt(itemToBanId as string, 10), authToken);
                        setSuccessMessage("Publicación de producto baneada exitosamente.");
                        setTimeout(() => setSuccessMessage(""), 2500);
                    } catch {
                        setErrorMessage("Hubo un error al banear la publicación.");
                    } finally {
                        await fetchItems();
                    }
                    break;
                default:
                    setErrorMessage("Hubo un error al intentar banear una publicación.");
            }
            handlePageChange(currentPage);

        } catch (error: unknown) {
            setErrorMessage("Hubo un error al intentar banear una publicación.");
            console.error("Error al banear la publicación:", error);
        } finally {
            closeModal();
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
                    {errorMessage && !isBanModalOpen && ( // Don't show general error if modal is open and might show its own
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
            ) : !loading && localItems.length === 0 ? (
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
                        {localItems.map((item, index) => (
                            <CardBanned
                                key={(item as Post | Pet | Product)?.id || index}
                                item={item as Post | Pet | Product}
                                itemType={itemType}
                                onBan={() => openBanModal(String(item.id), itemType)}
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

            {isBanModalOpen && (
                <ConfirmationModal
                    isOpen={isBanModalOpen}
                    title="Confirmar Baneo"
                    message="¿Estás seguro de que deseas banear esta publicación? Esta acción no se puede deshacer."
                    textConfirm="Banear"
                    confirmVariant="danger"
                    onClose={closeModal}
                    onConfirm={confirmBanAction} // Use the new handler
                />
            )}
        </div>
    );
}