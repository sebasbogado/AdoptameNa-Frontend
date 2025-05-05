'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { PaginatedResponse } from '@/types/pagination';
import React from 'react';
import SectionAdmin from '../section';
import CardDeleted from './card-deleted';

interface Props<T> {
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  pageSize?: number;
  isPost?: boolean;
}

export default function DeletedListPage<T>({
  fetchFunction,
  pageSize = 20,
  isPost = true,
}: Props<T>) {
  const {
    data,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange,
  } = usePagination<T>({
    fetchFunction,
    initialPage: 1,
    initialPageSize: pageSize,
  });

  return (
    <div>
      <SectionAdmin title="Restaurar Publicaciones">Todas la publicaciones eliminadas se encuentra acá y pueden ser restauradas en caso de ser necesario</SectionAdmin>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
          {error.message || 'Error al cargar los reportes'}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : data.length !== 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {data.map((item, index) => (
            <CardDeleted key={index} post={item} isPost={isPost}/>
          ))}
        </div>
      ) : (
        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
          <p className="text-gray-600">No se encontraron reportes</p>
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="md"
      />
    </div>
  );
}
