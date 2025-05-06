'use client';

import { Roboto } from "next/font/google";
import "@/styles/globals.css";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Loading from "@/app/loading";
import { useEffect } from "react";
import NavbarReceivedRequest from "@/components/navbar-received-request";
import { AdoptionModeProvider } from "@/contexts/adoption-mode-context";
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500", "700"] });

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function ProfileLayout({ children }: RootLayoutProps) {
    const { authToken, loading: authLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Handle authentication check
    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

    if (authLoading) {
        return <Loading />;
    }

    const hideNavbar = pathname === "/profile/received-request";

    return (
        <AdoptionModeProvider>
            {!hideNavbar && (
                <div className="flex align-items-center justify-center">
                    <NavbarReceivedRequest />
                </div>
            )}
            {children}
        </AdoptionModeProvider>
    );
}
