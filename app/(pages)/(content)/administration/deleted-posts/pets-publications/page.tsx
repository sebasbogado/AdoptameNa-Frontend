'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DeletedListPage from "@/components/administration/deleted/deleted-list-page";
import { getDeletedPosts } from "@/utils/posts.http";

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
                    return getDeletedPosts(authToken, { page, size })}
                }
            />
        </div>
        
    )
}