"use client"
import Loading from "@/app/loading";
import Footer from "@/components/footer";
import NavbarAdmin from "@/components/navbar-admin";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    // Handle authentication check
    useEffect(() => {
        if (!authLoading) {
            // If not authenticated, redirect to login
            if (!authToken) {
                router.push("/auth/login");
            }
            // If authenticated but not admin, redirect to dashboard
            else if (user && user.role !== "admin") {
                router.push("/dashboard");
            }
        }
    }, [authToken, user, authLoading, router]);

    // Show loading while checking auth or if not admin
    if (authLoading || !user || user.role !== "admin") {
        return <Loading />;
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center">
                <NavbarAdmin />
            </div>
            <div>
                Administration
            </div>
            <Footer />
        </>
    );
}