"use client";

import Banners from "@/components/banners";
import LabeledSelect from "@/components/labeled-selected";
import Pagination from "@/components/pagination";
import PetCard from "@/components/petCard/pet-card";
import ResetFiltersButton from "@/components/reset-filters-button";
import { usePagination } from "@/hooks/use-pagination";
import { POST_TYPEID } from "@/types/constants";
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";
import { getTags } from "@/utils/tags";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Page() {

    const [selectedAutor, setSelectedAutor] = useState<string | null>(null);
    const [authorOptions, setAuthorOptions] = useState<string[]>([]);
    const [allAuthorsMap, setAllAuthorsMap] = useState<Record<string, number>>({});

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [allTagsMap, setAllTagsMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();


    useEffect(() => {
        const userId = selectedAutor && selectedAutor !== "Todos" ? allAuthorsMap[selectedAutor] : undefined;
        const tagId = selectedTag && selectedTag !== "Todos" ? allTagsMap[selectedTag] : undefined;

        updateFilters({ userId, tagId });
        handlePageChange(1);
    }, [selectedAutor, selectedTag]);

    useEffect(() => {
        const fetchAuthorsAndTags = async () => {
            try {
                const [postsResponse, tagsResponse] = await Promise.all([
                    getPosts({ postTypeId: POST_TYPEID.BLOG }),
                    getTags({ postTypeIds: [POST_TYPEID.BLOG] })
                ]);

                const authorMap: Record<string, number> = {};
                postsResponse.data.forEach(p => {
                    if (p.userFullName) {
                        authorMap[p.userFullName] = p.userId;
                    }
                });

                const tagMap: Record<string, number> = {};
                tagsResponse.data.forEach(tag => {
                    if (tag.name) {
                        tagMap[tag.name] = tag.id;
                    }
                });

                const uniqueAuthors = Object.keys(authorMap).sort();
                const uniqueTags = Object.keys(tagMap).sort();

                setAuthorOptions(uniqueAuthors);
                setTagOptions(uniqueTags);
                setAllAuthorsMap(authorMap);
                setAllTagsMap(tagMap);
                setPageSize(postsResponse.pagination.size);
            } catch (err) {
                console.error("Error al obtener autores o tags:", err);
            }
        };

        fetchAuthorsAndTags();
    }, []);

    const resetFilters = () => {
        setSelectedAutor(null);
        setSelectedTag(null);
        updateFilters({});
    };

    const {
        data: posts,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Post>({
        fetchFunction: async (page, size, filters) => {
            return await getPosts({
                page,
                size,
                postTypeId: POST_TYPEID.BLOG,
                userId: filters?.userId ?? undefined,
                tagIds: filters?.tagId ?? undefined
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    return (
        <div className="flex flex-col gap-5">

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <LabeledSelect
                        label="Autor"
                        options={["Todos", ...authorOptions]}
                        selected={selectedAutor}
                        setSelected={setSelectedAutor}
                    />

                    <LabeledSelect
                        label="Tags"
                        options={["Todos", ...tagOptions]}
                        selected={selectedTag}
                        setSelected={setSelectedTag}
                    />

                    <ResetFiltersButton onClick={resetFilters} />
                </div>
            </div>


            <section>
                <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                            {error.message || 'Error al cargar los blogs'}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                        </div>
                    ) : (
                        posts.length === 0 ? (
                            <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                                <p className="text-gray-600">No se encontraron blogs</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                                {posts.map((p) => (
                                    <PetCard
                                        key={p.id}
                                        post={p}
                                        isPost={true}
                                        className=""
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size='md'
            />
        </div>
    )
}