'use client';

import { useParams } from 'next/navigation';
import { Home, Loader2 } from 'lucide-react';
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import Pagination from '@/components/pagination';
import { usePagination } from '@/hooks/use-pagination';
import { getPosts } from '@/utils/posts.http';
import { Post } from '@/types/post';
import Link from 'next/link';


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
            getPosts({ page, size, userId: id ?? '' }),
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
                    {error ? (
                        <div className="bg-red-100 text-red-700 p-4 rounded-md w-full max-w-md justify-center">
                            {'Error al cargar los posts'}
                        </div>
                    ) : loading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-gray-600">Aún no tenés posts creados</p>

                            <Link
                                href="/"
                                className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium shadow-lg hover:bg-primary/90 transition-colors"
                            >
                                <Home size={18} />
                                <span>Volver al inicio</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
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

            {/* 2. Renderizar paginación */}
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
