import { useState, useEffect, useRef, useCallback } from "react";
import { PaginatedResponse } from "@/types/pagination";

type UsePaginationProps<T> = {
  fetchFunction: (page: number, size: number) => Promise<PaginatedResponse<T>>;
  initialPage?: number;
  initialPageSize?: number;
};

export function usePagination<T>({
  fetchFunction,
  initialPage = 1,
  initialPageSize = 10,
}: UsePaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalElements, setTotalElements] = useState<number>(0);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);

  const fetchFunctionRef = useRef(fetchFunction);

  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  }, [fetchFunction]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFunctionRef.current(
          currentPage - 1,
          pageSize
        );

        setData(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotalElements(response.pagination.totalElements);
        setIsLastPage(response.pagination.last);
      } catch (error) {
        setError(
          error instanceof Error ? error : new Error("Error desconocido")
        );
        console.error("Error fetching paginated data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" }); //se podria quitar o poner como opcional
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
  }, []);

  return {
    data,
    loading,
    error,
    currentPage,
    pageSize,
    totalPages,
    totalElements,
    isLastPage,
    handlePageChange,
    handlePageSizeChange,
  };
}
