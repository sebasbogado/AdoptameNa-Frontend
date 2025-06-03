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
    Home,
    DollarSign
} from "lucide-react";
import StatCard from "@/components/administration/estatistics/card";
import { getStatisticsContent, getStatisticsOverview } from "@/utils/statistics";
import { StatisticsContent, StatisticsOverview } from "@/types/statistics";
import PieC from "@/components/administration/estatistics/graph/pie";
import PieChartWithLegend from "@/components/administration/estatistics/graph/pie";
import DonutChartWithText from "@/components/administration/estatistics/graph/donut";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [statistics, setStatistics] = useState<StatisticsOverview>();
    const [statisticsContent, setStatisticsContent] = useState<StatisticsContent>();

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
                const responseContent = await getStatisticsContent(authToken || "");
                console.log("Estadísticas de contenido obtenidas:", responseContent);
                setStatisticsContent(responseContent);
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
                <StatCard
                    icon={<Users className="w-9 h-9 text-white" />}
                    value={statistics?.usersCreatedThisWeek ?? 0}
                    growthPercentage={statistics?.usersGrowthPercentage}
                    bg="bg-purple-300"
                    growthLabel="semana anterior"

                    label="Usuarios"
                />

                <StatCard
                    icon={<Newspaper className="w-9 h-9 text-white" />}
                    value={statistics?.postsCreatedThisWeek ?? 0}
                    growthPercentage={statistics?.postsGrowthPercentage}
                    bg="bg-btn-action"
                    growthLabel="semana anterior"

                    label="Publicaciones"
                />

                <StatCard
                    icon={<Dog className="w-9 h-9 text-red-300" />}
                    value={statistics?.totalPets ?? 0}
                    growthPercentage={statisticsContent?.petsGrowthPercentage}
                    growthLabel="semana anterior"

                    label="Mascotas"
                />
                <StatCard
                    icon={<DollarSign className="w-9 h-9 text-orange-300" />}
                    value={statistics?.totalCrowdfunding ?? 0}
                    growthPercentage={statistics?.crowdfundingGrowthPercentage}
                    growthLabel="semana anterior"

                    label="Usuarios"
                />
                <StatCard
                    icon={<Send className="w-9 h-9 text-blue" />}
                    value={statistics?.totalAdoptionRequests ?? 0}
                    growthPercentage={statistics?.adoptionRequestsGrowthPercentage}
                    growthLabel="semana anterior"

                    label="Solicitudes de adopción"
                />
            </div>


            {statistics && (
                <>
                    <div className="flex justify-between items-center gap-4 mt-8 flex-wrap">
                        <div>


                        </div>
                        <div className="p-4 flex gap-4 bg-white rounded-lg shadow-md w-full max-w-md">
                            <DonutChartWithText
                                title="Mascotas por Categoría"
                                description="Distribución de tipos de mascota"
                                data={[
                                    { name: "Perros", value: statisticsContent?.petCountByAnimal.perro_count ?? 0, color: "#9747FF" },
                                    { name: "Gatos", value: statisticsContent?.petCountByAnimal.gato_count ?? 0, color: "#F2AA0F" },
                                    { name: "Aves", value: statisticsContent?.petCountByAnimal.ave_count ?? 0, color: "#4781FF" },]}
                                centerLabel="Mascotas"
                                colors={["#9747FF", "#F2AA0F", "#4781FF"]}
                            />
                            <PieChartWithLegend
                                title="Publicaciones por Tipo"
                                description="Distribución de publicaciones"
                                colors={["#9747FF", "#F2AA0F", "#4781FF"]}
                                data={[
                                    { name: "Publicaciones", value: statistics.totalProducts },
                                    { name: "Mascotas", value: statistics.totalPets },
                                    { name: "Productos", value: statistics.totalPosts },
                                ]}
                            />
                        </div>

                    </div>
                </>
            )}




        </div>
    );
}