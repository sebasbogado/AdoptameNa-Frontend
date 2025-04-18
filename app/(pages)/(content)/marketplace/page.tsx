'use client'

import Banners from "@/components/banners";
import LabeledSelect from "@/components/labeled-selected";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-Card/product-card";
import { usePagination } from "@/hooks/use-pagination";
import { Post } from "@/types/post";
import { Product } from "@/types/product";
import { ProductCategory } from "@/types/product-category";
import { getPosts } from '@/utils/posts.http';
import { getProductCategories } from "@/utils/product-category.http";
import { getProducts } from "@/utils/products.http";
import { useEffect, useState } from "react";

export default function Page() {

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | string | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [allPrices, setAllPrices] = useState<number[]>([]);

    const cleanFilters = (filters: Record<string, any>) => {
        return Object.fromEntries(
          Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined)
        );
      };

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await getProducts({}); 
                const prices = [...new Set(response.data.map(p => p.price))].sort((a, b) => a - b);
                setAllPrices(prices);
            } catch (error) {
                console.error("Error al obtener los precios:", error);
            }
        };
    
        fetchPrices();
    }, []);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== "Todos") {
            const found = categories.find(cat => cat.name === selectedCategory);
            setSelectedCategoryId(found ? found.id : null);
        } else {
            setSelectedCategoryId(null);
        }
    }, [selectedCategory, categories]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getProductCategories();
                setCategories(data.data);
            } catch (error) {
                console.error("Error al obtener categorías:", error);
            }
        };

        fetchCategories();
    }, []);

    const pageSize = 3;
    const {
        data: products,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters, // Usar para actualizar filtros
    } = usePagination<Product>({
        fetchFunction: (page, size, filters) =>
            getProducts({
                page: page,
                size: size,
                sort: "id,desc",
                categoryId: filters?.categoryId || undefined,
                condition: filters?.condition || undefined,
                price: filters?.price || undefined,
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const filteredData = {
            categoryId: selectedCategoryId,
            condition: selectedCondition === "Todos" ? null : selectedCondition,
            price: selectedPrice === "Todos" ? null : selectedPrice as number | null,
        };

        const cleanedFilters = cleanFilters(filteredData);

        updateFilters(cleanedFilters);

    }, [selectedCategoryId, selectedCondition, selectedPrice, updateFilters]);

    return (
        <div className="flex flex-col gap-5">
            <Banners images={bannerImages} />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <LabeledSelect
                        label="Categorias"
                        options={["Todos", ...categories.map((category) => category.name)]}
                        selected={selectedCategory}
                        setSelected={setSelectedCategory}
                    />

                    <LabeledSelect
                        label="Precio"
                        options={[
                            "Todos",
                            ...allPrices.map(price => price.toString())
                        ]}
                        selected={selectedPrice?.toString() ?? "Todos"}
                        setSelected={(value) => {
                            const parsed = value === "Todos" ? null : Number(value);
                            setSelectedPrice(parsed);
                        }}
                    />

                    <LabeledSelect
                        label="Condicion"
                        options={["Todos", "NUEVO", "USADO"]}
                        selected={selectedCondition}
                        setSelected={setSelectedCondition}
                    />
                </div>
            </div>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    {loading ? (
                        <p className="text-center col-span-full">Cargando datos...</p>
                    ) : products.length === 0 ? (
                        <p className="text-center col-span-full">No se han encontrado resultados</p>
                    ) : (
                        products.map((item) => <ProductCard key={item.id} product={item} />)
                    )}
                </div>
            </section>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
        </div>
    );
}
