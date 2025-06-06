'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import { Post } from "@/types/post";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import { getPosts } from "@/utils/posts.http";
import AllPostListPage from "@/components/administration/bans/posts-list-page";
import { ITEM_TYPE } from "@/types/constants";
import BackButton from "@/components/buttons/back-button";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedPostType, setSelectedPostType] = useState<string | null>(null);
    const [postTypeOptions, setPostTypeOptions] = useState<string[]>([]);
    const [allPostTypeMap, setAllPostTypeMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();
    const [postError, setPostError] = useState<string | null>(null);

    const [filters, setFilters] = useState<number | undefined>(undefined);

    const {
        data: posts,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Post>({
        fetchFunction: async (page, size, filters) => {
            if (!authToken) throw new Error("Authentication token is missing");
            return await getPosts({
                page,
                size,
                postTypeId: filters?.postTypeId ?? undefined,
                refresh: filters?.refresh ?? undefined
            });
        },
        initialPage: 1,
        initialPageSize: pageSize,
        scrollToTop: false
    });

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push("/auth/login");
        } else if (user && user.role !== "admin") {
            router.push("/dashboard");
        }

    }, [authToken, authLoading, router, user]);

    useEffect(() => {
        const fetchDeletedData = async () => {
            try {
                const [postsResponse] = await Promise.all([
                    getPosts(),
                ]);

                const postTypeMap: Record<string, number> = {};
                postsResponse.data.forEach(post => {
                    if (post.postType.name) {
                        postTypeMap[post.postType.name] = post.postType.id;
                    }
                });

                const uniquePostType = Object.keys(postTypeMap).sort();

                setPostTypeOptions(uniquePostType);
                setAllPostTypeMap(postTypeMap);
                setPageSize(postsResponse.pagination.size);
            } catch (err) {
                setPostError("Error al obtener las publicaciones")
            }
        };

        fetchDeletedData();
    }, []);

    const resetFilters = () => {
        setSelectedPostType(null);
        updateFilters({});
    };

    useEffect(() => {
        const postTypeId = selectedPostType && selectedPostType !== "Todos" ? allPostTypeMap[selectedPostType] : undefined;
        setFilters(postTypeId);
        updateFilters({ postTypeId });
        handlePageChange(1);
    }, [selectedPostType, updateFilters, handlePageChange, allPostTypeMap, setFilters]);

    return (
        <div className="p-6">
            <BackButton/>
            
            <div className="w-full max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Tipo de publicación"
                        options={["Todos", ...postTypeOptions]}
                        selected={selectedPostType}
                        setSelected={setSelectedPostType}
                    />

                    <ResetFiltersButton onClick={resetFilters} />
                </div>
            </div>
            <AllPostListPage
                items={posts}
                itemType={ITEM_TYPE.POST}
                loading={loading}
                error={postError}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                updateFilters={updateFilters}
                filters={filters}
                disabled={true}
            />
        </div>
    )
}