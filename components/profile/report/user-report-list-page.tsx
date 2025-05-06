'use client';

import { Loader2 } from 'lucide-react';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { PaginatedResponse } from '@/types/pagination';
import React, { useEffect, useState } from 'react';
import UserSectionReport from './user-section-report';
import UserReportCardButtons from './user-report-card-button';
import { useAuth } from '@/contexts/auth-context';
import { getPost } from '@/utils/posts.http';
import { getPet } from '@/utils/pets.http';

interface Props<T> {
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  pageSize?: number;
  isPost?: boolean;
}

type EnrichedReport<T> = T & { pet?: any; post?: any };

export default function UserReportListPage<T extends { petId?: number | null; postId?: number | null }>({
  fetchFunction,
  pageSize = 20,
  isPost = true,
}: Props<T>) {
  const { authToken } = useAuth();
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

  const [enrichedData, setEnrichedData] = useState<EnrichedReport<T>[]>([]);

  useEffect(() => {
    if (!authToken || loading || !data.length) return;
  
    const fetchDetails = async () => {
      const seenIds = new Set(); 
      const enriched: EnrichedReport<T>[] = [];
  
      for (const item of data) {
        const id = item.petId ?? item.postId;
        if (!id || seenIds.has(id)) continue; 
  
        try {
          if (item.petId) {
            const pet = await getPet(String(item.petId));
            enriched.push({ ...item, pet });
          } else if (item.postId) {
            const post = await getPost(String(item.postId));
            enriched.push({ ...item, post });
          }
          seenIds.add(id);
        } catch (err) {
          console.error("Error al enriquecer reporte", err);
        }
      }
  
      setEnrichedData(enriched);
    };
  
    fetchDetails();
  }, [authToken, data, loading]);

  return (
    <div>
      <UserSectionReport title={isPost ? "Publicaciones reportadas" : "Mascotas reportadas"} />

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
          {error.message || 'Error al cargar los reportes'}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>
      ) : data.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
          <p className="text-gray-600">No se encontraron reportes</p>
        </div>
      ) : enrichedData.length === 0 ? (
        <div className="text-center p-10 bg-yellow-50 text-yellow-700 rounded-lg w-full max-w-md">
          <p>No se pudo cargar la información de las {isPost ? "publicaciones" : "mascotas"} reportadas.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
          {enrichedData.map((item, index) => {
            const hasObject = item.pet || item.post;
            if (!hasObject) return null;

            return (
              <UserReportCardButtons
                key={index}
                post={item.pet || item.post}
                isPost={!!item.post}
              />
            );
          })}
        </div>
      )}

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size="md"
      />
    </div>
  )
}
