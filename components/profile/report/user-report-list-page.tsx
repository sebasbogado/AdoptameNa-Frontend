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
import { getProduct } from '@/utils/product.http';
import { ReportType } from "@/types/report";
import { Product } from '@/types/product';
import { Pet } from '@/types/pet';
import { Post } from '@/types/post';

interface Props<T> {
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  pageSize?: number;
  isPost?: boolean;
}

type EnrichedReport<T> = T & { pet?: Pet; post?: Post; product?: Product };

export default function UserReportListPage<T extends {
  productId?: number | null; petId?: number | null; postId?: number | null
}>({
  fetchFunction,
  pageSize = 20,
  isPost = true
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
  const [reportType, setReportType] = useState<string | null>(null);

  const reportTypeTitles: Record<string, string> = {
    POST: "Publicaciones reportadas",
    PET: "Mascotas reportadas",
    PRODUCT: "Productos reportados",
    COMMENT: "Comentarios reportados",
  };

  useEffect(() => {
    if (!authToken || loading || !data.length) return;

    const fetchDetails = async () => {
      const seenIds = new Set();

      const fetchPromises = data.map(async (item) => {
        const id = item.petId ?? item.postId ?? item.productId;
        if (!id || seenIds.has(id)) return null;

        try {
          if (item.petId) {
            const pet = await getPet(String(item.petId));
            setReportType(ReportType.PET);
            seenIds.add(id);
            return { ...item, pet };
          } else if (item.postId) {
            const post = await getPost(String(item.postId));
            setReportType(ReportType.POST);
            seenIds.add(id);
            return { ...item, post };
          } else if (item.productId) {
            const product = await getProduct(String(item.productId));
            setReportType(ReportType.PRODUCT);
            seenIds.add(id);
            return { ...item, product };
          }
        } catch (err) {
          console.error("Error al enriquecer reporte", err);
          return null;
        }
      });

      const results = await Promise.all(fetchPromises);
      const enrichedData = results.filter((item) => item !== null) as EnrichedReport<T>[];
      setEnrichedData(enrichedData);

    };

    fetchDetails();
  }, [authToken, data, loading]);

  return (
    <div>
      <UserSectionReport title={reportTypeTitles[reportType ?? "POST"]} />

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

            const hasObject = item.pet || item.post || item.product;
            if (!hasObject) return null;

            return (
              <UserReportCardButtons
                key={index}
                post={item.pet || item.post || item.product}
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
