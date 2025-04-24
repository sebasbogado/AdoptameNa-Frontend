"use client";

import { useEffect, useState } from "react";
import PetCard from '@/components/petCard/pet-card';
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";
import { POST_TYPEID } from "@/types/constants";
import LabeledSelect from "@/components/labeled-selected";
import { usePagination } from "@/hooks/use-pagination";
import Pagination from "@/components/pagination";
import { Loader2 } from "lucide-react";
import { getTags } from "@/utils/tags";
import { Tags } from "@/types/tags";
import { getAnimals } from "@/utils/animals.http";
import { Animal } from "@/types/animal";

export default function Page() {

    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedHelpType, setSelectedHelpType] = useState("");
    const [selectedAnimal, setSelectedAnimal] = useState("");
    const [tags, setTags] = useState<Tags[]>([]);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [selectedTagsId, setSelectedTagsId] = useState<number[]>([]);
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
        updateFilters,
    } = usePagination<Post>({
        fetchFunction: async (page, size, filters) =>
            getPosts({
                page,
                size,
                sort,
                postTypeId: POST_TYPEID.VOLUNTEERING,
                tagIds: filters?.tagIds || undefined,
            }),
        initialPage: 1,
        scrollToTop: false,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const tagsData = await getTags({ postTypeIds: [POST_TYPEID.ALL, POST_TYPEID.VOLUNTEERING] });
                const animalsData = await getAnimals();

                setTags(tagsData.data);
                setAnimals(animalsData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (selectedHelpType && !selectedHelpType.includes("Todos")) {
            const found = tags.find(a => a.name === selectedHelpType);
            setSelectedTagsId(found ? [found.id] : []);
        } else {
            setSelectedTagsId([]);
        }
    }, [selectedHelpType, tags]);

    useEffect(() => {
        const filteredData = {
            tagIds: selectedTagsId.length > 0 ? selectedTagsId.join(',') : undefined,
        };

        const cleanedFilters = cleanFilters(filteredData);
        updateFilters(cleanedFilters);
    }, [selectedTagsId, updateFilters]);


    const cleanFilters = (filters: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined)
        );
    };

    return (
        <div className='flex flex-col gap-5'>
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Distancia"
                        options={["Todos", "Cercano", "Lejano"]}
                        selected={selectedLocation}
                        setSelected={setSelectedLocation}
                    />
                    <LabeledSelect
                        label="Etiquetas"
                        options={["Todos", ...tags.map((tag) => tag.name)]}
                        selected={selectedHelpType}
                        setSelected={setSelectedHelpType}
                    />
                    <LabeledSelect
                        label="Tipo de mascota"
                        options={["Todos", ...animals.map((animal) => animal.name)]}
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