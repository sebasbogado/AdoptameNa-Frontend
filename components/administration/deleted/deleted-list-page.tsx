'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import React from 'react';
import SectionAdmin from '../section';
import CardDeleted from './card-deleted';
import { Post } from '@/types/post';

interface Props<T> {
  posts: T[]; 
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  isPost?: boolean; 
}

export default function DeletedListPage<T extends Post | any>({
  posts,
  loading,
  error,
  currentPage,
  totalPages,
  handlePageChange,
  isPost = true,
}: Props<T>) {

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
      ) : posts.length > 0 ? ( // Verifica si hay posts para mostrar
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {posts.map((item, index) => (
            <CardDeleted key={(item as any)?.id || index} post={item} isPost={isPost} />
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