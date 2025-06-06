'use client'

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReportListPage from "@/components/administration/report/report-list-page";
import { getReportedProducts } from "@/utils/report-client";
import { ITEM_TYPE } from "@/types/constants";
import BackButton from "@/components/buttons/back-button";

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
                  <BackButton path="/administration/report"/>
      
      <ReportListPage
        type={ITEM_TYPE.PRODUCT}
        fetchFunction={async (page, size) => {
          if (!authToken) {
            throw new Error("No se ha encontrado el token de autenticación");
          }
          return await getReportedProducts(authToken, { page, size });
        }
        }
        pageSize={pageSize}
        isPost={false}
      />
    </div>
  )
}