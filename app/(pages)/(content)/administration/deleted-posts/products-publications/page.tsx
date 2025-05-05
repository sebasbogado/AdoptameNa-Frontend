'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeletedListPage from "@/components/administration/deleted/deleted-list-page";
import { usePagination } from "@/hooks/use-pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import { Product } from "@/types/product";
import { getDeletedProducts } from "@/utils/product.http";
import { ITEM_TYPE } from "@/types/constants";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
    const [authorOptions, setAuthorOptions] = useState<string[]>([]);
    const [allAuthorMap, setAllAuthorMap] = useState<Record<string, number>>({});

    const [pageSize, setPageSize] = useState<number>();
    const [postError, setPostError] = useState<string | null>(null);

    const {
        data: products,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Product>({
        fetchFunction: async (page, size, filters) => {
            if (!authToken) throw new Error("Authentication token is missing");
            return await getDeletedProducts(authToken, {
                page,
                size,
                userId: filters?.userId ?? undefined,
            });
        },
        initialPage: 1,
        initialPageSize: pageSize
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
                const [productsResponse] = await Promise.all([
                    authToken ? getDeletedProducts(authToken) : Promise.reject(new Error("Authentication token is missing"))
                ]);

                const authorMap: Record<string, number> = {};
                productsResponse.data.forEach(product => {
                    if (product.userFullName) {
                        authorMap[product.userFullName] = product.id;
                    }
                });

                const uniqueAuthor = Object.keys(authorMap).sort();

                setAuthorOptions(uniqueAuthor);
                setAllAuthorMap(authorMap);
                setPageSize(productsResponse.pagination.size);
            } catch (err) {
                setPostError("Error al obtener las publicaciones")
            }
        };

        fetchDeletedData();
    }, []);

    const resetFilters = () => {
        setSelectedAuthor(null);
        updateFilters({});
    };

    useEffect(() => {
        const authorId = selectedAuthor && selectedAuthor !== "Todos" ? allAuthorMap[selectedAuthor] : undefined;

        updateFilters({ authorId });
        handlePageChange(1);
    }, [selectedAuthor]);

    return (
        <div className="p-6">
            <div className="w-full max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Autor"
                        options={["Todos", ...authorOptions]}
                        selected={selectedAuthor}
                        setSelected={setSelectedAuthor}
                    />

                    <ResetFiltersButton onClick={resetFilters} />
                </div>
            </div>
            <DeletedListPage
                items={products}
                itemType={ITEM_TYPE.PRODUCT}
                loading={loading}
                error={postError}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </div>
    )
}