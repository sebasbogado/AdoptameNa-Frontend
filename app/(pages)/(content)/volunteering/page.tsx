"use client";

import { useEffect, useState, useCallback } from "react";
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
import LocationFilter from "@/components/filters/location-filter";
import { useAuth } from "@/contexts/auth-context";
import { LocationFilters } from "@/types/location-filter";

export default function Page() {
    const { user } = useAuth();
    const pageSize = 10;
    const sort = "id,desc";
    const [tags, setTags] = useState<Tags[]>([]);
    const [tagsList, setTagsList] = useState<string[]>([]);
    const [selectedTag, setSelectedTag] = useState("");
    const [locationFilters, setLocationFilters] = useState<LocationFilters>({});
    const [filterChanged, setFilterChanged] = useState(false);

    const {
        data: posts,
        loading,
        error,
        currentPage,
        totalPages,
        updateFilters,
        handlePageChange
    } = usePagination<Post>({
        fetchFunction: async (page, size, filters) => {
            return getPosts({
                page,
                size,
                sort,
                postTypeId: POST_TYPEID.VOLUNTEERING,
                ...filters
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    const fetchData = async () => {
        try {

            const tagsData = await getTags({ postTypeIds: [POST_TYPEID.ALL, POST_TYPEID.VOLUNTEERING] });
            setTags(tagsData.data);
            setTagsList(["Todos", ...tagsData.data.map((tag: Tags) => tag.name)]);
        } catch (err: any) {
            console.error('Error fetching data:', err.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const handleLocationFilterChange = useCallback((filters: Record<string, any>) => {
        setLocationFilters(filters);
        setFilterChanged(prev => !prev);
    }, []);

    useEffect(() => {
        let filters: any = {};

        
        if (selectedTag && selectedTag !== "Todos") {
            const selectedTagObj = tags.find(
                (tag) => tag.name.toLowerCase() === selectedTag.toLowerCase()
            );
            if (selectedTagObj) {
                filters.tagIds = selectedTagObj.id.toString();
            }
        }
        
        filters = {
            ...filters,
            ...locationFilters
        };

        updateFilters(filters);
    }, [ selectedTag, locationFilters, filterChanged]);

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full max-w-7xl mx-auto p-4">
                <div className="flex flex-wrap lg:flex-nowrap justify-center gap-2 lg:gap-3">
                    {user?.location ? (
                        <div className="w-full md:w-64 lg:w-1/2 flex-shrink-0">
                            <LocationFilter 
                                user={user} 
                                onFilterChange={handleLocationFilterChange} 
                            />
                        </div>
                    ) : (
                        <div className="hidden lg:block lg:w-1/2 flex-shrink-0"></div>
                    )}
                    <div className="w-full md:w-64 lg:w-1/2 flex-shrink-0">
                        <LabeledSelect
                            label="Etiquetas"
                            options={tagsList}
                            selected={selectedTag}
                            setSelected={setSelectedTag}
                        />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || 'Error al cargar los posts'}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : posts.length === 0 ? (
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
                            />
                        ))}
                    </div>
                )}
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
        </div>
    );
}
