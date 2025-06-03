"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function VerifyEmailClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            return;
        }

        axios
            .post(`${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-email?token=${token}`)
            .then((response) => {
                if (response.status === 200) {
                    setStatus("success");
                    setTimeout(() => router.push("/auth/login"), 3000);
                } else {
                    setStatus("error");
                }
            })
            .catch(() => setStatus("error"));
    }, [searchParams, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md text-center w-96">
                {status === "loading" && (
                    <p className="text-gray-700">Verificando correo...</p>
                )}
                {status === "success" && (
                    <>
                        <p className="text-green-600 font-bold">
                            ¡Correo verificado con éxito!
                        </p>
                        <p className="text-gray-600">
                            Serás redirigido en unos segundos...
                        </p>
                    </>
                )}
                {status === "error" && (
                    <p className="text-red-600 font-bold">
                        Error al verificar el correo
                    </p>
                )}
            </div>
        </div>
    );
}