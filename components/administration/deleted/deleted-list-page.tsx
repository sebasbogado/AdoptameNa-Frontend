'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React from 'react';
import SectionAdmin from '../section';
import CardDeleted from './card-deleted';
import { Post } from '@/types/post';
import { Pet } from '@/types/pet';
import { Product } from '@/types/product';
import { restorePost } from '@/utils/posts.http';
// import { restorePet } from '@/utils/pets.http';
import { useAuth } from '@/contexts/auth-context';
import { ITEM_TYPE } from '@/types/constants';

interface Props<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  itemType: ITEM_TYPE;
  disabled?: boolean;
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
}: Props<T>) {

  const { authToken } = useAuth();

  const handleRestore = async (id: string, type: string) => {
    if (!authToken) { return; }

    try {
      const payload = { isDeleted: false };

      // Usa el tipo para llamar a la API correcta
      switch (type) {
        case 'post':
          // await restorePost(id, payload, authToken);
          break;
        case 'pet':
          // await restorePet(id, payload, authToken);
          break;
        case 'product':
          //await updateProduct(id, payload, authToken);
          break;
        default:
          console.error(`Tipo desconocido: ${type}`);
          throw new Error("Tipo de item no soportado");
      }
      // handlePageChange(currentPage); // O refresca datos como lo hacías antes

    } catch (error) {
      console.error(`Error restaurando ${type} ID ${id}:`, error);
      // Notificación de error
    }
  };

  return (
    <div>
      <SectionAdmin title="Restaurar Publicaciones">Todas la publicaciones eliminadas se encuentra acá y pueden ser restauradas en caso de ser necesario</SectionAdmin>

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
              onRestore={() => handleRestore(String(item.id), itemType)}
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
    </div>
  );
}