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
    const [ selectedCategory, setSelectedCategory ] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
    const [selectedCondition, setSelectedCondition] = useState<string | null>(null);

    const [categories, setCategories] = useState<ProductCategory[]>([]);
    

    useEffect(() => {
        if (selectedCategory) {
          const found = categories.find(cat => cat.name === selectedCategory);
          setSelectedCategoryId(found ? found.id : null);
        } else {
          setSelectedCategoryId(null);
        }
      }, [selectedCategory, categories]);
      
      useEffect(() => {
        const found = categories.find(cat => cat.name === selectedCategory);
        setSelectedCategoryId(found ? found.id : null);
    }, [selectedCategory, categories]);

    const pageSize = 3;
        const {
            data: products,
            loading,
            error,
            currentPage,
            totalPages,
            handlePageChange,
        } = usePagination<Product>({
            fetchFunction: (page, size) => getProducts( selectedCategoryId || undefined, selectedCondition || undefined, selectedPrice || undefined, page, size),
                    initialPage: 1,
                    initialPageSize: pageSize
                });

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

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <LabeledSelect
                        label="Categorias"
                        options={categories.map((category) => category.name)}
                        selected={selectedCategory}
                        setSelected={setSelectedCategory}                    
                    />

                    <LabeledSelect
                        label="Precio"
                        options={
                            products.length === 0 
                                ? ["No hay precios disponibles"] 
                                : [...new Set(products.map(p => p.price))].sort((a, b) => a - b)
                        }
                        selected={selectedPrice}
                        setSelected={setSelectedPrice}                    
                    />

                    <LabeledSelect
                        label="Condicion"
                        options={["NUEVO", "USADO"]}
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
                        products.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))
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
    )
}