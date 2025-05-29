'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React, { useState } from 'react';
import SectionAdmin from '../section';
import CardDeleted from './card-deleted';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { Product } from '@/types/product';
import { unbanPost } from '@/utils/posts.http';
import { unbanPet } from '@/utils/pets.http';
import { unbanProduct } from '@/utils/product.http';
import { useAuth } from '@/contexts/auth-context';
import { ITEM_TYPE } from '@/types/constants';
import { ConfirmationModal } from '@/components/form/modal';
import { Alert } from '@material-tailwind/react';
import { X } from 'lucide-react';

interface Props<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  itemType: ITEM_TYPE;
  disabled?: boolean;
  updateFilters?: (filters: Record<string, any>) => void;
}

export default function DeletedListPage<T extends Post | Pet | Product>({
  items,
  loading,
  error,
  currentPage,
  totalPages,
  handlePageChange,
  itemType,
  disabled = false,
  updateFilters,
}: Props<T>) {

  const { authToken } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [restoreId, setRestoreId] = useState<string | null>(null);
  const [restoreType, setRestoreType] = useState<string | null>(null);
  const [errorAlert, setErrorAlert] = useState<string | null>(null);

  const handleRestore = async (id: string, type: string) => {
    if (!authToken) { return; }

    try {
      switch (type) {
        case 'post':
          await unbanPost(id, authToken);
          break;
        case 'pet':
          await unbanPet(id, authToken);
          break;
        case 'product':
          await unbanProduct(id, authToken);
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
          handlePageChange(1);
        }, 100);
      }
    } catch (error) {
      setErrorAlert('Ocurrió un error al restaurar la publicación.');
    }
  };

  const handleRestoreClick = (id: string, type: string) => {
    setRestoreId(id);
    setRestoreType(type);
    setModalOpen(true);
  };

  const handleConfirmRestore = async () => {
    if (restoreId && restoreType) {
      await handleRestore(restoreId, restoreType);
      setModalOpen(false);
    }
  };

  return (
    <div>
      <SectionAdmin title="Restaurar Publicaciones">Todas la publicaciones reportadas se encuentran acá y pueden ser restauradas en caso de ser necesario</SectionAdmin>

      {/* Muestra el error si existe */}
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full my-4">
          {error || 'Error al cargar los datos'}
        </div>
      )}

      {/* Muestra el loader si está cargando */}
      {loading ? (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : items.length > 0 ? ( // Verifica si hay posts para mostrar
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {items.map((item, index) => (
            <CardDeleted
              key={(item as any)?.id || index}
              item={item}
              itemType={itemType}
              onRestore={() => handleRestoreClick(String(item.id), itemType)}
              disabled={disabled}
            />
          ))}
        </div>
      ) : (
        // Muestra mensaje si no hay datos y no está cargando
        <div className="text-center p-10 bg-gray-50 rounded-lg mt-4">
          <p className="text-gray-600">No se encontraron publicaciones eliminadas {error ? 'debido a un error.' : 'con los filtros seleccionados.'}</p>
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

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmRestore}
        title="¿Restaurar publicación?"
        message="¿Estás seguro de que deseas restaurar esta publicación?"
        confirmVariant="cta"
        textConfirm="Confirmar"
      />

      {/* Alerta de error */}
      {errorAlert && (
        <Alert
          open={!!errorAlert}
          color="red"
          animate={{ mount: { y: 0 }, unmount: { y: -100 } }}
          icon={<X className="h-5 w-5" />}
          onClose={() => setErrorAlert(null)}
          className="fixed top-4 right-4 w-72 shadow-lg z-[10001]"
        >
          <p className="text-sm">{errorAlert}</p>
        </Alert>
      )}
    </div>
  );
}