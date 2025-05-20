"use client";

import LabeledSelect from "@/components/labeled-selected";
import Pagination from "@/components/pagination";
import { usePagination } from "@/hooks/use-pagination";
import { POST_TYPEID } from "@/types/constants";
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";
import { getTags } from "@/utils/tags";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import BlogCard from "@/components/blog/blog-card";
import FloatingActionButton from "@/components/buttons/create-publication-buttons";
export default function Page() {

    const [selectedAutor, setSelectedAutor] = useState<string | null>(null);
    const [authorOptions, setAuthorOptions] = useState<string[]>([]);
    const [allAuthorsMap, setAllAuthorsMap] = useState<Record<string, number>>({});

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [allTagsMap, setAllTagsMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();

    useEffect(() => {
        if (Object.keys(allAuthorsMap).length > 0 || Object.keys(allTagsMap).length > 0) {
            const filters: Record<string, number> = {};

            if (selectedAutor && selectedAutor !== "Todos") {
                filters["userId"] = allAuthorsMap[selectedAutor];
            }

            if (selectedTag && selectedTag !== "Todos") {
                filters["tagId"] = allTagsMap[selectedTag];
            }

            updateFilters(filters);
            handlePageChange(1);
        }
    }, [selectedAutor, selectedTag, allAuthorsMap, allTagsMap]);

    useEffect(() => {
        const fetchAuthorsAndTags = async () => {
            try {
                const [postsResponse, tagsResponse] = await Promise.all([
                    getPosts({ postTypeId: POST_TYPEID.BLOG }),
                    getTags({ postTypeIds: [POST_TYPEID.BLOG, POST_TYPEID.ALL] })
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
                userId: filters?.userId,
                tagIds: filters?.tagId
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    return (
        <div className="flex flex-col gap-5">
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                </div>
            </div>


            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || "Error al cargar los blogs"}
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
                        <div className="w-full max-w-6xl mx-auto flex flex-col gap-6 mt-2 p-4">
                        {posts.map((p) => (
                            <BlogCard key={p.id} post={p} />
                        ))}
                        </div>

                    )
                )}
            </div>

            <FloatingActionButton />

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