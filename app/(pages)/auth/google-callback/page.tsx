'use client'
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GoogleCallback() {
    const { user, loginWithGoogle, loading } = useAuth();
    const params = useSearchParams();

    const allParamsString = params.toString();

    const code = params.get("code");
    const router = useRouter();

    if (!code) {
        router.push("/auth/login");
        return
    }
    useEffect(() => {
        if (user && !loading) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);


    useEffect(() => {
        if (!user && !loading) {
            loginWithGoogle(allParamsString);
        }
    }, [code, user, loading, allParamsString]);

    return Loading();
}