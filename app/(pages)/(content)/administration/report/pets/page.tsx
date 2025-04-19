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
import ReportListPage from "@/components/administration/report/report-list-page";

export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pageSize = 20;

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }

  }, [authToken, authLoading, router]);

  return (
    <div className="p-6">
      <ReportListPage
        fetchFunction={async (page, size) => {
          if (!authToken) {
            throw new Error("No se ha encontrado el token de autenticación");
          }
          return await getReportedPets(authToken, { page, size });
        }
        }
        pageSize={pageSize}
        isPost={false}
      />
    </div>
  )
}