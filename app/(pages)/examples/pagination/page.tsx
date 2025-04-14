'use client';

import Pagination from '@/components/pagination';
import { Post } from '@/types/post';
import { getPosts } from '@/utils/posts.http';
import { Loader2 } from 'lucide-react';
import PetCard from '@/components/petCard/pet-card';
import { usePagination } from '@/hooks/use-pagination';

export default function PaginationExample() {
    const pageSize = 1;

    const {
        data: posts,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange
    } = usePagination<Post>({
        fetchFunction: async (page, size) => {
            return await getPosts({ page, size });
        },
        initialPage: 1,
        initialPageSize: pageSize
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Ejemplo de Paginación de Posts
            </h1>

            <div className="min-h-[400px] w-full flex flex-col items-center justify-center mb-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md">
                        {error.message || 'Error al cargar los posts'}
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                    </div>
                ) : (
                    posts.length === 0 ? (
                        <div className="text-center p-10 bg-gray-50 rounded-lg w-full max-w-md">
                            <p className="text-gray-600">No se encontraron posts</p>
                        </div>
                    ) : (
                        <div className="flex justify-center w-full">
                            {posts.map((post) => (
                                <PetCard
                                    key={post.id}
                                    post={post}
                                    isPost={true}
                                    className="w-full max-w-md"
                                />
                            ))}
                        </div>
                    )
                )}
            </div>

            <Pagination
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                size='md'
            />
        </div>
    );
}