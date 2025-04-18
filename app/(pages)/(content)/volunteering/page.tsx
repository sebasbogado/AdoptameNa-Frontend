"use client";

import { useEffect, useState } from "react";
import Banners from '@/components/banners';
import PetCard from '@/components/petCard/pet-card';
import { Post } from "@/types/post";
import { getPosts } from "@/utils/posts.http";

export default function Page() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isNextPost, setIsNextPost] = useState(false);
    const pageSize = 20;

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const post = await getPosts({
                    page: currentPage,
                    size: pageSize,
                    postType: "volunteering",
                });

                const filteredPosts = post.filter((post) => post.postType.name.toLowerCase() === "volunteering");
                setPosts(filteredPosts);
            } catch (err: any) {
                console.log(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPage]);

    useEffect(() => {
        const fetchNextPost = async () => {
            try {
                const post = await getPosts({
                    page: pageSize * (currentPage + 1), // Aquí corregimos la paginación
                    size: 1, // Solo verificamos si hay al menos 1 post en la siguiente página
                    postType: "volunteering",
                });
                console.log(post)
                setIsNextPost(post.length > 0);
            } catch (err: any) {
                console.log(err.message);
                setIsNextPost(false);
            }
        };

        //evitamos hacer llamadas extras si no son necesarias
        if(posts.length === pageSize){ 
            fetchNextPost();
        }
    }, [currentPage, posts]); // Se ejecuta cada vez que cambia la página actual

    const handleNextPage = () => {
        if (isNextPost) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    const bannerImages = ["banner1.png", "banner2.png", "banner3.png", "banner4.png"];

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />

            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                    {isLoading ? (
                        <p className="text-center col-span-full text-blue-500 font-semibold">Cargando datos...</p>
                    ) : posts.length === 0 ? (
                        <p className="text-center col-span-full text-gray-500 font-semibold">No hay resultados.</p>
                    ) : (
                        posts.map((item) => (
                            <PetCard key={item.id} post={item} />
                        ))
                    )}
                </div>
            </section>

            {/* Controles de paginación */}
            <div className="flex justify-center gap-4 py-4">
                <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 0}
                    className={`px-4 py-2 rounded-md ${currentPage === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                >
                    Anterior
                </button>

                <span className="px-4 py-2 bg-gray-200 rounded-md">Página {currentPage + 1}</span>

                <button
                    onClick={handleNextPage}
                    disabled={!isNextPost}
                    className={`px-4 py-2 rounded-md ${!isNextPost ? 'bg-gray-300 cursor-not-allowed' : 'bg-purple-500 text-white hover:bg-purple-600'}`}
                >
                    Siguiente
                </button>
            </div>
        </div>
    );
}