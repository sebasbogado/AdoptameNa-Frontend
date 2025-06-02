"use client"
import Loading from "@/app/loading";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Newspaper,
    Flag,
    Settings,
    Users,
    Bell,
    Trash2,
    User,
    Footprints,
    Send,
    CheckCircle,
    FootprintsIcon,
    Dog,
    Home
} from "lucide-react";
import StatCard from "@/components/administration/estatistics/card";
import { getStatisticsOverview } from "@/utils/statistics";
import { Statistics } from "@/types/statistics";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [statistics, setStatistics] = useState<Statistics>();

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
    useEffect(() => {
        if (authToken && user && user.role !== "admin") {
            router.push("/dashboard");
        }
        const fetchStatistics = async () => {
            try {
                const response = await getStatisticsOverview(authToken || "");
                console.log("Estadísticas obtenidas:", response);
                setStatistics(response);
            } catch (error) {
                console.error("Error al obtener estadísticas:", error);
            }
        };
        if (authToken) {
            fetchStatistics();
        }
    }, [authToken, user, router]);

    if (authLoading || !user || user.role !== "admin") {
        return <Loading />;
    }
    return (
        <div className="  p-4 sm:p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Panel de Administración</h1>
                <p className="text-gray-600 text-base md:text-lg">Bienvenido, {user.fullName}. Selecciona una opción para gestionar la plataforma.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
                <StatCard icon={<Users className="w-9 h-9 text-white" />} value={statistics?.totalUsers ?? 0} bg="bg-purple-300" label="Usuarios" />
                <StatCard icon={<Newspaper className="w-9 h-9 text-white" />} value={statistics?.totalPosts ?? 0} bg="bg-btn-action" label="Publicaciones" />
                <StatCard icon={<Dog className="w-9 h-9 text-orange-600" />} value={statistics?.totalPets ?? 0} label="Mascotas" />
                <StatCard icon={<Send className="w-9 h-9 text-blue" />} value={statistics?.totalAdoptionRequests ?? 0} label="Solicitudes de adoption" />
                <StatCard icon={<CheckCircle className="w-9 h-9 text-green-600" />} value={statistics?.totalVerifiedUsers ?? 0} label="Cuentas verificados" />
            </div>
            <div>
                <div>
                    

                </div>
                <div>

                </div>
            </div>


        </div>
    );
}