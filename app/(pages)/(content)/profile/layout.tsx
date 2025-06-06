'use client';

import "@/styles/globals.css";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect, useState, useCallback } from "react";
import { getPublicBanners } from "@/utils/banner.http";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: RootLayoutProps) {
    const { authToken, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!authLoading && !authToken && pathname === '/profile') {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router, pathname]);

    if (authLoading) {
        return <Loading />;
    }


    return (
        <>
            {children}
        </>
    );
}
