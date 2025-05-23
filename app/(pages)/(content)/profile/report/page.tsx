"use client"
import { PawPrint, FileX, MessageCircleX, PackageX } from "lucide-react";
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
            <h1 className="text-2xl font-bold mb-8">Mis Reportes</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/profile/report/pets">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className=" p-4 rounded-full mb-4">
                            <PawPrint size={48} className="text-black" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Mascotas</h2>
                        <p className="text-gray-600 text-center">Ver tus reportes de mascotas</p>
                    </div>
                </Link>
                <Link href="/profile/report/posts">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="p-4 rounded-full mb-4">
                            <FileX size={48} className="text-black" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Publicaciones</h2>
                        <p className="text-gray-600 text-center">Ver tus reportes de publicaciones</p>
                    </div>
                </Link>
                <Link href="/profile/report/products">
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="p-4 rounded-full mb-4">
                            <PackageX size={48} className="text-black" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Productos</h2>
                        <p className="text-gray-600 text-center">Ver tus reportes de productos</p>
                    </div>
                </Link>
                <Link href={user ? `/profile/report/comments/${user.id}` : "#"}>
                    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow flex flex-col items-center cursor-pointer">
                        <div className="p-4 rounded-full mb-4">
                            <MessageCircleX size={48} className="text-black" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Comentarios</h2>
                        <p className="text-gray-600 text-center">Ver tus reportes de comentarios</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}