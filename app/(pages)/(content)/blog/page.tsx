"use client";

import Banners from "@/components/banners";
import Pagination from "@/components/pagination";
import PetCard from "@/components/petCard/pet-card";
import { usePagination } from "@/hooks/use-pagination";
import { POST_TYPEID } from "@/types/constants";
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";
import { Loader2 } from "lucide-react";

export default function Page() {

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];

    const pageSize = 10;
    const sort = "id,desc";

    const {
            data: posts,
            loading,
            error,
            currentPage,
            totalPages,
            handlePageChange
        } = usePagination<Post>({
            fetchFunction: async (page, size) => {
                return await getPosts({ page, size, sort, postTypeId: POST_TYPEID.BLOG});
            },
            initialPage: 1,
            initialPageSize: pageSize
        });
    
    return (
        <div className="flex flex-col gap-5">
            <Banners images={bannerImages} />

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/** Aqui van a ir los filtros. */}
                </div>
            </div>
            
            
            <section>
                <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
                    {error && (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                            {error.message || 'Error al cargar los blogs'}
                        </div>
                    )}

                    {loading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                        </div>
                    ) : (
                        posts.length === 0 ? (
                            <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                                <p className="text-gray-600">No se encontraron blogs</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-8 mt-2 p-2">
                                {posts.map((p) => (
                                    <PetCard
                                        key={p.id}
                                        post={p}
                                        isPost={true}
                                        className=""
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Pagination */}
            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size='md'
            />
        </div>
    )
}