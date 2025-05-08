import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React, { useEffect, useState } from 'react';
import SectionAdmin from '../section';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { Product } from '@/types/product';
import { useAuth } from '@/contexts/auth-context';
// import { ITEM_TYPE } from '@/types/constants';
import CardBanned from './card-banned';
import { banPet, banPost, banProduct } from '@/utils/report-client';
import { Alert } from '@material-tailwind/react';
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
    itemType: /*ITEM_TYPE*/ string;
    disabled?: boolean;
}

export default function AllPostListPage<T extends Post | Pet | Product>({
    items,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
    itemType,
    disabled = false,
}: Props<T>) {

    const { authToken } = useAuth();
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [localItems, setLocalItems] = useState<T[]>(items);

    useEffect(() => {
        setLocalItems(items);
    }, [items]);

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

    const handleBan = async (id: string, type: string) => {
        if (!authToken) { return; }

        try {
            switch (type) {
                case 'post':
                    try {
                        await banPost(parseInt(id as string, 10), authToken);
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
                        await banPet(parseInt(id as string, 10), authToken);
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
                        await banProduct(parseInt(id as string, 10), authToken);
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

        } catch (error) {
            setErrorMessage("Hubo un error al intentar banear una publicación.");
        }
    };

    return (
        <div>
            <SectionAdmin title="Banear Publicaciones">Todas la publicaciones se encuentra acá y pueden ser baneadas en caso de ser necesario</SectionAdmin>

            {/* Mensajes de feedback */}
            <div className="w-full flex justify-end">
                {successMessage && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto z-50">
                        <Alert color="green" onClose={() => setSuccessMessage("")}>
                            {successMessage}
                        </Alert>
                    </div>
                )}
                {errorMessage && (
                    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-auto z-50">
                        <Alert color="red" onClose={() => setErrorMessage("")}>
                            {errorMessage}
                        </Alert>
                    </div>
                )}
            </div>

            {/* Muestra el loader si está cargando */}
            {loading ? (
                <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                </div>
            ) : localItems.length > 0 ? ( // Verifica si hay posts para mostrar
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                    {localItems.map((item, index) => (
                        <CardBanned
                            key={(item as any)?.id || index}
                            item={item}
                            itemType={itemType}
                            onBan={() => handleBan(String(item.id), itemType)}
                            disabled={disabled}
                        />
                    ))}
                </div>
            ) : (
                // Muestra mensaje si no hay datos y no está cargando
                <div className="text-center p-10 bg-gray-50 rounded-lg mt-4">
                    <p className="text-gray-600">No se encontraron publicaciones {error ? 'debido a un error.' : 'con los filtros seleccionados.'}</p>
                </div>
            )}

            {!error && totalPages > 1 && (
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    size="md"
                />
            )}
        </div>
    );
}