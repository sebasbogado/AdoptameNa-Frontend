'use client'
import CardReport from "@/components/administration/report/card-button";
import SectionAdmin from "@/components/administration/section";
import { useAuth } from "@/contexts/auth-context";
import { Pet } from "@/types/pet";
import { getReportedPets } from "@/utils/report-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { usePagination } from '@/hooks/use-pagination';
import Pagination from "@/components/pagination";
import { Loader2 } from 'lucide-react';


export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pageSize = 10;

  const {
    data: pets,
    loading,
    error,
    currentPage,
    totalPages,
    handlePageChange
  } = usePagination<Pet>({
    fetchFunction: async (page, size) => {
      if (!authToken) {
        throw new Error("No se ha encontrado el token de autenticación");
      }
      return await getReportedPets(authToken, { page, size });
    },
    initialPage: 1,
    initialPageSize: pageSize
  });

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }

  }, [authToken, authLoading, router]);

  return (
    <div className="p-6">
      <SectionAdmin title="Aprobar o rechazar denuncias">Bloquear un reporte indica que es correcto y se eliminará la publicación, mantener un reporte indica que el reporte no es correcto y la publicación seguirá activa</SectionAdmin>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
          {error.message || 'Error al cargar las publicaciones reportadas'}
        </div>
      )}
      {loading ? (
        <div className="flex justify-center items-center">
          <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
        </div>) : (
        pets.length !== 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
            {pets.map((pet, index) => (
              <CardReport key={index} post={pet} isPost={false} />
            ))}
          </div>
        ) : (
          <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
            <p className="text-gray-600">No hay mascotas reportadas</p>
          </div>
        )
      )}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        size='md'
      />
    </div>
  )
}