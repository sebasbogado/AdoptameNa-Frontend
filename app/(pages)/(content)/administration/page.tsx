"use client"
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { 
    Newspaper, 
    Flag, 
    Settings, 
    Users, 
    Bell,
    Trash2
} from "lucide-react";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!authToken) {
                router.push("/auth/login");
            }
            else if (user && user.role !== "admin") {
                router.push("/dashboard");
            }
        }
    }, [authToken, user, authLoading, router]);

    if (authLoading || !user || user.role !== "admin") {
        return <Loading />;
    }    return (
        <div className="p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold mb-2">Panel de Administración</h1>
                <p className="text-gray-600">Bienvenido, {user.fullName}. Selecciona una opción para gestionar la plataforma.</p>
            </div>

            {/* Sección de Gestión de Publicaciones */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Newspaper className="mr-2 h-6 w-6 text-blue-600" />
                    Gestión de Publicaciones
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/administration/posts">
                        <button className="bg-cyan-600 hover:bg-cyan-700 text-white py-3 px-5 rounded-lg flex items-center">
                            <Newspaper className="mr-2 h-5 w-5" />
                            Administrar Publicaciones
                        </button>
                    </Link>
                    <Link href="/administration/deleted-posts">
                        <button className="bg-cyan-100 hover:bg-cyan-200 text-cyan-800 py-3 px-5 rounded-lg flex items-center">
                            <Trash2 className="mr-2 h-5 w-5" />
                            Publicaciones Eliminadas
                        </button>
                    </Link>
                </div>
            </div>

            {/* Sección de Reportes */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Flag className="mr-2 h-6 w-6 text-red-600" />
                    Reportes
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/administration/report/pets">
                        <button className="bg-red-600 hover:bg-red-700 text-white py-3 px-5 rounded-lg flex items-center">
                            <Flag className="mr-2 h-5 w-5" />
                            Reportes de Mascotas
                        </button>
                    </Link>
                    <Link href="/administration/report/posts">
                        <button className="bg-red-100 hover:bg-red-200 text-red-800 py-3 px-5 rounded-lg flex items-center">
                            <Flag className="mr-2 h-5 w-5" />
                            Reportes de Publicaciones
                        </button>
                    </Link>
                    <Link href="/administration/report/products">
                        <button className="bg-red-100 hover:bg-red-200 text-red-800 py-3 px-5 rounded-lg flex items-center">
                            <Flag className="mr-2 h-5 w-5" />
                            Reportes de Productos
                        </button>
                    </Link>
                    <Link href="/administration/report/comments">
                        <button className="bg-red-100 hover:bg-red-200 text-red-800 py-3 px-5 rounded-lg flex items-center">
                            <Flag className="mr-2 h-5 w-5" />
                            Reportes de Comentarios
                        </button>
                    </Link>
                </div>
            </div>

            {/* Sección de Configuración */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Settings className="mr-2 h-6 w-6 text-purple-600" />
                    Configuración
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/administration/settings">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-5 rounded-lg flex items-center">
                            <Settings className="mr-2 h-5 w-5" />
                            Configuraciones Generales
                        </button>
                    </Link>
                    <Link href="/administration/settings/banner">
                        <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-5 rounded-lg flex items-center">
                            <Bell className="mr-2 h-5 w-5" />
                            Gestión de Banners
                        </button>
                    </Link>
                    <Link href="/administration/sponsors">
                        <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-5 rounded-lg flex items-center">
                            <Bell className="mr-2 h-5 w-5" />
                            Auspiciantes
                        </button>
                    </Link>
                    <Link href="/administration/notifications">
                        <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-5 rounded-lg flex items-center">
                            <Bell className="mr-2 h-5 w-5" />
                            Notificaciones
                        </button>
                    </Link>
                    <Link href="/administration/crowfunding">
                        <button className="bg-purple-100 hover:bg-purple-200 text-purple-800 py-3 px-5 rounded-lg flex items-center">
                            <Bell className="mr-2 h-5 w-5" />
                            Colectas
                        </button>
                    </Link>
                </div>
            </div>

            {/* Sección de Usuarios */}
            <div className="mb-10">
                <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Users className="mr-2 h-6 w-6 text-amber-600" />
                    Gestión de Usuarios
                </h2>
                <div className="flex flex-wrap gap-3">
                    <Link href="/administration/users">
                        <button className="bg-amber-600 hover:bg-amber-700 text-white py-3 px-5 rounded-lg flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Todos los Usuarios
                        </button>
                    </Link>
                    <Link href="/administration/users/regular">
                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-3 px-5 rounded-lg flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Usuarios Regulares
                        </button>
                    </Link>
                    <Link href="/administration/users/organizations">
                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-3 px-5 rounded-lg flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Organizaciones
                        </button>
                    </Link>
                    <Link href="/administration/users/admins">
                        <button className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-3 px-5 rounded-lg flex items-center">
                            <Users className="mr-2 h-5 w-5" />
                            Administradores
                        </button>
                    </Link>
                </div>
            </div>

        </div>
    );
}