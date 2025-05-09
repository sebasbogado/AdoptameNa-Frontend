'use client'
import { useAuth } from "@/contexts/auth-context";
import { getReportedPosts } from "@/utils/report-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ReportListPage from "@/components/administration/report/report-list-page";
import { ITEM_TYPE } from "@/types/constants";

export default function Page() {
	const { authToken, user, loading: authLoading } = useAuth();
	const router = useRouter();
	const pageSize = 10;


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
				type={ITEM_TYPE.POST}
				fetchFunction={(page, size) => {
					if (!authToken) return Promise.reject(new Error("No se ha encontrado el token de autenticación"));
					return getReportedPosts(authToken, { page, size })
				}
				}
			/>
		</div>

	)
}