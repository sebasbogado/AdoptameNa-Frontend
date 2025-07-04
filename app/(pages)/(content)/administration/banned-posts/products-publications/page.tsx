'use client'
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DeletedListPage from "@/components/administration/banned/banned-list-page";
import { usePagination } from "@/hooks/use-pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import { Product } from "@/types/product";
import { getBannedProducts } from "@/utils/product.http";
import { ITEM_TYPE } from "@/types/constants";
import BackButton from "@/components/buttons/back-button";

export default function Page() {
    const { authToken, user, loading: authLoading } = useAuth();
    const router = useRouter();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
    const [allCategoryMap, setAllCategoryMap] = useState<Record<string, number>>({});

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
            return await getBannedProducts(authToken, {
                page,
                size,
                userId: filters?.userId ?? undefined,
                categoryId: filters?.categoryId ?? undefined,
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
                const [productsResponse] = await Promise.all([
                    authToken ? getBannedProducts(authToken) : Promise.reject(new Error("Authentication token is missing"))
                ]);

                const categoryMap: Record<string, number> = {};
                productsResponse.data.forEach(product => {
                    if (product.category.name) {
                        categoryMap[product.category.name] = product.category.id;
                    }
                });

                const uniqueCategory = Object.keys(categoryMap).sort();

                setCategoryOptions(uniqueCategory);
                setAllCategoryMap(categoryMap);
                setPageSize(productsResponse.pagination.size);
            } catch (err) {
                setPostError("Error al obtener las publicaciones")
            }
        };

        fetchDeletedData();
    }, []);

    const resetFilters = () => {
        setSelectedCategory(null);
        updateFilters({});
    };

    useEffect(() => {
        const categoryId = selectedCategory && selectedCategory !== "Todos" ? allCategoryMap[selectedCategory] : undefined;

        updateFilters({ categoryId });
        handlePageChange(1);
    }, [selectedCategory]);

    return (
        <div className="p-6">
                            <BackButton path="/administration/posts"></BackButton>
    
            <div className="w-full max-w-6xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <LabeledSelect
                        label="Categoria    "
                        options={["Todos", ...categoryOptions]}
                        selected={selectedCategory}
                        setSelected={setSelectedCategory}
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
                disabled={true}
                updateFilters={updateFilters}
            />
        </div>
    )
}