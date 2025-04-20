'use client'

import Loading from "@/app/loading";
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
import { useEffect, useMemo, useState } from "react";
import { X } from 'lucide-react';
import PriceRangeSlider from "@/components/price-range-slider/priceRangeSlider";
import { getAnimals } from "@/utils/animals.http";

export default function Page() {

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];

    const [pageSize, setPageSize] = useState<number>();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [allPrices, setAllPrices] = useState<number[]>([]);

    const [minVal, setMinVal] = useState<number | null>(null);
    const [maxVal, setMaxVal] = useState<number| null>(null);
    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);

    const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
    const [isPriceRangeInitialized, setIsPriceRangeInitialized] = useState(false);

    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [availableAnimals, setAvailableAnimals] = useState<{ id: number; name: string }[]>([]);

    const selectedAnimalId = useMemo(() => {
        const found = availableAnimals.find(a => a.name === selectedAnimal);
        return found ? found.id : null;
      }, [selectedAnimal, availableAnimals]);


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
                setPageSize(response.pagination.size)
            } catch (error) {
                console.error("Error al obtener los precios:", error);
            }
        };
    
        fetchPrices();
    }, []);


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

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const response = await getAnimals(); 
                setAvailableAnimals(response.data);
            } catch (error) {
                console.error("Error al obtener animales:", error);
            }
        };
    
        fetchAnimals();
    }, []);
    
    useEffect(() => {
        if (allPrices.length > 0 && priceRange[0] === 0 && priceRange[1] === 0) {
          const min = allPrices[0];
          const max = allPrices[allPrices.length - 1];
          setMinVal(min);
          setMaxVal(max);
          setPriceRange([min, max]);
          setIsPriceRangeInitialized(true);
        }
      }, [allPrices, priceRange]);

    useEffect(() => {
        if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
            setPriceError("El precio mínimo no puede ser mayor que el precio máximo.");
        } else {
            setPriceError(null);
        }
    }, [minPrice, maxPrice]);

    useEffect(() => {
        if (selectedCategory && selectedCategory !== "Todos") {
            const found = categories.find(cat => cat.name === selectedCategory);
            setSelectedCategoryId(found ? found.id : null);
        } else {
            setSelectedCategoryId(null);
        }
    }, [selectedCategory, categories]);

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
                minPrice: filters?.minPrice || undefined,
                maxPrice: filters?.maxPrice|| undefined,
                animalIds: selectedAnimalId ? selectedAnimalId : undefined,
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });


    const cleanedFilters = useMemo(() => {
        return cleanFilters({
          categoryId: selectedCategoryId,
          condition: selectedCondition === "Todos" ? null : selectedCondition,
          minPrice,
          maxPrice,
          animalIds: selectedAnimalId ? [selectedAnimalId] : null,
        });
      }, [selectedCategoryId, selectedCondition, minPrice, maxPrice, selectedAnimalId]);

    useEffect(() => {
        
        if (priceError) return;

        updateFilters(cleanedFilters);
    }, [cleanedFilters, updateFilters, priceError]);

    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedCondition(null);
        setMinPrice(null);
        setMaxPrice(null);
        setMinVal(allPrices[0]); 
        setMaxVal(allPrices[allPrices.length - 1]);
        updateFilters({}); // limpia los filtros aplicados
    };

    if (!pageSize) return <Loading />;

    return (
        <div className="flex flex-col gap-5">
            <Banners images={bannerImages} />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <LabeledSelect
                        label="Categorias"
                        options={["Todos", ...categories.map((category) => category.name)]}
                        selected={selectedCategory}
                        setSelected={setSelectedCategory}
                    />

                    <LabeledSelect
                        label="Condicion"
                        options={["Todos", "NUEVO", "USADO"]}
                        selected={selectedCondition}
                        setSelected={setSelectedCondition}
                    />

                    <LabeledSelect
                        label="Animales"
                        options={["Todos", ...availableAnimals.map((a) => a.name)]}
                        selected={selectedAnimal}
                        setSelected={setSelectedAnimal}
                    />

                    <PriceRangeSlider
                        min={allPrices[0] ?? 0}
                        max={allPrices[allPrices.length - 1]}
                        step={1000}
                        value={priceRange}
                        onChange={(range) => {
                            if (range[0] !== priceRange[0] || range[1] !== priceRange[1]) {
                                setPriceRange(range);  // Actualiza el rango
                                setMinVal(range[0]);   // Actualiza minVal
                                setMaxVal(range[1]);   // Actualiza maxVal
                                setMinPrice(range[0]); // Directamente actualiza minPrice
                                setMaxPrice(range[1]); // Directamente actualiza maxPrice
                            }
                        }}
                        renderValue={(value) => `₲${value.toLocaleString('es-PY')}`}
                    />

                    <div className="flex items-end justify-start">
                        <button
                            onClick={resetFilters}
                            title="Limpiar filtros"
                            className="p-1 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded flex items-center justify-center"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {priceError && (
                        <div className="col-span-full text-red-600 text-sm text-center">
                            {priceError}
                        </div>
                    )}
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
