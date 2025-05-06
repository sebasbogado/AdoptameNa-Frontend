'use client';

import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect, useState, useCallback } from "react";
import NavbarReceivedRequest from "@/components/navbar-received-request";
import { AdoptionModeProvider } from "@/contexts/adoption-mode-context";
import Banners from "@/components/banners";
import Footer from "@/components/footer";
import { getPublicBanners } from "@/utils/banner.http";
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

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
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

    if (authLoading) {
        return <Loading />;
    }

    const hideNavbar = pathname === "/profile/received-request";
    const showBanner = pathname === "/profile/received-request/sponsors";

    return (
        <AdoptionModeProvider>
            {!hideNavbar && (
                <div className="flex align-items-center justify-center">
                    <NavbarReceivedRequest />
                </div>
            )}
            {showBanner && bannerImages.length > 0 && <Banners images={bannerImages} />}
            {children}
            {showBanner && <Footer />}
        </AdoptionModeProvider>
    );
}
