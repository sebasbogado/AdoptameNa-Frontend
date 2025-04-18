'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { PaginatedResponse } from '@/types/pagination';
import React from 'react';
import SectionAdmin from '../section';
import CardReport from "@/components/administration/report/card-button";

interface Props<T> {
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  pageSize?: number;
}

export default function ReportListPage<T>({
  fetchFunction,
  pageSize = 20,
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
      <SectionAdmin title="Aprobar o rechazar denuncias">Bloquear un reporte indica que es correcto y se eliminará la publicación, mantener un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>

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
            <CardReport key={index} post={item}/>
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
