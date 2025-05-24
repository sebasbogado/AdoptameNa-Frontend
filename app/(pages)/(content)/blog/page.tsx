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
import { useDebounce } from "@/hooks/use-debounce";
import SearchBar from "@/components/search-bar";
import { SkeletonCard } from "@/components/ui/skeleton-card";

export default function Page() {

    const [selectedAutor, setSelectedAutor] = useState<string | null>(null);
    const [authorOptions, setAuthorOptions] = useState<string[]>([]);
    const [allAuthorsMap, setAllAuthorsMap] = useState<Record<string, number>>({});

    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [tagOptions, setTagOptions] = useState<string[]>([]);
    const [allTagsMap, setAllTagsMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");

    useEffect(() => {
        if (Object.keys(allAuthorsMap).length > 0 || Object.keys(allTagsMap).length > 0) {
            const filters: Record<string, number|string> = {};

            if (selectedAutor && selectedAutor !== "Todos") {
                filters["userId"] = allAuthorsMap[selectedAutor];
            }

            if (selectedTag && selectedTag !== "Todos") {
                filters["tagId"] = allTagsMap[selectedTag];
            }
             if (searchQuery) {
                filters["search"] = searchQuery;
            }

            updateFilters(filters);
            handlePageChange(1);
        }
    }, [searchQuery, selectedAutor, selectedTag, allAuthorsMap, allTagsMap]);

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

   const debouncedSearch = useDebounce((value: string) => {
         if (value.length >= 3 || value === "") {
             setSearchQuery(value);
         }
     }, 500);
 
     const handleSearch = (query: string) => {
         setInputValue(query);
         debouncedSearch(query);
     };
 
     const handleClearSearch = () => {
         setInputValue("");
         setSearchQuery("");
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
                sort:"id,desc",
                postTypeId: POST_TYPEID.BLOG,
                userId: filters?.userId,
                tagIds: filters?.tagId,
                search: filters?.search, 

            });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    return (
        <div className="flex flex-col gap-4">
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    

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
                    <div className="ml-16 mb-4">
                    <div className="flex flex-col w-80 justify-center col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1">Buscar</label>
                        <SearchBar value={inputValue} onChange={handleSearch} onClear={handleClearSearch} />
                    </div>
                </div>
                </div>
            </div>


            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || "Error al cargar los blogs"}
                    </div>
                )}

                {loading ? (
                    <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 mt-2 p-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <div key={idx} className="relative flex flex-col md:flex-row bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden w-full h-96 sm:h-96 md:h-64 lg:h-64 xl:h-64">
                                <div className="w-full md:w-1/4 h-48 md:h-full flex-shrink-0">
                                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                                </div>
                                <div className="p-4 md:p-6 flex flex-col w-full flex-grow">
                                    <div className="flex flex-col gap-2 overflow-hidden max-h-[calc(100%-4rem)]">
                                        <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4" />
                                        <div className="flex flex-wrap gap-1">
                                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                                            <div className="h-6 bg-gray-200 rounded animate-pulse w-20" />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                                            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                                        </div>
                                    </div>
                                    <div className="mt-auto flex justify-between items-center">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-32" />
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    posts.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                            <p className="text-gray-600">No se encontraron blogs</p>
                        </div>
                    ) : (
                        <div className="w-full max-w-6xl mx-auto flex flex-col gap-16 mt-2 p-4">
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