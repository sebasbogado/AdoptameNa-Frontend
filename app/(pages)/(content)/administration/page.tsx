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
import { getStatisticsActivity, getStatisticsContent, getStatisticsOverview } from "@/utils/statistics";
import { StatisticsContent, StatisticsOverview, StatisticsActivity } from "@/types/statistics";
import PieC from "@/components/administration/estatistics/graph/pie";
import PieChartWithLegend from "@/components/administration/estatistics/graph/pie";
import DonutChartWithText from "@/components/administration/estatistics/graph/donut";
import BarChartWithLegend from "@/components/administration/estatistics/graph/bar";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [statistics, setStatistics] = useState<StatisticsOverview>();
    const [statisticsContent, setStatisticsContent] = useState<StatisticsContent>();
    const [statisticsActivity, setStatisticsActivity] = useState<StatisticsActivity>(); 

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
                 const responseActivity = await getStatisticsActivity(authToken || "");
                console.log("Estadísticas de responseActivity obtenidas:", responseActivity);
                setStatisticsActivity(responseActivity);
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
                    path="/administration/users"
                    label="Usuarios"
                />

                <StatCard
                    icon={<Newspaper className="w-9 h-9 text-white" />}
                    value={statistics?.postsCreatedThisWeek ?? 0}
                    growthPercentage={statistics?.postsGrowthPercentage}
                    bg="bg-btn-action"
                    growthLabel="semana anterior"
                    path="/administration/posts"

                    label="Publicaciones"
                />

                <StatCard
                    icon={<Dog className="w-9 h-9 text-red-300" />}
                    value={statistics?.petsCreatedThisWeek ?? 0}
                    growthPercentage={statisticsContent?.petsGrowthPercentage}
                    growthLabel="semana anterior"
                    path="/administration/posts"

                    label="Mascotas"
                />
                <StatCard
                    icon={<DollarSign className="w-9 h-9 text-orange-300" />}
                    value={statistics?.crowdFoundingsCreatedThisWeek ?? 0}
                    growthPercentage={statistics?.crowdfundingGrowthPercentage}
                    growthLabel="semana anterior"
                    path="/administration/crowfunding"

                    label="Colectas"
                />
                <StatCard
                    icon={<Send className="w-9 h-9 text-blue" />}
                    value={statistics?.adoptionRequestsThisWeek ?? 0}
                    growthPercentage={statistics?.adoptionRequestsGrowthPercentage}
                    growthLabel="semana anterior"

                    label="Solicitudes de adopción"
                />
            </div>


            {statistics && (
                <>
                    <div className="flex justify-evenly items-center  mt-8 flex-wrap">
                        <div className=" mt-12 p-4 bg-white rounded-lg shadow-md w-auto flex  ">
                            <BarChartWithLegend
                                title="Total de contenido"
                                description="Distribución de cantidad total de contenido creado"
                                data={[
                                    { name: "Animales", value: statistics.totalPets ?? 0 },
                                    { name: "Publicaciones", value: statistics.totalPosts ?? 0 },
                                    { name: "Productos", value: statistics.totalProducts ?? 0 },
                                    { name: "Colectas", value: statistics.totalCrowdfunding ?? 0 },
                                ]}
                                colors={["#9747FF", "#F2AA0F", "#4781FF"]}
                            />

                        </div>
                        <div className=" mt-12 p-4 bg-white rounded-lg shadow-md w-auto flex  ">
                            <DonutChartWithText
                                title="Mascotas por tipo de animal"
                                description="Distribución de tipos de mascota"
                                data={[
                                    { name: "Perros", value: statisticsContent?.petCountByAnimal.perro_count ?? 0, color: "#9747FF" },
                                    { name: "Gatos", value: statisticsContent?.petCountByAnimal.gato_count ?? 0, color: "#F2AA0F" },
                                    { name: "Aves", value: statisticsContent?.petCountByAnimal.ave_count ?? 0, color: "#4781FF" },]}
                                centerLabel="Mascotas"
                                colors={["#9747FF", "#F2AA0F", "#4781FF"]}
                            />
                            <PieChartWithLegend
                                title="Solicitudes de adopción"
                                description="Distribución de estados solicitudes de adopción"
                                colors={["#9747FF", "#F2AA0F", "#FF5050"]}
                                data={[
                                    { name: "Aceptados", value: statisticsActivity?.adoptionRequestCountByStatus?.ACCEPTED_count ?? 0},
                                    { name: "Pendientes", value: statisticsActivity?.adoptionRequestCountByStatus?.PENDING_count ?? 0 },
                                    { name: "Rechazados", value: statisticsActivity?.adoptionRequestCountByStatus?.REJECTED_count ?? 0 },
                             
                                ]}
                            />
                        </div>

                    </div>
                </>
            )}




        </div>
    );
}