'use client';


import Banners from '@/components/banners';
import { useEffect, useState } from 'react';

import { getPosts } from '@/utils/posts.http';
import { useParams, useRouter } from 'next/navigation';
import PetCard from '@/components/petCard/pet-card';
import LabeledSelect from '@/components/labeled-selected';
import { Post } from '@/types/post';
import Loading from '@/app/loading';



const fetchContentData = async (
    setPosts: React.Dispatch<React.SetStateAction<Post[]>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setPostsError: React.Dispatch<React.SetStateAction<string | null>>,
    userId: string,
) => {


    try {
        // Cargar posts del usuario
        const postParams = { user: userId }; // Usamos el ID del usuario actual
        const postData = await getPosts(postParams);
        setPosts(Array.isArray(postData) ? postData : []);
    } catch (err) {
        console.error("Error al cargar posts:", err);
        setPostsError("No se pudieron cargar las publicaciones."); // 👈 Manejo de error separado
    } finally {
        setLoading(false);
    }
};
export default function MyPostsPage() {
    const ciudades = ["Encarnación", "Asunción", "Luque", "Fernando Zona Sur"];
    const mascotas = ["Todos", "Conejo", "Perro", "Gato"];
    const edades = ["0-1 años", "1-3 años", "3-6 años", "6+ años"];
    const {id} = useParams();

    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [postsError, setPostsError] = useState<string | null>(null);

    const [selectedCiudad, setSelectedCiudad] = useState<string | null>(null);
    const [selectedMascota, setSelectedMascota] = useState<string | null>(null);
    const [selectedEdad, setSelectedEdad] = useState<string | null>(null);




    useEffect(() => {
        if(!id) return
        fetchContentData(setPosts, setLoading, setPostsError, id.toString());
    }, []);
    if(loading) return <Loading />
    const bannerImages = ["/banner1.png", "/banner2.png", "/banner3.png", "/banner4.png"]

    return (
        <div className='flex flex-col gap-5'>
            <Banners images={bannerImages} />

            <div className="w-full max-w-4xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    {/* Select Ciudad */}
                    <LabeledSelect
                        label="Ciudad"
                        options={ciudades}
                        selected={selectedCiudad}
                        setSelected={setSelectedCiudad}
                    />


                    {/* Select Mascota */}
                    <LabeledSelect
                        label="Mascota"
                        options={mascotas}
                        selected={selectedMascota}
                        setSelected={setSelectedMascota}
                    />

                    {/* Select Edad */}
                    <LabeledSelect
                        label="Edad"
                        options={edades}
                        selected={selectedEdad}
                        setSelected={setSelectedEdad}
                    />
                </div>
            </div>


            <section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 px-12 py-4">
                {postsError? <p className="text-center col-span-full">Hubo un error al cargar las publicaciones</p> : 
                    posts.length > 0 ? (
                        posts.map((post) => (
                            <PetCard key={post.id} post={post} />
                        ))
                    ) : (
                        <p className="text-center col-span-full">Cargando las publicaciones...</p>
                    )}

                </div>
            </section>
        </div>
    )
}
