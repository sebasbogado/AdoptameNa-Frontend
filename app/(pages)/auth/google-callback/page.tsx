'use client'
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { Alert } from "@material-tailwind/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const handleGoogleLoginFlow = async (
    loginWithGoogle: (params: string) => Promise<void>,
    params: string,
    setShowAlert: (show: boolean) => void,
    setErrorMessage: (message: string) => void,
    router: ReturnType<typeof useRouter>
) => {
    try {
        await loginWithGoogle(params);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error al iniciar sesión con Google:", errorMessage);
        setShowAlert(true);
        setErrorMessage(`Error al iniciar sesión con Google: ${errorMessage}. Por favor, inténtalo de nuevo.`);

        setTimeout(() => {
            router.push("/auth/login");
        }, 3000);
    }
};

export default function GoogleCallback() {
    const { user, loginWithGoogle, loading } = useAuth();
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
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
            handleGoogleLoginFlow(loginWithGoogle, allParamsString, setShowAlert, setErrorMessage, router);
        }
    }, [code, user, loading, allParamsString, loginWithGoogle, router]);

    return (
        <>
            <Loading />
            {
                showAlert && (
                    <Alert color="red" className="fixed top-0 left-1/2 transform -translate-x-1/2 mt-4 w-96 z-50">
                        {errorMessage}
                    </Alert>
                )
            }
        </>
    )
}