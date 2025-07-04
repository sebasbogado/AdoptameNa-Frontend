'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeletedListPage from "@/components/administration/banned/banned-list-page";
import { getBannedPosts } from "@/utils/posts.http";
import { usePagination } from "@/hooks/use-pagination";
import { Post } from "@/types/post";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
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
            return await getBannedPosts(authToken, {
                page,
                size,
                userId: filters?.userId ?? undefined,
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

    }, [authToken, authLoading, router]);

    useEffect(() => {
        const fetchDeletedData = async () => {
            try {
                const [postsResponse] = await Promise.all([
                    authToken ? getBannedPosts(authToken) : Promise.reject(new Error("Authentication token is missing"))
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

        updateFilters({ postTypeId });
        handlePageChange(1);
    }, [selectedPostType]);

    return (
        <div className="p-6">
                                    <BackButton path="/administration/posts"></BackButton>
            
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
            <DeletedListPage
                items={posts}
                itemType={ITEM_TYPE.POST}
                loading={loading}
                error={postError}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                disabled={true}
                updateFilters={updateFilters}
            />
        </div>
    )
}