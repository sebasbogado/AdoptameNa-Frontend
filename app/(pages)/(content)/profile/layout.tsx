'use client';

import "@/styles/globals.css";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect, useState, useCallback } from "react";
import Banners from "@/components/banners";
import { getPublicBanners } from "@/utils/banner.http";

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: RootLayoutProps) {
    const { authToken, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const [bannerImages, setBannerImages] = useState<string[]>([]);
    const fetchBanners = useCallback(async () => {
        try {
            const data = await getPublicBanners();
            const bannerUrls = data.map(banner => banner.imageUrl);
            setBannerImages(bannerUrls);
        } catch (error) {
            console.error('Error al cargar banners:', error);
            setBannerImages([]);
        }
    }, []);

    useEffect(() => {
        fetchBanners();
    }, [fetchBanners]);

    useEffect(() => {
        if (!authLoading && !authToken && pathname === '/profile') {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router, pathname]);

    if (authLoading) {
        return <Loading />;
    }

    const showBanner = pathname === "/profile/received-request/sponsors";

    return (
        <>
            {showBanner && bannerImages.length > 0 && <Banners images={bannerImages} />}
            {children}
            {showBanner}
        </>
    );
}
