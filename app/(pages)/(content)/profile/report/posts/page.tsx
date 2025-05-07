'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import UserReportListPage from "@/components/profile/report/user-report-list-page";
import { getUserReports } from "@/utils/reports.http";
import { ReportType } from "@/types/report";
import Button from "@/components/buttons/button";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pageSize = 20;

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    }

  }, [authToken, authLoading, router]);

  return (
    <div className="p-6">
      <Button size="md" onClick={() => router.push("/profile/report")} className="mb-6 mr-12 bg-white flex justify-between items-center shadow -md text-gray-800">
        <ArrowLeft className="text-gray-800 pr-1 " size={20} />
        Volver
      </Button>
      <UserReportListPage
        fetchFunction={async (page, size) => {
          if (!authToken) {
            throw new Error("No se ha encontrado el token de autenticación");
          }
          return await getUserReports(authToken, { page, size, reportType: ReportType.POST });
        }
        }
        pageSize={pageSize}
        isPost={true}
      />
    </div>
  )
}