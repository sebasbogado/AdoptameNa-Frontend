'use client'

import Banners from "@/components/banners";
import Pagination from "@/components/pagination";
import PetCard from "@/components/petCard/pet-card";
import { usePagination } from "@/hooks/use-pagination";
import { Post } from "@/types/post";
import { getPosts } from '@/utils/posts.http';
import { useEffect, useState } from "react";

export default function Page() {

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];
    const [postsMarket, setPostsMarket] = useState<Post[]>([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response: any = await getPosts();
            const marketDataFiltered = response.data.filter(
              (item: { postType: { name: string; }; }) => item.postType.name === "Marketplace"
            );
            setPostsMarket(marketDataFiltered);
          } catch (err: any) {
            console.log(err.message);
          } finally {
            setLoading(false);
          }
        };

        fetchData();
    }, []);

    const pageSize = 3;
        const {
            data: posts,
            loading,
            error,
            currentPage,
            totalPages,
            handlePageChange,
        } = usePagination<Post>({
            fetchFunction: async (page, size) => {
                        return await getPosts({ page, size });
                    },
                    initialPage: 1,
                    initialPageSize: pageSize
                });

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />
            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/**Aqui va a ir el filtro. */}
                </div>
            </div>

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    
                    {loading ? (
                        <p className="text-center col-span-full">Cargando datos...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-center col-span-full">No se han encontrado resultados</p>
                    ) : (
                        posts.map((item) => (
                            <PetCard key={item.id} post={item} />
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