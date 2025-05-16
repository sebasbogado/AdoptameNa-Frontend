'use client'

import Loading from "@/app/loading";
import LabeledSelect from "@/components/labeled-selected";
import Pagination from "@/components/pagination";
import ProductCard from "@/components/product-Card/product-card";
import { usePagination } from "@/hooks/use-pagination";
import { Product } from "@/types/product";
import { ProductCategory } from "@/types/product-category";
import { getProductCategories } from "@/utils/product-category.http";
import { getProducts } from "@/utils/product.http";
import { useCallback, useEffect, useState } from "react";
import { X } from 'lucide-react';
import { getAnimals } from "@/utils/animals.http";
import LabeledInput from "@/components/inputs/labeled-input";
import Link from "next/link";
import SearchBar from "@/components/search-bar";
import { useDebounce } from '@/hooks/use-debounce';
import { useAuth } from "@/contexts/auth-context";
import LocationFilter from "@/components/filters/location-filter";
import { LocationFilters, LocationFilterType } from "@/types/location-filter";

export default function Page() {
    const { user } = useAuth();

    const [pageSize, setPageSize] = useState<number>();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    const [allPrices, setAllPrices] = useState<number[]>([]);

    const [minPrice, setMinPrice] = useState<number | null>(null);
    const [maxPrice, setMaxPrice] = useState<number | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);

    const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
    const [availableAnimals, setAvailableAnimals] = useState<{ id: number; name: string }[]>([]);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [inputValue, setInputValue] = useState<string>("");
    const [locationType, setLocationType] = useState<LocationFilterType | null>(null);

    const [locationFilters, setLocationFilters] = useState<LocationFilters>({});
    const [filterChanged, setFilterChanged] = useState(false);

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

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await getProducts({});
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
        if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
            setPriceError("El precio mínimo no puede ser mayor que el precio máximo.");
        } else {
            setPriceError(null);
        }
    }, [minPrice, maxPrice]);

    const {
        data: products,
        loading,
        currentPage,
        totalPages,
        handlePageChange,
        updateFilters,
    } = usePagination<Product>({
        fetchFunction: (page, size, filters) =>
            getProducts({
                page: page,
                size: size,
                sort: "id,desc",
                ...filters,
            }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        if (priceError) return;
        let filters: any = {};

        if (selectedCategory && selectedCategory !== "Todos") {
            const selectedCategoryObj = categories.find(cat => cat.name.toLowerCase() === selectedCategory.toLocaleLowerCase());
            if (selectedCategoryObj) {
                filters.categoryId = selectedCategoryObj.id.toString();
            }
        }

        if (selectedAnimal && selectedAnimal !== "Todos") {
            const selectedAnimalObj = availableAnimals.find(animal => animal.name.toLowerCase() === selectedAnimal.toLocaleLowerCase());
            if (selectedAnimalObj) {
                filters.animalIds = selectedAnimalObj.id.toString();
            }
        }

        if (selectedCondition && selectedCondition !== "Todos") {
            filters.condition = selectedCondition.toString();
        }

        filters = {
            ...filters,
            search: searchQuery || undefined,
            minPrice,
            maxPrice,
            ...locationFilters
        };

        console.log("filters", filters);

        updateFilters(filters);
    }, [selectedCategory, selectedAnimal, selectedCondition, locationFilters, filterChanged, searchQuery, minPrice, maxPrice, priceError]);

    const handleLocationFilterChange = useCallback(
        (filters: Record<string, any>, type: LocationFilterType | null) => {
            setLocationFilters(filters);
            setLocationType(type);
            setFilterChanged(prev => !prev);
        },
        []
    );
    const resetFilters = () => {
        setSelectedCategory(null);
        setSelectedCondition(null);
        setSelectedAnimal(null);
        setMinPrice(null);
        setMaxPrice(null);
        setLocationType(null); // ← nuevo
        setLocationFilters({});
        updateFilters({});
        setInputValue("");
        setSearchQuery("");
        setFilterChanged(false);
    };


    if (!pageSize) return <Loading />;


    return (
        <div className="flex flex-col gap-5">
            <div className="w-full max-w-7xl mx-auto p-4">
                <div className="mx-80 mb-4">
                    <div className="flex flex-col col-span-1">
                        <label className="text-sm font-medium text-gray-700 mb-1">Buscar</label>
                        <SearchBar value={inputValue} onChange={handleSearch} onClear={handleClearSearch} />
                    </div>
                </div>

                <div
                    className={`
                        grid grid-cols-1 md:grid-cols-2
                        ${user?.location ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}
                        gap-x-6 gap-y-6
                        px-4 md:px-0
                    `}>
                    {user?.location ? (
                        <LocationFilter
                            user={user}
                            locationType={locationType}
                            setLocationType={setLocationType}
                            onFilterChange={handleLocationFilterChange}
                        />
                    ) : (
                        <div className="hidden lg:w-1/2 flex-shrink-0"></div>
                    )}

                    <LabeledSelect
                        label="Categorías"
                        options={["Todos", ...categories.map((category) => category.name)]}
                        selected={selectedCategory}
                        setSelected={setSelectedCategory}
                    />

                    <LabeledSelect
                        label="Condición"
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

                    <LabeledInput
                        label="Precio mínimo"
                        placeholder="0"
                        value={minPrice ?? null}
                        onChange={setMinPrice}
                    />

                    <LabeledInput
                        label="Precio máximo"
                        placeholder="0"
                        value={maxPrice ?? null}
                        onChange={setMaxPrice}
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

            <div className="w-full flex flex-col items-center justify-center mb-6">
                {loading ? (
                    <p className="text-center col-span-full">Cargando datos...</p>
                ) : products.length === 0 ? (
                    <p className="text-center col-span-full">No se han encontrado resultados</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-2 p-2">
                        {products.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                )}
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size="md"
            />
            <Link href="/add-product">
                <div className="fixed bottom-5 right-5 z-10">
                    <button className="group flex items-center gap-2 bg-[#FFAE34] text-white px-4 py-2 rounded-full shadow-lg hover:px-6 transition-all duration-500">
                        <span className="text-lg transition-all duration-500 group-hover:hidden">+</span>
                        <span className="hidden group-hover:inline transition-all duration-500">+ Crear publicación</span>
                    </button>
                </div>
            </Link>
        </div>
    );
}
