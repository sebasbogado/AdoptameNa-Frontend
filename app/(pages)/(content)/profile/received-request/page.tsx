"use client"
import { Medal, Send, Inbox, Building2Icon } from "lucide-react";
import Link from "next/link";
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ReceivedRequestsPage() {
    const { authToken, loading: authLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        }
    }, [authToken, authLoading, router]);

    if (authLoading) {
        return <Loading />;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-8">Mis solicitudes</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(user?.role === 'admin' || user?.role === 'organization') && (
                    <>
                    <Link href="/profile/received-request/sponsors">
                        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                            <div className="bg-yellow-100 p-4 rounded-full mb-4">
                                <Medal size={48} className="text-yellow-600" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Auspiciantes</h2>
                            <p className="text-gray-600 text-center">Ver y gestionar tus solicitudes de auspicio</p>
                        </div>
                    </Link>
                     <Link href="/profile/received-request/crowdfunding-sent">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <Building2Icon size={48} className="text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Crowdfunding</h2>
                        <p className="text-gray-600 text-center">Solicitudes de colecta que enviaste</p>
                    </div>
                </Link>
                                    </>

                )}
                <Link href="/profile/received-request/adoption-sent">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="bg-blue-100 p-4 rounded-full mb-4">
                            <Send size={48} className="text-blue-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Adopción saliente</h2>
                        <p className="text-gray-600 text-center">Solicitudes de adopción que enviaste</p>
                    </div>
                </Link>
                <Link href="/profile/received-request/adoption-received">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="bg-purple-100 p-4 rounded-full mb-4">
                            <Inbox size={48} className="text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Adopción entrante</h2>
                        <p className="text-gray-600 text-center">Solicitudes de adopción que recibiste</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}