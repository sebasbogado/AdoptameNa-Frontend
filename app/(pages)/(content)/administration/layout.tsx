'use client';

import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import {  useAuth } from "@/contexts/auth-context";
import NavbarAdmin from "@/components/navbar-admin";
import { useRouter } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect } from "react";


interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
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


                <NavbarAdmin />

            {children}
        </>

    );
}
