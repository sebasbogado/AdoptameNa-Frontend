"use client";

import { useEffect, useState } from "react";
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";
import { POST_TYPEID } from "@/types/constants";
import LabeledSelect from "@/components/labeled-selected";
import { getAnimals } from "@/utils/animals.http";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "@/components/pagination";
import { Loader2 } from "lucide-react";

export default function Page() {

    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedHelpType, setSelectedHelpType] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState("");
    const [animalTypes, setAnimalTypes] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const pageSize = 5;
    const sort = "id,desc";
    const {
        data: posts,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination<Post>({
        fetchFunction: async (page, size) => {
            return await getPosts({ page, size, sort, postTypeId: POST_TYPEID.VOLUNTEERING });
        },
        initialPage: 1,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const animals = await getAnimals();
                setAnimalTypes(["Todos", ...animals.data.map((animal: { name: string }) => animal.name)]);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // const filteredData = posts.filter((item) => {
    //     // Filtrar por ubicación
    //     if (selectedLocation && selectedLocation !== "Todos") {
    //         if (item.location !== selectedLocation) return false;
    //     }

    //     // Filtrar por tipo de ayuda
    //     if (selectedHelpType && selectedHelpType !== "Todos") {
    //         if (item.type !== selectedHelpType) return false;
    //     }

    //     // Filtrar por tipo de mascota
    //     if (selectedAnimal && selectedAnimal !== "Todos") {
    //         const selectedAnimalObj = animals.find((animal) => animal.name.toLowerCase() === selectedAnimal.toLowerCase());
    //         if (!selectedAnimalObj || item.animalId !== selectedAnimalObj.id) return false;
    //     }

    //     return true;

    // });

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Distancia"
                        options={["Todos", "Cercano", "Lejano"]}
                        selected={selectedLocation}
                        setSelected={setSelectedLocation}
                    />
                    <LabeledSelect
                        label="Tipo de ayuda"
                        options={["Todos", "Dinero", "Medicamentos", "Alimentos"]}
                        selected={selectedHelpType}
                        setSelected={setSelectedHelpType}
                    />
                    <LabeledSelect
                        label="Tipo de mascota"
                        options={animalTypes}
                        selected={selectedAnimal}
                        setSelected={setSelectedAnimal}
                    />
                </div>
            </div>

            <section>
            <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || 'Error al cargar los posts'}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : (
                    posts.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                            <p className="text-gray-600">No se encontraron posts</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                            {posts.map((post) => (
                                <PetCard
                                    key={post.id}
                                    post={post}
                                    isPost={true}
                                    className="w-full max-w-md"
                                />
                            ))}
                        </div>
                    )
                )}
            </div>
            </section>

            {/* Controles de paginación */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
        </div>
    );
}