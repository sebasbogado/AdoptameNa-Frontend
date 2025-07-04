'use client'

import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePagination } from "@/hooks/use-pagination";
import LabeledSelect from "@/components/labeled-selected";
import ResetFiltersButton from "@/components/reset-filters-button";
import { Product } from "@/types/product";
import { getProducts } from "@/utils/product.http";
import AllPostListPage from "@/components/administration/bans/posts-list-page";
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

    const [filters, setFilters] = useState<number | undefined>(undefined);

    const {
        data: products,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters
    } = usePagination<Product>({
        fetchFunction: async (page, size, filters) => {
            return await getProducts({
                page,
                size,
                categoryId: filters?.categoryId,
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
                    getProducts(),
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
        setFilters(categoryId);
        updateFilters({ categoryId });
        handlePageChange(1);
    }, [selectedCategory, updateFilters, handlePageChange, allCategoryMap, setFilters]);

    return (
        <div className="p-6">
            <BackButton/>
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
            <AllPostListPage
                items={products}
                itemType={ITEM_TYPE.PRODUCT}
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