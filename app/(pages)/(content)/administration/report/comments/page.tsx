'use client'

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ITEM_TYPE } from "@/types/constants";
import ReportListPage from "@/components/administration/report/report-list-page";
import { getReportedComments } from "@/utils/report-client";
import { SkeletonCard } from "@/components/ui/skeleton-card";

const ReportSkeleton = () => {
  return (
    <div className="p-6">
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2 p-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard
              key={idx}
              direction="horizontal"
              width="w-full"
              height="h-[200px]"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const { authToken, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pageSize = 6;

  useEffect(() => {
    if (!authLoading && !authToken) {
      router.push("/auth/login");
    } else if (user && user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [authToken, authLoading, router]);

  if (authLoading) {
    return <ReportSkeleton />;
  }

  return (
    <div className="p-6">
      <ReportListPage
        type={ITEM_TYPE.COMMENT}
        fetchFunction={async (page, size) => {
          if (!authToken) {
            throw new Error("No se ha encontrado el token de autenticación");
          }
          return await getReportedComments(authToken, { page, size });
        }}
        pageSize={pageSize}
        isPost={false}
      />
    </div>
  );
}