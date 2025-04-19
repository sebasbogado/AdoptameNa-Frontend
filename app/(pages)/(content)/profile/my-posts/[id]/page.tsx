'use client';

import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import Pagination from '@/components/pagination';

import { usePagination } from '@/hooks/use-pagination';
import { getPosts } from '@/utils/posts.http';
import { Post } from '@/types/post';

export default function MyPostsPage() {
    const { id } = useParams(); 
    const pageSize = 10;


    const {
        data: posts,
        loading,
        error,
        currentPage,
        totalPages,
        handlePageChange,
    } = usePagination<Post>({
        fetchFunction: (page, size) =>
            getPosts({ page, size, user: id ?? '' }),
        initialPage: 1,
        initialPageSize: pageSize,
    });

    const bannerImages = [
        '/banner1.png',
        '/banner2.png',
        '/banner3.png',
        '/banner4.png',
    ];

    return (
        <div className="flex flex-col gap-5">
            <Banners images={bannerImages} />

            <section>
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
                    ) : posts.length === 0 ? (
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
                    )}
                </div>
            </section>

            <div className="flex justify-center my-6">
                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    size="md"
                />
            </div>
        </div>
    );
}
