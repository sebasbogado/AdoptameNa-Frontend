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
import { useAuth } from '@/contexts/auth-context';
import LabeledSelect from '@/components/labeled-selected';
import { PostType } from '@/types/post-type';
import { useEffect, useState } from 'react';
import { getPostsType } from '@/utils/post-type.http';

export default function MyPostsPage() {
    const { id: profileId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [postTypes, setPostTypes] = useState<PostType[]>([]);
    const [selectedPostType, setSelectedPostType] = useState<string | null>(null);
    const [selectedPostTypeId, setSelectedPostTypeId] = useState<number | null>(null);
    const myUserId = user?.id;
    const isVisitor = profileId !== myUserId;
    const pageSize = 10;

    const {
        data: posts,
        loading: postsLoading,
        error,
        currentPage,
        totalPages,
        updateFilters,
        handlePageChange,
    } = usePagination<Post>({
        fetchFunction: (page, size, filters) =>
            getPosts({
                page,
                size,
                userId: Number(profileId),
                postTypeId: filters?.postTypeId || undefined,
            }),
        initialPage: 1,
        scrollToTop: false,
        initialPageSize: pageSize,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const postTypesData = await getPostsType();
                setPostTypes(postTypesData.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const cleanFilters = (filters: Record<string, any>) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, v]) => v !== null && v !== undefined)
        );
    };

    useEffect(() => {
        if (selectedPostType && !selectedPostType.includes("Todos")) {
            const found = postTypes.find(a => a.name === selectedPostType);
            setSelectedPostTypeId(found ? found.id : null);
        } else {
            setSelectedPostTypeId(null);
        }
    }, [selectedPostType, postTypes]);

    useEffect(() => {
        const filteredData = {
            postTypeId: selectedPostTypeId,
        };

        const cleanedFilters = cleanFilters(filteredData);
        updateFilters(cleanedFilters);
    }, [selectedPostTypeId, updateFilters]);

    // Mientras se resuelve el contexto de auth…
    if (authLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-5">
            <Banners images={['/banner1.png', '/banner2.png', '/banner3.png', '/banner4.png']} />
            <div className="flex justify-center w-full">
                <div className="max-w-md w-full">
                    <LabeledSelect
                        label="Tipo de publicación"
                        options={["Todos", ...postTypes.map((type) => type.name)]}
                        selected={selectedPostType}
                        setSelected={setSelectedPostType}
                    />
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center mb-6">
                {error ? (
                    <div className="bg-red-100 text-red-700 p-4 rounded-md max-w-md">
                        Error al cargar los posts
                    </div>
                ) : postsLoading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-purple-500" />
                ) : posts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-4">
                        {isVisitor ? (
                            <p className="text-gray-600">Este usuario no ha hecho publicaciones aún</p>
                        ) : (
                            <p className="text-gray-600">Aún no tenés posts creados</p>
                        )}
                        <Link
                            href="/"
                            className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow hover:bg-primary/90 transition-colors"
                        >
                            <Home size={18} />
                            <span>Volver al inicio</span>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-10 mt-2 p-2">
                        {posts.map((post) => (
                            <PetCard key={post.id} post={post} isPost />
                        ))}
                    </div>
                )}
            </div>

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
