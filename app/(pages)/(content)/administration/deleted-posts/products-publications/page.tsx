'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getDeletedProducts } from "@/utils/product.http";
import DeletedListPage from "@/components/administration/deleted/deleted-list-page";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        } else if (user && user.role !== "admin") {
            router.push("/dashboard");
        }

    }, [authToken, authLoading, router]);

    return (
        <div className="p-6">
            <DeletedListPage
                fetchFunction={(page, size) => {
                    if(!authToken) return Promise.reject(new Error("No se ha encontrado el token de autenticación"));
                    return getDeletedProducts(authToken, { page, size })}
                }
            />
        </div>
        
    )
}