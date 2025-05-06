'use client';

import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect } from "react";
import NavbarReceivedRequest from "@/components/navbar-received-request";
import { AdoptionModeProvider } from "@/contexts/adoption-mode-context";
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: RootLayoutProps) {
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

        <AdoptionModeProvider>
            <div className="flex align-items-center justify-center">
                <NavbarReceivedRequest />
            </div>
            {children}
        </AdoptionModeProvider>
        </>

    );
}
